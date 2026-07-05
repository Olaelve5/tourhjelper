import os
import requests
import psycopg2
import re
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
DB_URI = os.getenv("DB_URI_IPV4")


def get_next_stage_info():
    """Henter dynamisk ID og etappenummer for neste Tour de France-etappe"""
    list_url = "https://eu1.offering-api.kambicdn.com/offering/v2018/ubdk/listView/cycling.json?lang=da_DK&market=DK"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    try:
        response = requests.get(list_url, headers=headers)
        if response.status_code != 200:
            return None, None

        data = response.json()
        events = data.get("events", [])

        for item in events:
            event_data = item.get("event", {})
            name = event_data.get("englishName", "")

            # Ser etter events som inneholder både "Tour de France" og "Stage"
            if "Tour de France" in name and "Stage" in name:
                # Sjekk at etappen ikke allerede er i gang/ferdig
                if event_data.get("state") == "NOT_STARTED":
                    event_id = event_data.get("id")

                    # Bruk regex for å trekke ut tallet fra f.eks. "Stage 1 (Tour de France 2026)"
                    match = re.search(r"Stage (\d+)", name)
                    stage_number = int(match.group(1)) if match else None

                    return event_id, stage_number

        return None, None
    except Exception as e:
        print(f"Feil ved henting av neste etappe: {e}")
        return None, None


def get_alias_map():
    """Henter alias-mappingen fra rider_aliases-tabellen i databasen."""
    try:
        conn = psycopg2.connect(DB_URI)
        cur = conn.cursor()
        cur.execute("SELECT alias, rider_name FROM rider_aliases")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return {row[0]: row[1] for row in rows}
    except Exception as e:
        print(f"Advarsel: Kunne ikke hente alias-tabell: {e}")
        return {}


def run_scraper():
    print("Søker etter neste etappe...")

    # 1. Hent ID automatisk i stedet for å hardkode URL-en
    event_id, stage_number = get_next_stage_info()

    if not event_id:
        print(
            "Fant ingen kommende Tour de France-etapper. Kanskje rittet er ferdig eller oddsen ikke er lagt ut?"
        )
        return

    print(f"Fant Etappe {stage_number}! Henter odds...")

    # Hent alias-mapping for navnekorrigering
    alias_map = get_alias_map()
    if alias_map:
        print(f"Lastet {len(alias_map)} alias-mappinger fra databasen.")

    # 2. Sett inn den dynamiske ID-en i den URL-en du brukte i stad
    url = f"https://eu1.offering-api.kambicdn.com/offering/v2018/ubdk/betoffer/event/{event_id}.json?lang=da_DK&market=DK&channel_id=1&ncid=1769285927747&includeParticipants=true&range_size=1"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Feilet! Status code: {response.status_code}")
            return

        data = response.json()
        events = data.get("events", [])
        if not events:
            return

        race_name = events[0]["name"]
        bet_offers = data.get("betOffers", [])
        rows_to_insert = []

        for offer in bet_offers:
            if offer["criterion"]["label"] in [
                "Vinder",
                "Winner",
                "General Classification",
            ]:
                for rider in offer["outcomes"]:
                    rider_name = rider["label"]

                    if "odds" not in rider:
                        continue

                    # Normaliser navnet via alias-tabellen
                    rider_name = alias_map.get(rider_name, rider_name)

                    real_odds = rider["odds"] / 1000.0

                    rows_to_insert.append(
                        (
                            race_name,
                            "STAGE_WINNER",
                            stage_number,
                            rider_name,
                            real_odds,
                            datetime.now(),
                        )
                    )

        # 3. Lagre til Supabase
        if rows_to_insert:
            conn = psycopg2.connect(DB_URI)
            cur = conn.cursor()

            cur.execute("""
        CREATE TABLE IF NOT EXISTS cycling_odds (
            id            BIGSERIAL PRIMARY KEY,
            race_name     TEXT        NOT NULL,
            market_type   TEXT        NOT NULL,
            stage_number  INTEGER,
            rider_name    TEXT        NOT NULL,
            odds          NUMERIC(10, 3) NOT NULL,
            scraped_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    """)

            args_str = ",".join(
                cur.mogrify("(%s,%s,%s,%s,%s,%s)", x).decode("utf-8")
                for x in rows_to_insert
            )

            cur.execute("""
                INSERT INTO cycling_odds 
                (race_name, market_type, stage_number, rider_name, odds, scraped_at) 
                VALUES 
            """ + args_str)

            conn.commit()
            cur.close()
            conn.close()
            print(
                f"--- SUKSESS: Lagret {len(rows_to_insert)} ryttere for etappe {stage_number} ---"
            )
        else:
            print("Fant ingen odds å lagre.")

    except Exception as e:
        print(f"Script Error: {e}")


if __name__ == "__main__":
    run_scraper()

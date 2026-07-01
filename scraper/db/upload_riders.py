import json
import re
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
DB_URI = os.getenv("DB_URI")

def parse_price(raw):
    if raw is None:
        return None
    s = str(raw).strip().upper().replace(",", ".")
    m = re.match(r"^\s*([\d.]+)\s*M?\s*$", s)
    return float(m.group(1)) if m else None


def upload_riders():
    # 1. Load the JSON file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, "..", "data", "rider_data.json")

    with open(json_path, "r", encoding="utf-8") as f:
        riders = json.load(f)

    print(f"Loaded {len(riders)} riders from JSON (source: {json_path}).")

    try:
        conn = psycopg2.connect(DB_URI)
        cur = conn.cursor()

        # 2. SQL Query for "Upsert" (Insert on Conflict Update)
        # This says: Try to insert. If 'name' exists, update the price and points instead.
        upsert_query = """
            INSERT INTO riders (name, category, team, price, total_points, image_url, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
            ON CONFLICT (name) 
            DO UPDATE SET 
                price = EXCLUDED.price,
                total_points = EXCLUDED.total_points,
                team = EXCLUDED.team,
                category = EXCLUDED.category,
                image_url = EXCLUDED.image_url,
                updated_at = NOW();
        """

        for r in riders:
            cur.execute(
                upsert_query,
                (r["name"], r["category"], r["team"], parse_price(r["price"]), r["totalPoints"], r["image_url"]),
            )

        conn.commit()
        cur.close()
        conn.close()
        print("--- Successfully uploaded/updated all riders ---")

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    upload_riders()

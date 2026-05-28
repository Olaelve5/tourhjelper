import json
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
DB_URI = os.getenv("DB_URI")


def upload_riders():
    # 1. Load the JSON file
    json_path = "../tourhjelper/public/data/rider_data.json"
    if not os.path.exists(json_path):
        json_path = "rider_data.json"

    with open(json_path, "r", encoding="utf-8") as f:
        riders = json.load(f)

    print(f"Loaded {len(riders)} riders from JSON (source: {json_path}).")

    try:
        conn = psycopg2.connect(DB_URI)
        cur = conn.cursor()

        # 2. SQL Query for "Upsert" (Insert on Conflict Update)
        # This says: Try to insert. If 'name' exists, update the price and points instead.
        upsert_query = """
            INSERT INTO riders (name, category, team, price, total_points, updated_at)
            VALUES (%s, %s, %s, %s, %s, NOW())
            ON CONFLICT (name) 
            DO UPDATE SET 
                price = EXCLUDED.price,
                total_points = EXCLUDED.total_points,
                team = EXCLUDED.team,
                category = EXCLUDED.category,
                updated_at = NOW();
        """

        for r in riders:
            cur.execute(
                upsert_query,
                (r["name"], r["category"], r["team"], r["price"], r["totalPoints"]),
            )

        conn.commit()
        cur.close()
        conn.close()
        print("--- Successfully uploaded/updated all riders ---")

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    upload_riders()

import json
import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
DB_URI = os.getenv("DB_URI")

def upload_stages():
    # 1. Load the JSON file
    # Ensure this filename matches your actual JSON file
    filename = "../tourhjelper/public/data/stage_data.json"
    if not os.path.exists(filename):
        filename = "stage_data.json" 
    
    if not os.path.exists(filename):
        print(f"Error: File '{filename}' not found.")
        return

    with open(filename, "r", encoding="utf-8") as f:
        stages = json.load(f)

    print(f"Loaded {len(stages)} stages from JSON.")

    try:
        conn = psycopg2.connect(DB_URI)
        cur = conn.cursor()

        # 2. SQL Query for "Upsert"
        # We use 'stage_number' as the unique key to check for conflicts.
        # Note: We do NOT update the favorites (stars_1, stars_2, etc.) here,
        # so this script won't accidentally wipe your admin work if you run it later.
        upsert_query = """
            INSERT INTO stages (
                stage_number, 
                date, 
                start_time, 
                distance, 
                type, 
                image_url, 
                updated_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
            ON CONFLICT (stage_number) 
            DO UPDATE SET 
                date = EXCLUDED.date,
                start_time = EXCLUDED.start_time,
                distance = EXCLUDED.distance,
                type = EXCLUDED.type,
                image_url = EXCLUDED.image_url,
                updated_at = NOW();
        """

        for s in stages:
            # Map JSON keys to the query placeholders
            cur.execute(
                upsert_query,
                (
                    s["stage"],      # stage_number
                    s["date"],       # date
                    s["start"],      # start_time
                    s["distance"],   # distance
                    s["type"],       # type
                    s["imageURL"]    # image_url
                ),
            )

        conn.commit()
        cur.close()
        conn.close()
        print("--- Successfully uploaded/updated all stages ---")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    upload_stages()
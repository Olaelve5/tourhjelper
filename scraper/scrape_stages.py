from datetime import datetime
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import (
    InvalidArgumentException,
)
import time
import shutil
import os


def clear_cache():
    cache_dir = os.path.expanduser("~/.wdm")
    if os.path.exists(cache_dir):
        shutil.rmtree(cache_dir)


def main():
    clear_cache()
    # Initialize Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")

    # Determine the save directory: always scraper/data relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(script_dir, "data")
    os.makedirs(data_dir, exist_ok=True)

    stages_data_path = os.path.join(data_dir, "stage_data.json")

    # Initialize the Chrome driver with options
    driver = webdriver.Chrome(options=chrome_options)

    stages = []

    try:
        for i in range(1, 22):
            print(f"Processing stage {i}")
            url = f"https://www.letour.fr/en/stage-{i}"
            try:
                driver.get(url)
                time.sleep(2)

                stage = {}

                stage["stage"] = i
                print(f"Stage: {stage['stage']}")

                date = driver.execute_script(
                    'return document.querySelector("body > div.grid-container > main > div.content-header > div > div > div.stageHeader__stage.stageHeader__stage--main > div > div > div.stageHeader__infos__date").textContent'
                ).strip()
                date_parts = date.split(" ")
                stage["date"] = date_parts[1].strip()
                print(f"Date: {stage['date']}")

                try:
                    stage["start"] = driver.execute_script(
                        'return document.querySelector("#itinerary > table > tbody.tbody > tr.itinerary__checkpoint--r > td:nth-child(6)").textContent'
                    )
                    print(f"Start: {stage['start']}")
                except Exception as e:
                    print(f"Could not extract start time for stage {i}")
                    stage["start"] = ""
                
                distance = driver.execute_script(
                    'return document.querySelector("body > div.grid-container > main > div.content-header > div > div > div.stageHeader__stage.stageHeader__stage--main > div > div > div.stageHeader__bottom > div:nth-child(1) > p").textContent'
                ).strip()
                distance_parts = distance.split("\n")
                stage["distance"] = distance_parts[1].strip()
                print(f"Distance: {stage['distance']}")

                stage_type = driver.execute_script(
                    'return document.querySelector("body > div.grid-container > main > div.content-header > div > div > div.stageHeader__stage.stageHeader__stage--main > div > div > div.stageHeader__bottom > div:nth-child(2) > p").textContent'
                ).strip()
                type_parts = stage_type.split("\n")
                stage["type"] = type_parts[1].strip()
                print(f"Type: {stage['type']}")

                image_element = driver.execute_script(
                    'return document.querySelector("#profil > img")'
                )
                image_url = image_element.get_attribute("src")
                if image_url.startswith("data:"):
                    image_url = image_element.get_attribute(
                        "data-src"
                    ) or image_element.get_attribute("data-lazy-src")
                stage["imageURL"] = image_url
                print(f"Image URL: {stage['imageURL']}")

                stage["lastUpdated"] = datetime.now().isoformat()

                stages.append(stage)

            except InvalidArgumentException as e:
                print(f"Invalid URL: {url}")
                print(e)
            except Exception as e:
                print(f"An error occurred while processing URL: {url}")
                print(e)
    finally:
        driver.quit()

    with open(stages_data_path, "w", encoding="utf-8") as f:
        json.dump(stages, f, ensure_ascii=False, indent=4)

    # write_stages(stages)


if __name__ == "__main__":
    main()

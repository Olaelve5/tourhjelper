import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import StaleElementReferenceException
from webdriver_manager.chrome import ChromeDriverManager
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
    chrome_options.add_argument("--headless")  # Run Chrome in headless mode

    # Initialize the Chrome driver with options
    driver = webdriver.Chrome(options=chrome_options)

    driver.get("https://www.tourmanager.no/create-squad/tourmanager26")
    time.sleep(2)

    riders = []
    rider_images = []

    def fetch_riders():
        new_riders = driver.execute_script("""
        const rows = document.querySelectorAll(
            "#mcs-players-anchor > div.mcs-player-list.svelte-2yxrkk > div"
        );
        return Array.from(rows).map(row => {
            const q = (sel) => {
                const el = row.querySelector(sel);
                return el ? el.textContent.trim() : null;
            };
            const img = row.querySelector("img");
            return {
                name:         q("span.mcs-player-name"),
                team:         q("span.mcs-team-name"),
                category:     q("span.mcs-pos-tag"),
                price: q("span.mcs-player-price"),
                totalPoints:  0,
                image_url:     img ? img.src : null
            };
        });
    """)

        print(f"Fant {len(new_riders)} ryttere")
        for r in new_riders:
            print(r)
            if r not in riders:
                riders.append(r)
                if r["image_url"] and r["image_url"] not in rider_images:
                    rider_images.append(r["image_url"])

    while True:
        try:
            button = driver.execute_script(
                'return document.querySelector("body > div:nth-child(1) > div.page-container.svelte-1ayedbt > div.main-content.svelte-1ayedbt.mc-cyc > aside > div.player-list.svelte-1ayedbt > div.pagination.svelte-1ayedbt > button")'
            )

            fetch_riders()

            if not button or button.disabled:
                print("No more pages to load.")
                break

            driver.execute_script("arguments[0].click()", button)
            time.sleep(1)

        except StaleElementReferenceException:
            print(
                "StaleElementReferenceException caught, trying to find the button again."
            )
            continue

    driver.quit()

    # Determine the save directory: always scraper/data relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(script_dir, "data")
    os.makedirs(data_dir, exist_ok=True)

    rider_data_path = os.path.join(data_dir, "rider_data.json")
    rider_image_links_path = os.path.join(data_dir, "rider_image_links.json")

    # After fetching all riders, write them to a JSON file
    with open(rider_data_path, "w", encoding="utf-8") as f:
        json.dump(riders, f, ensure_ascii=False, indent=4)

    with open(rider_image_links_path, "w", encoding="utf-8") as f:
        json.dump(rider_images, f, ensure_ascii=False, indent=4)


if __name__ == "__main__":
    main()

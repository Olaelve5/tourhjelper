import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import StaleElementReferenceException
from webdriver_manager.chrome import ChromeDriverManager
import time
import shutil
import os
from firebase_config import write_riders, write_rider_images

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
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    driver.get("https://tourmanager.tv2.no/media-stats/898994")
    time.sleep(5)

    riders = []
    rider_images = []

    def fetch_riders():
        i = 1
        while True:
            base_rider = driver.execute_script(f'return document.querySelector("body > div.view-container > sgg-media-stats-page").shadowRoot.querySelector("div > ft-media-stats").shadowRoot.querySelector("div.table > table > tbody > tr:nth-child({i})")')
            
            if base_rider is None:
                break
                
            
            rider = {}
            attributesList = [
                'name',
                'position',
                'team',
                'price',
                'totalPoints',
            ]

            for attribute in attributesList:
                value = driver.execute_script(f'return document.querySelector("body > div.view-container > sgg-media-stats-page").shadowRoot.querySelector("div > ft-media-stats").shadowRoot.querySelector("div.table > table > tbody > tr:nth-child({i}) > td.{attribute}").textContent')
                
                if attribute == 'position':
                    rider['category'] = value.strip()
                else:
                    rider[attribute] = value.strip()
            
            rider['price'] = float(rider['price'].replace("M", ""))
            rider['totalPoints'] = int(rider['totalPoints'].replace(".00", ""))

            # Find the image link
            rider_image_link = driver.execute_script(f'return document.querySelector("body > div.view-container > sgg-media-stats-page").shadowRoot.querySelector("div > ft-media-stats").shadowRoot.querySelector("div.table > table > tbody > tr:nth-child({i}) > td.name > ft-link > img").src')
            if not any(d.get('image') == rider_image_link for d in rider_images):
                rider_images.append({
                    'team': rider['team'],
                    'image': rider_image_link
                })

            print(rider)
            riders.append(rider)

            i += 1
            base_rider = driver.execute_script(f'return document.querySelector("body > div.view-container > sgg-media-stats-page").shadowRoot.querySelector("div > ft-media-stats").shadowRoot.querySelector("div.table > table > tbody > tr:nth-child({i})")')


    while True:
            try:
                button = driver.execute_script('return document.querySelector("body > div.view-container > sgg-media-stats-page").shadowRoot.querySelector("div > ft-media-stats").shadowRoot.querySelector("ft-pagination").shadowRoot.querySelector("ul > li:nth-child(4) > ft-button").shadowRoot.querySelector("button")')
                
                button_container = driver.execute_script('''
                        var button = document.querySelector("body > div.view-container > sgg-media-stats-page").shadowRoot.querySelector("div > ft-media-stats").shadowRoot.querySelector("ft-pagination").shadowRoot.querySelector("ul > li:nth-child(4)");
                        return button ? button.className : null;
                        ''')
                
                fetch_riders()
                
                if button_container.strip() != "pager":
                    print("No more pages to load.")
                    break

                driver.execute_script('arguments[0].click()', button)
                time.sleep(2)
                
            except StaleElementReferenceException:
                print("StaleElementReferenceException caught, trying to find the button again.")
                continue 
    
    driver.quit()

    # Navigate up two directories and then into the `public` directory
    rider_data_path = 'public/data/rider_data.json'
    rider_image_links_path = 'public/data/rider_image_links.json'

    # After fetching all riders, write them to a JSON file
    with open(rider_data_path, 'w', encoding='utf-8') as f:
        json.dump(riders, f, ensure_ascii=False, indent=4)

    with open(rider_image_links_path, 'w', encoding='utf-8') as f:
        json.dump(rider_images, f, ensure_ascii=False, indent=4)
    
    write_riders(riders)
    write_rider_images(rider_images)
        

if __name__ == "__main__":
    main()
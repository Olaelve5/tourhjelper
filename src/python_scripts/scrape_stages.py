from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import StaleElementReferenceException, InvalidArgumentException
from webdriver_manager.chrome import ChromeDriverManager
import time
from firebase_config import write_stages

def main():
    # Initialize Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run Chrome in headless mode

    # Initialize the Chrome driver with options
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    stages = []

    try:
        for i in range(1, 22):
            print(f"Processing stage {i}")
            url = f'https://www.letour.fr/en/stage-{i}'
            try:
                driver.get(url)
                time.sleep(2)

                stage = {}  

                stage['stage'] = i
                
                date = driver.execute_script('return document.querySelector("body > div.grid-container > main > div.content-header > div > div > div.stageHeader__stage.stageHeader__stage--main > div > div > div.stageHeader__infos__date").textContent').strip()
                date_parts = date.split(' ')
                stage['date'] = date_parts[1].strip()

                stage['start'] = driver.execute_script('return document.querySelector("#itinerary > table > tbody.tbody > tr.itinerary__checkpoint--r > td:nth-child(6)").textContent')
                
                distance = driver.execute_script('return document.querySelector("body > div.grid-container > main > div.content-header > div > div > div.stageHeader__stage.stageHeader__stage--main > div > div > div.stageHeader__bottom > div:nth-child(1) > p").textContent').strip()
                distance_parts = distance.split('\n')
                stage['distance'] = distance_parts[1].strip()

                stage_type = driver.execute_script('return document.querySelector("body > div.grid-container > main > div.content-header > div > div > div.stageHeader__stage.stageHeader__stage--main > div > div > div.stageHeader__bottom > div:nth-child(2) > p").textContent').strip()
                type_parts = stage_type.split('\n')
                stage['type'] = type_parts[1].strip()

                image_element = driver.execute_script('return document.querySelector("#profil > img")')
                image_url = image_element.get_attribute("src")
                if image_url.startswith("data:"):
                    image_url = image_element.get_attribute("data-src") or image_element.get_attribute("data-lazy-src")
                stage['imageURL'] = image_url

                stage['lastUpdated'] = datetime.now().isoformat()

                stages.append(stage)    

            except InvalidArgumentException as e:
                print(f"Invalid URL: {url}")
                print(e)
            except Exception as e:
                print(f"An error occurred while processing URL: {url}")
                print(e)
    finally:
        driver.quit()

    write_stages(stages)

if __name__ == "__main__":
    main()
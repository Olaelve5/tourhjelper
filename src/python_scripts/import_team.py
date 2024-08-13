from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import StaleElementReferenceException
from webdriver_manager.chrome import ChromeDriverManager
import time
import sys
import json
import shutil
import os

def clear_cache():
    cache_dir = os.path.expanduser("~/.wdm")
    if os.path.exists(cache_dir):
        shutil.rmtree(cache_dir)


positions = [
    {'captain': 2},
    {'tempo': 1},
    {'manager': 1},
    {'youth': 2},
    {'climber': 2},
    {'sprinter': 2},
    {'support': 3}
]

team_abbriviations = {
    'EF': 'EF Education - EasyPost',
    'UAE': 'UAE Team Emirates',
    'TEA': 'Team Visma | Lease a Bike',
    'RED': 'Red Bull - BORA - hansgrohe',
    'ALP': 'Alpecin - Deceuninck',
    'SOU': 'Soudal Quick-Step',
    'INE': 'INEOS Grenadiers',
    'MOV': 'Movistar Team',
    'LID': 'Lidl - Trek',
    'TEA': 'Team Jayco AlUla',
    'DEC': 'Decathlon AG2R La Mondiale Team',
    'TEA': 'Team dsm-firmenich PostNL',
    'BAH': 'Bahrain Victorious',
    'GRO': 'Groupama - FDJ',
    'ISR': 'Israel - Premier Tech',
    'LOT': 'Lotto Dstny',
    'AST': 'Astana Qazaqstan Team',
    'COF': 'Cofidis',
    'INT': 'Intermarché - Wanty',
    'ARK': 'Arkéa - B&B Hotels',
    'UNO': 'Uno-X Mobility',
    'TOT': 'TotalEnergies'
}

visma_names = [
    'Vingegaard',
    'van Aert',
    'Team Visma | Lease a Bike',
    'Laporte',
    'Kuss',
    'Jorgenson',
    'Kelderman',
    'Benoot',
    'Lemmen',
    'Tratnik'
]

jayco_names = [
    'Yates',
    'Team Jayco AlUla',
    'Groenewegen',
    'Matthews',
    'Mezgec',
    'Harper',
    'Durbridge',
    'Juul-Jensen',
    'Reinders',
]

dsm_names = [
    'Team dsm-firmenich PostNL',
    'Jakobsen',
    'Bardet',
    'Barguil',
    'Welten',
    'Onley',
    'Degenkolb',
    'Eekhoff',
    'van den Broek'
]

def findTeam(name, abr):
    if abr == 'TEA':
        if name in visma_names:
            return 'Team Visma | Lease a Bike'
        elif name in jayco_names:
            return 'Team Jayco AlUla'
        elif name in dsm_names:
            return 'Team dsm-firmenich PostNL'
    else:
        return team_abbriviations[abr]

def main():
    clear_cache()

    # Initialize Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run Chrome in headless mode

    # Initialize the Chrome driver with options
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    id = sys.argv[1]
    driver.get(f'https://tourmanager.tv2.no/dashboard/898994/{id}/10')
    time.sleep(5)

    riders = []
    
    for position in positions:
        for category, amount in position.items():
            for i in range(1, amount + 1):
                rider = driver.execute_script(f'return document.querySelector("body > div.view-container > smg-dashboard-page").shadowRoot.querySelector("ft-fantasy-game").shadowRoot.querySelector("div.middle > section.field > ft-game-area > div.position.{category} > ft-field-slot:nth-child({i}) > ft-button.name")')
                rider_team_abr = driver.execute_script(f'return document.querySelector("body > div.view-container > smg-dashboard-page").shadowRoot.querySelector("ft-fantasy-game").shadowRoot.querySelector("div.middle > section.field > ft-game-area > div.position.{category} > ft-field-slot:nth-child({i}) > ft-button.match > span")')
                rider_team = findTeam(rider.text, rider_team_abr.text)
                riders.append({'name': rider.text, 'team': rider_team})
    
    transfers_used = driver.execute_script('return document.querySelector("body > div.view-container > smg-dashboard-page").shadowRoot.querySelector("ft-fantasy-game").shadowRoot.querySelector("div.left > section.current-team > footer > div:nth-child(2) > b").textContent')
    
    result = {
        'team': riders,
        'transfers_used': transfers_used
    }

    print(json.dumps(result))

if __name__ == "__main__":
    main()
# Tourhjelper 🚴‍♀️🇫🇷

Tourhjelper is a planning tool for the fantasy game [Tourmanager](https://tourmanager.no/). It helps you strategize and optimize your team for the Tour de France.

[Link to live demo](https://tourhjelper.vercel.app/) 🚀

## Features 🌟

* **Import Your Team**: 📥 Use your team's URL or ID to import your current team.
* **Plan for Every Stage**: 🗺️ Strategize your team composition for all 21 stages.
* **Compare Strategies**: 🤔 Create and compare up to three different plans.
* **Manage Riders and Teams**: 🚲 A full rider market with filtering and sorting.
* **Detailed Stage Info**: 📊 In-depth stage profiles, distances, and expert predictions.

## Screenshots 📷

####  Import team and plan ahead
<img width="1301" height="774" alt="Skjermbilde 2025-07-14 kl  19 02 11" src="https://github.com/user-attachments/assets/41aaf5d3-8d17-46f5-8619-daaa1271a124" />

#### Overview of stages and favorites
<img width="1321" height="774" alt="Skjermbilde 2025-07-14 kl  19 02 43" src="https://github.com/user-attachments/assets/254b3c1d-970f-4d63-9a09-72409fac53d8" />


## Technical Stack 💻

* **Framework**: Next.js
* **Language**: TypeScript
* **UI**: Mantine
* **State Management**: React Context
* **Data Scraping**: Python (Selenium, BeautifulSoup)
* **Deployment**: Vercel

## Monorepo Structure 📂

This project is organized as a monorepo:
* **`tourhjelper/`**: The Next.js web application frontend and backend.
* **`scraper/`**: Python scripts for data scraping and database synchronization.

---

## Getting Started 🛠️

### 1. Web Application (`tourhjelper/`)
Navigate to the web app directory to run the Next.js frontend:
```sh
cd tourhjelper
npm install
npm run dev
```

### 2. Scraping and Database Pipelines (`scraper/`)
The Python scraping scripts are located in `scraper/`. They dynamically read from the Next.js `public/data/` directory as the single source of truth for local data.
```sh
cd scraper
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scrape.py         # Scraping odds
python upload_riders.py  # Uploading/upserting riders
python upload_stages.py  # Uploading/upserting stages
```

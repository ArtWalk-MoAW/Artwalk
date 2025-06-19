# 🖼️ Art Walk – An AI-Powered Public Art Discovery App

**Art Walk** is a mobile application that allows users to discover and explore public art using artificial intelligence (crewai).The app identifies artworks from photos, provides detailed information, plans custom art routes through the city, and offers audio guides for an immersive experience.

---

## 📲 Features

### 🎯 Image Recognition & Artwork Identification
- Users can take or upload a photo of an artwork.
- The app uses AI (LLava + CrewAI agents) to analyze and recognize the artwork.
- Automatically displays the artwork's title, artist, creation date, and style.

### 🗺️ Art Route Planning
- Integrated map shows artworks across the city.
- Users can plan personalized routes based on interest, distance, or art style.
- Suggested thematic routes, e.g., "Street Art", "Modern Sculptures", etc.

### 📄 Artwork Detail View
- Each recognized or selected artwork has its own detail page, including:
  - Title & Artist
  - Year of creation & Art style
  - Background & significance
  - Location on the map

### 🔊 Built-in Audio Guide
- Every artwork features an audio guide.
- Text-to-speech reads out the information from the detail view.
- Perfect for hands-free walking tours.

### 💾 Save Artworks & Routes
- Users can save favorite artworks to a personal list.
- Routes can be saved, named, and reopened later.
- Local data storage enables offline access during city exploration.

---

## 🧠 Technical Overview

| Component           | Description                         |
|---------------------|--------------------------------------|
| **Frontend**        | React Native + Expo                  |
| **Backend**         | Python (FastAPI), CrewAI, Ollama     |
| **Image Analysis**  | LLava via CrewAI agents              |
| **Storage**         | To be done                           |
| **Audio Output**    | TTS                        |


The Data for the Artworks within Germany has been provided by:
https://streetartcities.com/open-data

---

## 🚀 Getting Started

```bash
# Start frontend
cd frontend
npm install

-> change IP in scanner.tsx and hooks/useExhibitionData.tsx (ipconfig getifaddr en0)
cd artwalk-app
npx expo start

# Build backend
cd backend
poetry install
poerty shell
uv tool install crewai

cd ..
-> open docker app 
docker-compose build

# Start backend and TTS Service
docker-compose up
`
‼️IMPORTANT: Make sure your Python Version is below 3.13 or >= 3.10‼️

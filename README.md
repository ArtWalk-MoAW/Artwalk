# 🖼️ Art Walk – An AI-Powered Public Art Discovery App

**Art Walk** is a mobile application that allows users to discover and explore public art using artificial intelligence (crewai and ollama).The app identifies artworks from photos, provides detailed information, plans custom art routes through the city, and offers audio guides for an immersive experience.

---

## 📲 Features

### 🎯 Image Recognition & Artwork Identification
- Users can take or upload a photo of an artwork
- *Note: Unfortunatley ollama only recognizes very popular artworks Like "Mona Lisa" or "Starry Night"*
- The app uses AI (LLava + CrewAI agents) to analyze and recognize the artwork
- Creates a JSOn File with the Artwork Title, Artist Name and a short description

### 📄 Artwork Detail View
- Each recognized or selected artwork has its own detail page, including:
  - Title & Artist
  - Year of creation & Art style
  - Background & significance
  - Similiar Artworks

### 🗺️ Art Route Planning
- Integrated map shows artworks across the city
- *Note: due to the scope of the project, we have decided to only show Munich's artworks on the map*
- Users can plan personalized routes based on interest, distance, or art style
- Suggested thematic routes based on the users preferences

### 🔊 Built-in Audio Guide
- Every scanned artwork features an audio guide
- Text-to-speech reads out a small podcast based on the detail view
- Perfect for hands-free walking tours

### 💾 Save Artworks & Routes
- Users can save favorite artworks from the map or scanned artworks to a personal list.

---

## 🧠 Technical Overview

| Component           | Description                         |
|---------------------|--------------------------------------|
| **Frontend**        | React Native + Expo                  |
| **Backend**         | Python (FastAPI), CrewAI, Ollama     |
| **Image Analysis**  | LLava via CrewAI agents              |
| **Audio Output**    | TTS, Llama3 via CrewAI agents        |
| **Routes**          | LLama3 via CrewAI agents             |


The Data for the Artworks within Germany has been provided by:
https://streetartcities.com/open-data

---

**Know Problems**

Unfortunately there are some problems you might encounter while using our app.

*Story Audio:*
- After pressing on the Play Button in the Middle of the Detail Page after a scan, the audio is loaded and you are automatically switched to the player view. However you wont be able to play the audio in this stage.
What to do:
- Go back to the Detail Page via the arrow on the left side
- Press the Play Button again
- If you still cant hear anything, turn on your notification sounds

*Map/ Homescreen:*
- Pressing on a Location Needle sometimes needs two tries before it will show you the Description Page



---

## 🚀 Getting Started

```bash
# Start frontend
cd Frontend/artwalk-app
npm install

# enter your IP Adress into the .env.example file and delete ".example"
# you can find out your Ip Adress via this command:
ipconfig getifaddr en0

npx expo start
# Expo Go app Installieren
# Scan QR code with the Kamera of your phone

# Build backend
cd Backend
poetry install
poetry shell

#in Backend/App:
# enter your IP Adress into the .env.example file and delete ".example"
# you can find out your Ip Adress via this command:
ipconfig getifaddr en0

cd ..
# install docker app  through the download on this website
https://www.docker.com/products/docker-desktop/
# open docker app 
docker-compose build

# Start backend and TTS Service
docker-compose up

# Install Ollama on your device through the download on this website:
https://ollama.com

#start Ollama
ollama serve

# install llava and llama3
ollama pull llama3
ollama pull llava

# check if everything is installed correctly
ollama list

# install LiteLLM
cd Backend
pip install litellm

#in tts_service:
# enter your IP Adress into the .env.example file and delete ".example"
# you can find out your Ip Adress via this command:
ipconfig getifaddr en0

`
‼️IMPORTANT: Make sure your Python Version is below 3.13 or >= 3.10‼️

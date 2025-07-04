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
| **Detail View**     | LLama3 via CrewAI agents             |
| **Audio Output**    | TTS, Llama3 via CrewAI agents        |
| **Routes**          | LLama3 via CrewAI agents             |


The Data for the Artworks within Germany has been provided by:
https://streetartcities.com/open-data

---

**Know Problems**

Unfortunately there are some problems you might encounter while using our app.

- **Map view reacts delayed**: The first time a marker is tapped on the map, the corresponding
overview might not open directly. The detailed view is then loaded correctly on the second attempt
--> This behavior is probably related to the rendering behavior of the map component
  
- **Detail-Crew occasionally generates incorrect JSON data**: The communication between the CrewAI agent for the detail view and the backend is based on
JSON objects. In some cases, the agent generates invalid JSON
- e.g. with syntax errors or missing characters - which means that no content is displayed and an error message will occur

- **Audio playback only works the second time**: The first time you press
the audio button, often nothing happens. Only after leaving the detailed view and opening
again does playback work.
The TTS file is probably not created or integrated correctly when loading for the first time.

- **Limited image recognition for free art**: LLaVA via Ollama currently only recognizes
very well-known works such as:

  - Starry Night by Vincent van Gogh
  - Mona Lisa by Leonardo da Vinci
  - The Great Wave off Kanagawa by Katsushika Hokusai
 
Other or more local works are usually not recognized or incorrectly assigned. The
automatic image analysis is therefore severely restricted, especially in the case of unknown street art

- **Route planning does not recognize district or style correctly**: When creating a route, it can happen that the current district is not recognized correctly



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
# Scan QR code with the Camera of your phone

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

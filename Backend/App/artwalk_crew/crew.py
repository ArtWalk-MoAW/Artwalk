from crewai import Crew, LLM
from artwalk_crew.tools.audio_guide_tool import AudioGuideAgent

llm = LLM(
    model="ollama/llama3",
    base_url="http://localhost:11434",
    temperature=0.1
)

# Deinen Agenten instanziieren
audio_guide_agent = AudioGuideAgent(
    role="Audio Guide Agent",
    goal="Wandelt Text in eine MP3-Datei um",
    backstory="Hilft Benutzern, Audioguides zu generieren.",
    llm=llm
)

# Die Crew definieren
crew = Crew(
    agents=[audio_guide_agent],
    verbose=True
)

if __name__ == "__main__":
    # Dummy-Text
    text = "Das ist ein Testtext für die Audioausgabe."
    result = crew.run(input=text)
    print("Ergebnis:", result)

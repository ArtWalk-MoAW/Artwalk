import json
import copy
from pathlib import Path
from storyaudio.src.storyaudio.crew import StoryAudioCrew

def run_story_audio(art_json: dict) -> dict:
    # 🎯 artworkId generieren (aus Original-Dict!)
    title = art_json.get("artwork_analysis", {}).get("title", "untitled")
    artwork_id = (
        title.lower()
        .replace(" ", "_")
        .replace(".", "")
        .replace(",", "")
        .replace(":", "")
        .replace("'", "")
        .replace('"', "")
    )

    # ✅ Übergabe für CrewAI vorbereiten (nur das!)
    crew_input = json.loads(json.dumps(copy.deepcopy(art_json), default=str))

    try:
        result = StoryAudioCrew().crew().kickoff(inputs={"art_json": crew_input})
        story_text = str(result)
    except Exception as e:
        print("❌ Fehler beim Story-Agent:", e)
        return {"artworkId": artwork_id, "storyText": ""}

    # 💾 JSON speichern
    output_path = Path("/app/shared-data/story_output.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump({
            "artworkId": artwork_id,
            "storyText": story_text
        }, f, indent=2, ensure_ascii=False)

    return {"artworkId": artwork_id, "storyText": story_text}

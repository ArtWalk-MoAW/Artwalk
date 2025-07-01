import json
import copy
from pathlib import Path
from storyaudio.src.storyaudio.crew import StoryAudioCrew

def run_story_audio(art_json: dict) -> dict:
    # ✅ Nutze vorhandene artworkId oder generiere aus Titel
    artwork_id = art_json.get("artworkId")
    if not artwork_id:
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

    # ✅ Input an Crew vorbereiten
    crew_input = json.loads(json.dumps(copy.deepcopy(art_json), default=str))

    try:
        result = StoryAudioCrew().crew().kickoff(inputs={"art_json": crew_input})
        story_text = str(result)

        # 🧼 Entferne Anführungszeichen, wenn nötig
        if story_text.startswith('"') and story_text.endswith('"'):
            story_text = story_text[1:-1]

        # 🧽 Korrigiere Zeilenumbrüche (falls escaped)
        story_text = story_text.replace('\\n', '\n')

    except Exception as e:
        print("❌ Fehler beim Story-Agent:", e)
        return {"artworkId": artwork_id, "storyText": ""}

    # 💾 In story_output.json schreiben
    output_path = Path("/app/shared-data/story_output.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump({
            "artworkId": artwork_id,
            "storyText": story_text
        }, f, indent=2, ensure_ascii=False)

    return {"artworkId": artwork_id, "storyText": story_text}

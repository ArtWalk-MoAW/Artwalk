import json
from crew import StoryAudioCrew
from pathlib import Path

def run_story_audio_from_json():
    try:
        json_path = Path("/app/final_art_report.json")

        if not json_path.exists():
            raise FileNotFoundError(f"{json_path} wurde nicht gefunden.")

        with json_path.open("r", encoding="utf-8") as f:
            art_json = json.load(f)

        inputs = {"art_json": art_json}

        result = StoryAudioCrew().crew().kickoff(inputs=inputs)

        # 🎯 artworkId aus Titel generieren
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

        output_path = Path("/app/shared-data/story_output.json")
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with output_path.open("w", encoding="utf-8") as f:
            json.dump({
                "artworkId": artwork_id,
                "storyText": str(result)
            }, f, indent=2, ensure_ascii=False)

        print("✅ Story + artworkId gespeichert unter shared-data/story_output.json")
        return result

    except Exception as e:
        raise Exception(f"Storyaudio Crew failed: {e}")

if __name__ == "__main__":
    final_result = run_story_audio_from_json()
    print("🎧 Storyaudio result:\n", final_result)

#!/usr/bin/env python
import sys
import warnings
import os
import json
from datetime import datetime

from classify_image.crew import ClassifyImage
import traceback

from classify_image.tools.llava_tool import LLavaTool

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

import re

def extract_json_from_response(raw_text):
    """
    Entfernt evtl. Markdown-Formatierungen und extrahiert das reine JSON.
    """
    # Entferne ```json und ```
    cleaned_text = re.sub(r"```json\s*", "", raw_text)
    cleaned_text = re.sub(r"```", "", cleaned_text)
    cleaned_text = cleaned_text.strip()

    return cleaned_text

def run():
    """
    Run the crew.
    """
    inputs = {
        'topic': 'Public Artworks',
        'current_year': str(datetime.now().year)
    }
    
    try:
        ClassifyImage().crew().kickoff(inputs=inputs)
    except Exception as e:
        traceback.print_exc()
        raise Exception(f"An error occurred while running the crew: {e}")


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "topic": "AI LLMs",
        'current_year': str(datetime.now().year)
    }
    try:
        ClassifyImage().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        ClassifyImage().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        "topic": "AI LLMs",
        "current_year": str(datetime.now().year)
    }
    
    try:
        ClassifyImage().crew().test(n_iterations=int(sys.argv[1]), eval_llm=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")


def run_crew_on_image(image_path: str):
    """
    Run the crew on a specific image and save the output to a JSON file.
    """
    try:
        # 1. Initialisiere das Tool
        llava_tool = LLavaTool()

        # 2. Bild analysieren lassen
        print(f"🖼 Analysiere Bild: {image_path}")
        image_description = llava_tool.run(
            image_path=image_path,
            base_url="http://host.docker.internal:11434"
        )
        print("✅ Bildbeschreibung:", image_description)

        # 3. Inputs vorbereiten
        inputs = {
            "image_description": image_description,
            "topic": "Public Artworks",
            "current_year": str(datetime.now().year)
        }

        # 4. Crew instanziieren und starten
        crew_instance = ClassifyImage()
        crew = crew_instance.crew()
        crew.kickoff(inputs=inputs)

        # 5. Ausgabe des Refinement Tasks abrufen
        refine_task = crew_instance.refine_description()
        result_text = refine_task.output.raw

        # 6. JSON validieren und speichern
        try:
            cleaned_text = extract_json_from_response(result_text)
            result_json = json.loads(cleaned_text)
        except json.JSONDecodeError as e:
            print("⚠ Fehler beim Parsen des JSON-Outputs:", e)
            print("⚠ Raw Output:", result_text)
            raise e

        os.makedirs("output", exist_ok=True)
        filename = f"output/report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(result_json, f, ensure_ascii=False, indent=4)

        print(f"✅ Bericht gespeichert unter: {filename}")

    except Exception as e:
        traceback.print_exc()
        raise Exception(f"An error occurred while running the crew on the image: {e}")
#!/usr/bin/env python
import sys
import warnings

from datetime import datetime

from classify_image.crew import ClassifyImage
import traceback

from classify_image.tools.llava_tool import LLavaTool

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

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
    Run the crew on a specific image.
    """
    try:
        # 1. Initialisiere das Tool (keine Argumente im Konstruktor!)
        llava_tool = LLavaTool()

        # 2. Bild analysieren lassen
        print(f"🖼 Analysiere Bild: {image_path}")
        image_description = llava_tool.run(
            image_path=image_path,
            base_url="http://host.docker.internal:11434"
        )
        print("✅ Bildbeschreibung:", image_description)

        # 3. Crew mit generierter Beschreibung starten
        inputs = {
            "image_description": image_description,
            "topic": "Public Artworks",
            "current_year": str(datetime.now().year)
        }

        ClassifyImage().crew().kickoff(inputs=inputs)

    except Exception as e:
        traceback.print_exc()
        raise Exception(f"An error occurred while running the crew on the image: {e}")

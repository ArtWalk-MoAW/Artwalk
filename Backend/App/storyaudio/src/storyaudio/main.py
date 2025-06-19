#!/usr/bin/env python
import sys
import warnings
from datetime import datetime
from storyaudio.tools.audio_generator import AudioGeneratorTool

def run():
    tool = AudioGeneratorTool()
    result = tool._run("Das ist ein Test")
    print("🔊 Audio gespeichert unter:", result)

if __name__ == "__main__":
    run()
from crewai.tools import BaseTool
import base64
import requests
from typing import Type
from pydantic import BaseModel, Field


class LLavaToolInput(BaseModel):
    """Input schema for LLavaTool."""
    image_path: str = Field(..., description="The local path to the image file.")
    base_url: str = Field(..., description="The base URL of the LLava model server, e.g. http://host.docker.internal:11434")


class LLavaTool(BaseTool):
    name: str = "llava_tool"
    description: str = "Tool to analyze images using the LLava model and extract title and artist."
    args_schema: Type[BaseModel] = LLavaToolInput

    def _run(self, image_path: str, base_url: str) -> str:
        try:
            with open(image_path, "rb") as image_file:
                encoded_image = base64.b64encode(image_file.read()).decode("utf-8")

            payload = {
                "model": "llava",
                "prompt": "What is the title and artist of this artwork?",
                "images": [encoded_image],
                "stream": False,
            }

            response = requests.post(f"{base_url}/api/generate", json=payload)

            if response.status_code == 200:
                result = response.json()
                return result.get("response", "No response field found in result.")
            else:
                raise Exception(f"Error {response.status_code}: {response.text}")

        except Exception as e:
            raise Exception(f"An error occurred while processing the image: {e}")
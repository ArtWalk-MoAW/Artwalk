from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import json


app = FastAPI(title="ArtWalk Mini API")



class Exhibition(BaseModel):
    id: str
    title: str
    artist: str
    latitude: float
    longitude: float
    address: str
    description: Optional[str] = ""
    image: Optional[str] = ""
    opening_hours: Optional[str] = "immer zugänglich"


def load_exhibitions():
    with open("../data/Month-2025-06.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    return [
        Exhibition(
            id=item["id"],
            title=item.get("title", ""),
            artist=item.get("artist1_title", "Unbekannt"),
            latitude=float(item["latitude"]),
            longitude=float(item["longitude"]),
            address=item.get("address", ""),
            description="",
            image="https://streetartcities.com/images/" + item["id"] + ".jpg",
            opening_hours="jederzeit zugänglich"
        )
        for item in data
    ]

@app.get("/artwalk/ping", tags=["Test"])
def ping():
    return {"message": "ArtWalk Agent is alive!"}


class CommandRequest(BaseModel):
    command: str

@app.post("/run", tags=["Application"])
def run_command(request: CommandRequest):
    command = request.command
    if command == "log":
        print("Logging from ArtWalk Agent...")
        return {"message": "Logged to terminal from ArtWalk Agent."}
    elif command == "execute":
        return {"message": "Simulated ArtWalk execution started."}
    else:
        return {"message": f"Unknown command: {command}!"}




@app.get("/get-exhibitions")
def get_exhibitions():
    with open("../data/Month-2025-06.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    return data
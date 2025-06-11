from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from classify_image.main import run_crew_on_image

from pydantic import BaseModel
import os
import shutil

print("✅ MAIN.PY WIRD AUSGEFÜHRT")


app = FastAPI(title="ArtWalk Mini API")

@app.get("/artwalk/ping", tags=["Test"])
def ping():
    return {"message": "ArtWalk Agent is alive!"}

@app.post("/upload")
async def upload_image(image: UploadFile = File(...)):
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{image.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    result = run_crew_on_image(file_path)

    
    return JSONResponse(content={"message": "Image received"}, status_code=200)


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

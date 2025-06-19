from langchain_ollama import OllamaLLM

CATEGORIES = [
    "Mural",
    "Graffiti",
    "Stencil",
    "Paste-up",
    "Calligraffiti",
    "3D Art",
    "Photorealistic",
    "Abstract",
    "Figurative",
    "Political",
    "Typography",
    "Urban Intervention",
    "Festival Art",
    "Portrait",
    "Animal Motif",
    "Cartoon Style",
    "Installation"
]

SYSTEM_PROMPT = (
    "Du bist ein Experte für urbane und Street-Art-Kunststile. "
    "Basierend auf Beschreibung und optional Künstlername gib bitte 1 bis 3 passende Kategorien "
    "aus dieser Liste zurück:\n"
    f"{', '.join(CATEGORIES)}.\n"
    "Verwende nur diese Begriffe und keine eigenen Erfindungen. Gib sie durch Kommas getrennt aus."
)

llm = OllamaLLM(model="llama3")

def classify_art_style(description: str, artist: str = "") -> list[str]:
    if not description.strip():
        return []

    user_prompt = f"Beschreibung:\n{description.strip()}"
    if artist.strip():
        user_prompt += f"\n\nKünstler: {artist.strip()}"

    full_prompt = f"{SYSTEM_PROMPT}\n\n{user_prompt}"
    result = llm.invoke(full_prompt)

    return [x.strip() for x in result.split(",") if x.strip() in CATEGORIES]
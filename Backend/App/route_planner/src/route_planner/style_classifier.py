from typing import List
import re

def classify_art_style(description: str, artist: str = "") -> List[str]:
    """
    Kategorisiert ein Kunstwerk basierend auf Beschreibung und Künstler.
    Gibt eine Liste mit Stilrichtungen zurück.
    """
    description = description.lower() if description else ""
    artist = artist.lower() if artist else ""

    tags = []

    if any(word in description for word in ["graffiti", "urban", "spray", "tags", "walls", "hall of fame", "piece", "throw-up"]) or "graffiti" in artist:
        tags.append("Urban Graffiti")

    if "calligraffiti" in description or "stohead" in artist or "klebebande" in artist:
        tags.append("Calligraffiti")

    if "mural" in description or "large wall" in description or "building facade" in description:
        tags.append("Mural")

    if any(word in description for word in ["stencil", "cutout", "blek le rat", "banksy"]) or "stencil" in artist:
        tags.append("Stencil Art")

    if "paste-up" in description or "poster" in description or "cut paper" in description:
        tags.append("Paste-up")

    if any(word in description for word in ["abstract", "geometric", "non-representational", "bauhaus", "okuda", "kandinsky"]):
        tags.append("Modern Art")

    if "photorealistic" in description or "hyperreal" in description or "case maclaim" in artist:
        tags.append("Photorealistic")

    if "festival" in description or "hands off the wall" in description or "kunstlabor" in description:
        tags.append("Festival Art")

    if any(word in description for word in ["feminism", "politic", "activism", "homophobia", "putin", "oil companies", "sinking europe", "merkel"]) or "shepard fairey" in artist:
        tags.append("Sociopolitical")

    if any(word in description for word in ["renaissance", "botticelli", "venus", "mythology"]):
        tags.append("Renaissance")

    if any(word in description for word in ["romantic", "emotion", "landscape", "friedrich"]):
        tags.append("Romantic")

    if any(word in description for word in ["van gogh", "impressionist", "brush strokes", "starry night"]):
        tags.append("Post-Impressionism")

    if any(word in description for word in ["classical", "ancient", "myth", "idealized"]):
        tags.append("Classical Art")

    if "collective" in description or "crew" in description or "graphism" in artist or "blue bird" in description or "team endzeit" in artist:
        tags.append("Artist Collective")

    return tags
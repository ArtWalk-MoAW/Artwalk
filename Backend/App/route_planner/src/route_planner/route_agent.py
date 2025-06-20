from crewai import Agent
from App.route_planner.classify_art.utils import classify_art_style

class RouteAgent:
    def build(self):
        return Agent(
            role="Routenplaner",
            goal="Plane intelligente, begehbare Touren basierend auf Koordinaten",
            backstory=(
                "Dieser Agent kennt alle Kunstwerke in München und optimiert Touren "
                "nach Distanz und Stadtviertel. Ziel: Kultur erleben, ohne Umwege."
            ),
            allow_delegation=False,
        )

class ClassifyAgent:
    def __init__(self):
        self.agent = Agent(
            role="Kunst-Stil-Analyst",
            goal="Analysiere Kunstwerke und bestimme deren Stil basierend auf Beschreibung und Künstler",
            backstory=(
                "Dieser Agent hat ein tiefes Verständnis für urbane Kunststile wie Murals, Stencils, Calligraffiti, "
                "Photorealistic Art, Festival Art und mehr. Er nutzt Beschreibungen und Künstlernamen, um die Werke "
                "automatisch einzuordnen."
            ),
            allow_delegation=False,
        )

    def enrich_styles(self, artworks: list[dict]):
        for artwork in artworks:
            if not artwork.get("style"):
                description = artwork.get("description", "")

                print(f"🎨 Klassifiziere: '{artwork.get('title', 'Unbenannt')}'")
                print(f"📝 Beschreibung: {description[:100]}...")  # Optional: nur die ersten 100 Zeichen

                artwork["style"] = classify_art_style(description)

                print(f"✅ Ergebnis: {artwork['style']}\n")

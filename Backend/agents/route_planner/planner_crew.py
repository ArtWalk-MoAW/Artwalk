import json
from itertools import combinations
from crewai import Crew, Task
from agents.route_planner.route_agent import RouteAgent, ClassifyAgent
from langchain_ollama import OllamaLLM
from agents.route_planner.utils import (
    haversine,
    get_district_by_coords,
    find_neighboring_districts,
    load_district_data,
    match_district_name,
)
from collections import Counter, defaultdict
from pathlib import Path

# Eingabe
raw_input_district = input("🏙️ Welches Stadtviertel möchtest du testen? ").strip()
known_districts = load_district_data().keys()
selected_district = match_district_name(raw_input_district, known_districts)

if not selected_district:
    print(f"❌ Stadtviertel '{raw_input_district}' wurde nicht erkannt.")
    exit()

max_minutes = int(input("⏱️ Maximale Tourdauer in Minuten? "))
num_stops = int(input("🔢 Wie viele Stopps soll die Route haben? "))
with_description_only = input("📄 Nur Kunstwerke mit Beschreibung? (j/n) ").strip().lower() == "j"

print(f"➡️ Geplant wird eine Tour in {selected_district} mit max. {max_minutes} Minuten und {num_stops} Stopps")

# Modell
class CrewCompatibleOllama(OllamaLLM):
    def call(self, prompt, stop=None, callbacks=None, **kwargs):
        return self.invoke(prompt)
    def supports_stop_words(self): return False

llm = CrewCompatibleOllama(model="llama3")

# Daten laden
data_dir = Path(__file__).parents[2] / "data"
with open(data_dir / "munich_example_with_image_url.json", "r") as f:
    artworks = json.load(f)

# Optional: nur mit Beschreibung
if with_description_only:
    artworks = [a for a in artworks if a.get("description") and len(a["description"].strip()) > 0]

# Stile klassifizieren (wenn nicht vorhanden)
classifier = ClassifyAgent()
classifier.enrich_styles(artworks)

# Bezirke zuweisen
for art in artworks:
    lat = art.get("latitude")
    lon = art.get("longitude")
    art["district"] = get_district_by_coords(lat, lon) if lat and lon else "Unbekannt"

print("🎯 Bezirksverteilung:", Counter([a["district"] for a in artworks]))

# Werke im Bezirk + angrenzende bei Bedarf
district_only = [a for a in artworks if a["district"] == selected_district]
if not district_only:
    print(f"⚠️ Keine Kunstwerke im Bezirk {selected_district} gefunden.")
    exit()

start_coords = (district_only[0]["latitude"], district_only[0]["longitude"])
max_km = max_minutes * 0.08  # 4.8 km/h

# Alle Werke nach max_km filtern
for art in artworks:
    art["distance"] = haversine(start_coords[0], start_coords[1], art["latitude"], art["longitude"])
reachable = [a for a in artworks if a["distance"] <= max_km and a.get("latitude") and a.get("longitude")]

# ggf. angrenzende Bezirke dazunehmen
if len([a for a in reachable if a["district"] == selected_district]) < 6:
    neighbors = find_neighboring_districts(selected_district)
    for neighbor in neighbors:
        for art in artworks:
            if art["district"] == neighbor and art not in reachable:
                art["distance"] = haversine(start_coords[0], start_coords[1], art["latitude"], art["longitude"])
                if art["distance"] <= max_km:
                    reachable.append(art)

# Doppelte Koordinaten entfernen
unique_coords = set()
filtered = []
for art in reachable:
    coords = (round(art["latitude"], 6), round(art["longitude"], 6))
    if coords not in unique_coords:
        filtered.append(art)
        unique_coords.add(coords)

# 🧠 Verfügbare Stile mit gültigen Kombinationen berechnen
styles_valid = defaultdict(list)
for art in filtered:
    for style in art.get("style", []):
        styles_valid[style].append(art)

# Nur Stile, bei denen sich eine valide Route mit `num_stops` planen lässt
final_valid_styles = []
for style, arts in styles_valid.items():
    for combo in combinations(arts, num_stops):
        total = 0
        valid = True
        for i in range(num_stops - 1):
            a, b = combo[i], combo[i + 1]
            dist = haversine(a["latitude"], a["longitude"], b["latitude"], b["longitude"])
            total += dist
            if total > max_km:
                valid = False
                break
        if valid:
            final_valid_styles.append((style, len(arts)))
            break

if not final_valid_styles:
    print("⚠️ Für keine Stilrichtung ist eine gültige Route mit dieser Stopanzahl möglich.")
    exit()

# Stile anzeigen
print("\n🎨 Verfügbare Kunststile für diese Tour:")
for style, count in sorted(final_valid_styles, key=lambda x: -x[1]):
    print(f"- {style}: {count} Werke")

preferred_styles = input("✨ Stil(e) auswählen (z. B. 'Mural, Calligraffiti')\n→ ").strip()
preferred_styles = [s.strip() for s in preferred_styles.split(",") if s.strip()]

# Auswahl anwenden
filtered = [a for a in filtered if any(s in a.get("style", []) for s in preferred_styles)]

if len(filtered) < num_stops:
    print(f"⚠️ Zu wenig unterschiedliche Werke mit gewähltem Stil in Reichweite ({len(filtered)} gefunden).")
    exit()

# Beste Kombination
best_combo = None
best_total = 0
for combo in combinations(filtered, num_stops):
    total = 0
    valid = True
    for i in range(num_stops - 1):
        a, b = combo[i], combo[i + 1]
        dist = haversine(a["latitude"], a["longitude"], b["latitude"], b["longitude"])
        total += dist
        if total > max_km:
            valid = False
            break
    if valid and total > best_total:
        best_total = total
        best_combo = combo

if not best_combo:
    print(f"⚠️ Keine gültige Route mit {num_stops} Stops gefunden.")
    exit()

# Prompt vorbereiten
artwork_info = "\n".join([
    f"- {a['title']} | {a['address']} (Bezirk: {a['district']}) (Lat: {a['latitude']}, Lon: {a['longitude']})"
    for a in best_combo
])

# CrewAI Setup
agent = RouteAgent().build()
agent.llm = llm

task = Task(
    description=f"""Du bist ein Routenplaner für eine Kunsttour in München.
Plane eine Route durch **exakt {num_stops} Kunstwerke**, die im Bezirk {selected_district} liegen **oder angrenzen**, und **maximal {max_minutes} Minuten Gehzeit in Summe** benötigen.

Hier sind die verfügbaren Werke (vorab gefiltert):

{artwork_info}

Gib die gewählte Route in sinnvoller Reihenfolge aus – jeweils mit Titel, kurzer Beschreibung, Adresse und Koordinaten.""",
    expected_output=f"{num_stops} Kunstwerke mit Titel, Adresse, Koordinaten und kurzer Erklärung der Reihenfolge.",
    agent=agent
)

crew = Crew(agents=[agent], tasks=[task], verbose=True)
crew.kickoff()
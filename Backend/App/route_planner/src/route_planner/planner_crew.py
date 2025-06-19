import json
from itertools import combinations
from crewai import Crew, Task
from App.route_planner.src.route_planner.route_agent import RouteAgent, ClassifyAgent
from langchain_community.llms.ollama import Ollama

from App.route_planner.src.route_planner.utils import (
    haversine,
    get_district_by_coords,
    find_neighboring_districts,
    load_district_data,
    match_district_name,
)
from collections import defaultdict
from pathlib import Path


llm = Ollama(
    model="llama3",
    base_url="http://host.docker.internal:11434"
)


def plan_route(selected_district: str, max_minutes: int, num_stops: int, preferred_styles: list[str], with_description_only: bool = True) -> list[dict]:
    print("🔹 Starte plan_route")
    known_districts = load_district_data().keys()
    selected_district = match_district_name(selected_district, known_districts)
    print(f"🔸 Gematchter Bezirk: {selected_district}")

    if not selected_district:
        print("❌ Kein gültiger Bezirk gefunden.")
        return []

    data_dir = Path(__file__).parents[2] / "data"
    with open(data_dir / "munich_example_with_image_url.json", "r") as f:
        artworks = json.load(f)
    print(f"📦 Anzahl geladener Werke: {len(artworks)}")

    if with_description_only:
        artworks = [a for a in artworks if a.get("description") and len(a["description"].strip()) > 0]
        print(f"✂️ Gefiltert nach Beschreibung: {len(artworks)} Werke übrig")

    print("🔍 Starte Klassifikation")
    classifier = ClassifyAgent()
    classifier.enrich_styles(artworks)
    print("✅ Klassifikation abgeschlossen")

    for art in artworks:
        lat = art.get("latitude")
        lon = art.get("longitude")
        art["district"] = get_district_by_coords(lat, lon) if lat and lon else "Unbekannt"

    district_only = [a for a in artworks if a["district"] == selected_district]
    print(f"📍 Werke im ausgewählten Bezirk ({selected_district}): {len(district_only)}")

    if not district_only:
        print("❌ Keine Werke im Bezirk gefunden.")
        return []

    start_coords = (district_only[0]["latitude"], district_only[0]["longitude"])
    max_km = max_minutes * 0.08
    print(f"🧭 Start bei {start_coords}, Maximaldistanz: {max_km:.2f} km")

    for art in artworks:
        art["distance"] = haversine(start_coords[0], start_coords[1], art["latitude"], art["longitude"])
    reachable = [a for a in artworks if a["distance"] <= max_km and a.get("latitude") and a.get("longitude")]
    print(f"🚶‍♂️ Erreichbare Werke: {len(reachable)}")

    if len([a for a in reachable if a["district"] == selected_district]) < 6:
        print("🔄 Zu wenig Werke im Bezirk – lade angrenzende Bezirke")
        neighbors = find_neighboring_districts(selected_district)
        print(f"🧩 Nachbarbezirke: {neighbors}")
        for neighbor in neighbors:
            for art in artworks:
                if art["district"] == neighbor and art not in reachable:
                    art["distance"] = haversine(start_coords[0], start_coords[1], art["latitude"], art["longitude"])
                    if art["distance"] <= max_km:
                        reachable.append(art)
        print(f"🔁 Werke nach Erweiterung: {len(reachable)}")

    unique_coords = set()
    filtered = []
    for art in reachable:
        coords = (round(art["latitude"], 6), round(art["longitude"], 6))
        if coords not in unique_coords:
            filtered.append(art)
            unique_coords.add(coords)
    print(f"📌 Einzigartige Standorte: {len(filtered)}")

    filtered = [a for a in filtered if any(s in a.get("style", []) for s in preferred_styles)]
    print(f"🎨 Gefiltert nach Stil: {len(filtered)} übrig")

    if len(filtered) < num_stops:
        print("❌ Nicht genug Werke mit gewünschtem Stil gefunden.")
        return []

    best_combo = None
    best_total = 0
    print(f"🔄 Suche beste Kombination aus {len(filtered)} Werken")
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
        print("❌ Keine gültige Route gefunden.")
        return []

    print(f"✅ Beste Route mit {num_stops} Stationen und {best_total:.2f} km Gesamtstrecke")

    artwork_info = "\n".join([
        f"- {a['title']} | {a['address']} (Bezirk: {a['district']}) (Lat: {a['latitude']}, Lon: {a['longitude']})"
        for a in best_combo
    ])

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
    print("🚀 Starte Crew")
    _ = crew.kickoff()
    print("✅ Crew abgeschlossen")

    return list(best_combo)

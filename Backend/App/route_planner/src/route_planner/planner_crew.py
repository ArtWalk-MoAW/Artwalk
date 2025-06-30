import json
from itertools import combinations
from collections import defaultdict
from pathlib import Path
from crewai import Crew, Task
from langchain_community.llms.ollama import Ollama

from App.route_planner.src.route_planner.route_agent import RouteAgent, ClassifyAgent
from App.route_planner.classify_art.utils import CrewCompatibleOllama
from App.route_planner.src.route_planner.utils import (
    haversine,
    get_district_by_coords,
    find_neighboring_districts,
    load_district_data,
    match_district_name,
)

llm = CrewCompatibleOllama(
    model="llama3",
    base_url="http://localhost:11434"
)

def plan_route(selected_district: str, max_minutes: int, num_stops: int, preferred_styles: list[str], with_description_only: bool = True) -> list[dict]:
    print("Starte plan_route")
    known_districts = load_district_data().keys()
    selected_district = match_district_name(selected_district, known_districts)
    print(f"Gematchter Bezirk: {selected_district}")
    if not selected_district:
        print("Kein gültiger Bezirk gefunden.")
        return []

    backend_root = Path(__file__).resolve().parents[4]
    json_path = backend_root / "data" / "munich_classified.json"
    with open(json_path, "r", encoding="utf-8") as f:
        artworks = json.load(f)

    if with_description_only:
        artworks = [a for a in artworks if a.get("description") and len(a["description"].strip()) > 0]

    for art in artworks:
        lat = art.get("latitude")
        lon = art.get("longitude")
        art["district"] = get_district_by_coords(lat, lon) if lat and lon else "Unbekannt"

    district_only = [a for a in artworks if a["district"] == selected_district]
    print(f"Werke im Bezirk {selected_district}: {len(district_only)}")
    if not district_only:
        print("Keine Werke im Bezirk gefunden.")
        return []

    start_coords = (district_only[0]["latitude"], district_only[0]["longitude"])
    max_km = max_minutes * 0.08
    print(f"Start: {start_coords}, Max-Kilometer: {max_km:.2f}")

    for art in artworks:
        if art.get("latitude") and art.get("longitude"):
            art["distance"] = haversine(start_coords[0], start_coords[1], art["latitude"], art["longitude"])

    reachable = [a for a in artworks if a.get("distance", 9999) <= max_km]

    needs_classification = [a for a in reachable if not a.get("style")]
    if needs_classification:
        print(f"Klassifiziere {len(needs_classification)} relevante ungeklassifizierte Werke")
        classifier = ClassifyAgent()
        classifier.enrich_styles(needs_classification)

    reachable = [a for a in reachable if any(s in a.get("style", []) for s in preferred_styles)]

    district_reachable = [a for a in reachable if a["district"] == selected_district]
    print(f"Passende Werke im Bezirk {selected_district}: {len(district_reachable)}")

    if len(district_reachable) < num_stops:
        print(f"Nur {len(district_reachable)} passende Werke im Bezirk {selected_district} gefunden.")
        print("Es werden angrenzende Bezirke einbezogen, um die Route aufzufüllen.")
        neighbors = find_neighboring_districts(selected_district)
        neighbor_reachable = [a for a in reachable if a["district"] in neighbors]
        reachable = district_reachable + neighbor_reachable
    else:
        reachable = district_reachable

    # Duplikate entfernen
    unique_coords = set()
    filtered = []
    for art in reachable:
        coords = (round(art["latitude"], 6), round(art["longitude"], 6))
        if coords not in unique_coords:
            filtered.append(art)
            unique_coords.add(coords)
    print(f"Einzigartige Standorte: {len(filtered)}")

    if len(filtered) < num_stops:
        print("Nicht genug passende Werke gefunden.")
        return []

    #Bezirkspriorisierung
    best_combo = None
    best_score = -1
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
        if valid:
            district_hits = sum(1 for a in combo if a["district"] == selected_district)
            score = district_hits * 100 - total  # Priorisiere mehr Werke aus dem Bezirk
            if score > best_score:
                best_score = score
                best_combo = combo

    if not best_combo:
        print("Keine gültige Route gefunden.")
        return []

    print(f"Beste Route: {num_stops} Stops, Distanz: {total:.2f} km")

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
    _ = crew.kickoff()

    return list(best_combo)

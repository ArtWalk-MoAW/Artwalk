import json
from math import radians, cos, sin, asin, sqrt
from pathlib import Path
import difflib
import unicodedata

def normalize(text: str) -> str:
    replacements = {
        "ae": "ä",
        "oe": "ö",
        "ue": "ü",
        "Ae": "Ä",
        "Oe": "Ö",
        "Ue": "Ü",
        "ss": "ß"
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    text = unicodedata.normalize("NFKD", text).encode("ASCII", "ignore").decode("utf-8")
    return text.lower()

def match_district_name(user_input, known_districts):
    normalized_input = normalize(user_input)

    for district in known_districts:
        if normalized_input in normalize(district):
            return district

    match = difflib.get_close_matches(normalized_input, [normalize(d) for d in known_districts], n=1, cutoff=0.6)
    if match:
        for d in known_districts:
            if normalize(d) == match[0]:
                return d

    return None

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)
    a = sin(d_lat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lon / 2)**2
    return 2 * R * asin(sqrt(a))

from pathlib import Path
import json

def load_district_data():
    backend_root = Path(__file__).resolve().parents[4] 
    data_path = backend_root / "data" / "districts.json"

    print(f"Loading districts.json from: {data_path}")

    if not data_path.exists():
        raise FileNotFoundError(f"Districts file not found at: {data_path}")

    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)

def get_district_by_coords(lat, lon):
    boxes = load_district_data()
    for district, ((lat_min, lat_max), (lon_min, lon_max)) in boxes.items():
        if lat_min <= lat <= lat_max and lon_min <= lon <= lon_max:
            return district
    return "Unbekannt"

def find_neighboring_districts(selected_district):
    boxes = load_district_data()
    if selected_district not in boxes:
        return []

    lat_min_1, lat_max_1 = boxes[selected_district][0]
    lon_min_1, lon_max_1 = boxes[selected_district][1]

    neighbors = []
    for district, ((lat_min_2, lat_max_2), (lon_min_2, lon_max_2)) in boxes.items():
        if district == selected_district:
            continue
        if (
            lat_max_1 + 0.001 >= lat_min_2 and lat_min_1 - 0.001 <= lat_max_2 and
            lon_max_1 + 0.001 >= lon_min_2 and lon_min_1 - 0.001 <= lon_max_2
        ):
            neighbors.append(district)
    return neighbors
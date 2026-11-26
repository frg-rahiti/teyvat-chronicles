#!/usr/bin/env python3
"""
Construit un import MySQL du catalogue Genshin depuis le PC de l'utilisateur.
L'appel réseau est fait depuis le PC, jamais depuis l'hébergement OVH.
Usage:
  py tools/build_character_import.py
  py tools/build_character_import.py --download-images
"""
from __future__ import annotations
import argparse
import csv
import json
import time
import urllib.request
from pathlib import Path
from typing import Any

BASE_URL = "https://genshin.jmp.blue"
ROOT = Path(__file__).resolve().parents[1]
DB_DIR = ROOT / "database"
UPLOAD_DIR = ROOT / "uploads" / "characters"
USER_AGENT = "TeyvatChroniclesCatalogBuilder/1.0"

def get_json(url: str) -> Any:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    with urllib.request.urlopen(request, timeout=25) as response:
        return json.loads(response.read().decode("utf-8"))

def download_file(url: str, destination: Path) -> bool:
    try:
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(request, timeout=35) as response:
            payload = response.read()
        if len(payload) < 1024:
            return False
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(payload)
        return True
    except Exception as exc:
        print(f"  Image non téléchargée: {url} ({exc})")
        return False

def value(data: dict, *keys: str, default: str = "") -> str:
    for key in keys:
        item = data.get(key)
        if item is not None and str(item).strip():
            return str(item).strip()
    return default

def sql_string(value_: Any) -> str:
    text = str(value_ if value_ is not None else "")
    return "'" + text.replace("\\", "\\\\").replace("'", "''").replace("\x00", "") + "'"

def main() -> int:
    parser = argparse.ArgumentParser(description="Prépare l'import local du catalogue Teyvat Chronicles.")
    parser.add_argument("--download-images", action="store_true", help="Télécharge les portraits et splash arts dans uploads/characters.")
    args = parser.parse_args()

    DB_DIR.mkdir(parents=True, exist_ok=True)
    print("1/3 — Récupération de la liste des personnages depuis le PC…")
    try:
        slugs = get_json(f"{BASE_URL}/characters")
    except Exception as exc:
        print(f"ERREUR: impossible de joindre {BASE_URL} depuis ce PC: {exc}")
        print("Aucun fichier n'a été généré. Vérifie ta connexion puis réessaie.")
        return 1

    if isinstance(slugs, dict):
        slugs = slugs.get("characters") or slugs.get("data") or []
    if not isinstance(slugs, list) or not slugs:
        print("ERREUR: la réponse de la source ne contient aucune liste de personnages.")
        return 1

    rows: list[dict[str, Any]] = []
    total = len(slugs)
    print(f"2/3 — Lecture des fiches ({total} identifiants)…")
    for index, item in enumerate(slugs, start=1):
        slug = str(item).strip().lower()
        if not slug or "/" in slug or ".." in slug:
            continue
        try:
            data = get_json(f"{BASE_URL}/characters/{slug}?lang=fr")
            if not isinstance(data, dict):
                raise ValueError("fiche JSON invalide")
        except Exception as exc:
            print(f"[{index}/{total}] ignoré: {slug} ({exc})")
            continue

        name = value(data, "name", default=slug.replace("-", " ").title())
        try:
            rarity = int(float(value(data, "rarity", default="4")))
        except ValueError:
            rarity = 4
        element = value(data, "vision", "element", "elementText", default="Inconnu")
        weapon = value(data, "weapon", "weaponType", "weaponText", default="Inconnu")
        region = value(data, "nation", "region", "association", default="Inconnu")
        title = value(data, "title")
        description = value(data, "description", "desc")
        card_source = f"{BASE_URL}/characters/{slug}/card"
        splash_source = f"{BASE_URL}/characters/{slug}/gacha-splash"
        card_value, splash_value = card_source, splash_source

        if args.download_images:
            card_path = UPLOAD_DIR / slug / "card.png"
            splash_path = UPLOAD_DIR / slug / "splash.png"
            if download_file(card_source, card_path):
                card_value = f"/uploads/characters/{slug}/card.png"
            if download_file(splash_source, splash_path):
                splash_value = f"/uploads/characters/{slug}/splash.png"

        rows.append({
            "slug": slug, "name": name, "title": title, "element": element,
            "weapon": weapon, "rarity": rarity, "region": region,
            "description": description, "card_url": card_value,
            "splash_url": splash_value, "card_source_url": card_source,
            "splash_source_url": splash_source,
        })
        print(f"[{index}/{total}] {name}")
        time.sleep(0.03)

    if not rows:
        print("ERREUR: aucune fiche exploitable n'a été récupérée.")
        return 1

    sql_path = DB_DIR / "characters_import.sql"
    csv_path = DB_DIR / "characters_images.csv"
    with sql_path.open("w", encoding="utf-8", newline="\n") as sql:
        sql.write("-- Teyvat Chronicles : import du catalogue généré depuis le PC.\n")
        sql.write("-- Importer ce fichier dans phpMyAdmin après avoir sélectionné la base du site.\n")
        sql.write("SET NAMES utf8mb4;\n")
        for row in rows:
            columns = ["slug", "name", "title", "element", "weapon", "rarity", "region", "description", "card_url", "splash_url", "is_published"]
            values = [
                sql_string(row["slug"]), sql_string(row["name"]), sql_string(row["title"]),
                sql_string(row["element"]), sql_string(row["weapon"]), str(row["rarity"]),
                sql_string(row["region"]), sql_string(row["description"]),
                sql_string(row["card_url"]), sql_string(row["splash_url"]), "1"
            ]
            updates = ", ".join(f"{column}=VALUES({column})" for column in columns if column not in ("slug", "name"))
            sql.write(
                "INSERT INTO characters (" + ", ".join(columns) + ") VALUES (" + ", ".join(values) + ") "
                "ON DUPLICATE KEY UPDATE " + updates + ";\n"
            )

    with csv_path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=[
            "slug", "name", "card_source_url", "splash_source_url", "card_url", "splash_url"
        ])
        writer.writeheader()
        writer.writerows(rows)

    print("\n3/3 — Terminé.")
    print(f"Personnages préparés : {len(rows)}")
    print(f"SQL à importer dans phpMyAdmin : {sql_path}")
    print(f"Inventaire des images / liens : {csv_path}")
    if args.download_images:
        print(f"Images téléchargées (si disponibles) : {UPLOAD_DIR}")
        print("Envoie le dossier uploads/ sur OVH avant ou après l'import SQL.")
    else:
        print("Les colonnes card_url et splash_url contiennent les URL en ligne.")
        print("Pour héberger les fichiers sur OVH, relance avec --download-images.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())

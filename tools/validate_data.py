#!/usr/bin/env python3
"""
Outil facultatif (Python 3.7+) pour vérifier un export JSON de personnages.
Usage : python validate_data.py personnages.json
Ce script ne fait pas partie du fonctionnement du site en production.
"""
import json
import sys
from pathlib import Path

REQUIRED = {"name", "title", "element", "weapon", "rarity", "region", "description"}
ELEMENTS = {"Anémo", "Géo", "Électro", "Dendro", "Hydro", "Pyro", "Cryo"}

def main():
    if len(sys.argv) != 2:
        print("Usage : python validate_data.py fichier.json")
        return 2
    path = Path(sys.argv[1])
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        print("Lecture JSON impossible :", exc)
        return 1
    if not isinstance(data, list):
        print("Erreur : la racine JSON doit être une liste.")
        return 1
    errors = []
    for index, item in enumerate(data, 1):
        if not isinstance(item, dict):
            errors.append("Entrée {} : objet attendu".format(index))
            continue
        missing = REQUIRED - set(item)
        if missing:
            errors.append("Entrée {} : champs manquants {}".format(index, ", ".join(sorted(missing))))
        if item.get("element") not in ELEMENTS:
            errors.append("Entrée {} : élément inconnu {}".format(index, item.get("element")))
        if not isinstance(item.get("rarity"), int) or item.get("rarity") not in (4, 5):
            errors.append("Entrée {} : rarity doit valoir 4 ou 5".format(index))
    if errors:
        print("\\n".join(errors))
        return 1
    print("{} personnage(s) : données valides.".format(len(data)))
    return 0

if __name__ == "__main__":
    sys.exit(main())

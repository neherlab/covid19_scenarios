import os
import sys
sys.path.append('..')

import json
import argparse

# -----------------------------------------------------------------------
# Globals

def flatten(db):
    entries = []
    for country, ages in db.items():
        entry = {"country" : country, "ageDistribution": ages}
        entries.append(entry)

    return entries

# -----------------------------------------------------------------------
# Main point of entry

parser = argparse.ArgumentParser(description="Transforms age distribution JSON into list of entries")
parser.add_argument('--input', type=str, help="path to input age distribution json to transform")
parser.add_argument('--output', type=str, help="path to output transformed age distribution json")

args = parser.parse_args()
if __name__ == "__main__":
    if not os.path.exists(args.input):
        print(f"Error: '{args.input}' not a valid path")

    old_json = json.load(open(args.input))
    new_json = flatten(old_json)
    with open(args.output, 'w+') as out:
        json.dump(new_json, out)

import os
import csv

from collections import defaultdict

# ------------------------------------------------------------------------
# Globals

FILE = "country_codes.csv"
ROOT = "case-counts"

# ------------------------------------------------------------------------
# Functions

def get_regions(file):
    countries = defaultdict(lambda: defaultdict(list))
    with open(file) as f:
        rdr = csv.reader(f)
        next(rdr)
        for row in rdr:
            countries[row[5]][row[6]].append(row[0])

    for key, val in countries.items():
        countries[key] = dict(val)

    return dict(countries)

def mkdir(path):
    if not os.path.exists(path):
        os.mkdir(path)

def generate(root, continent, countries):
    mkdir(f"{root}/{continent}")
    for c in countries:
        mkdir(f"{root}/{continent}/{c}")

# ------------------------------------------------------------------------
# Main point of entry

if __name__ == "__main__":
    for continent, subregions in get_regions(FILE).items():
        root = f"{ROOT}/{continent}"
        mkdir(root)
        for subregion, countries in subregions.items():
            generate(root, subregion, countries)

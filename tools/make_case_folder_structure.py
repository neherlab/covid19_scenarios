import os
import csv

from collections import defaultdict

# ------------------------------------------------------------------------
# Globals

FILE = "./auxillaryData/countries.csv"
ROOT = "../data/case-counts"

# ------------------------------------------------------------------------
# Functions

def get_regions(file):
    countries = defaultdict(list)
    with open(file) as f:
        rdr = csv.reader(f)
        next(rdr)
        for row in rdr:
            countries[row[3]].append(row[8])

    return dict(countries)

def mkdir(path):
    if not os.path.exists(path):
        os.mkdir(path)

def generate(continent, countries):
    mkdir(f"{ROOT}/{continent}")
    for c in countries:
        mkdir(f"{ROOT}/{continent}/{c}")

# ------------------------------------------------------------------------
# Main point of entry

if __name__ == "__main__":
    for continent, countries in get_regions(FILE).items():
        generate(continent, countries)

import os
import sys
import csv
import json
import fnmatch

from glob import glob
from collections import defaultdict

# ------------------------------------------------------------------------
# Globals

DATA_DIR   = "data/case-counts"
UN_COUNTRY = "data/country_codes.csv"

# ------------------------------------------------------------------------
# Functions

def stoi(x):
    if x == "":
        return None

    return int(x)

def get_country_codes(twoletter=False):
    codes = {}
    rdr   = csv.reader(open(UN_COUNTRY))

    for row in rdr:
        codes[row[0]] = row[1] if twoletter else row[2]

    return codes

'''
Expected format of generic tsv file:
date    cases   death   hospitalized    ICU     recovered
2020-03-14 ...

Numbers can be missing!

One exception:
    World.tsv is expected to have a 'location' column.
    This is used as a last resort source of data.
'''
COLS = ['time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']
def parse(tsv):
    rdr = csv.reader(tsv, delimiter='\t')
    hdr = next(rdr)
    idx = {}

    # NOTE: This allows for flexibility in column ordering
    for col in COLS:
        try:
            idx[col] = hdr.index(col)
        except:
            print(col, hdr)
            return None, False

    data = []
    for row in rdr:
        data.append({c:stoi(row[idx[c]]) if i > 0 else row[idx[c]] for i, c in enumerate(COLS)})

    return data, True

def parse_world(tsv):
    rdr = csv.reader(tsv, delimiter='\t')
    hdr = next(rdr)
    idx = {}

    cols = ['location'] + COLS
    for col in cols:
        try:
            idx[col] = hdr.index(col)
        except:
            print(col, hdr)
            return None, False

    data = defaultdict(list)
    for row in rdr:
        data[row[idx[cols[0]]]].append({c:stoi(row[idx[c]]) if i > 0 else row[idx[c]] for i, c in enumerate(cols[1:])})

    return data, True


def filter_tsv(fname):
    with open(fname) as fh:
        return filter(lambda row:row[0]!='#', fh.readlines())

# ------------------------------------------------------------------------
# Main point of entry

if __name__ == "__main__":
    cases = {}
    codes = get_country_codes()

    for root, dir, files in os.walk(f"{DATA_DIR}"):
        for tsv in fnmatch.filter(files, "*.tsv"):
            if tsv == "World.tsv":
                continue
            country = os.path.basename(root)
            region = os.path.basename(tsv)[:-4]
            region = f"{codes[country]}-{region}"
            db, ok = parse(filter_tsv(f"{root}/{tsv}"))
            if ok:
                cases[region] = db
            else:
                print(f"Region '{region}' incorrectly formatted", file=sys.stderr)

    world_cases, ok = parse_world(filter_tsv(f"{DATA_DIR}/World.tsv"))
    if ok:
        for country, data in world_cases.items():
            if country not in cases:
                cases[country] = data
    else:
        print(f"Panic: '{region}' incorrectly formatted", file=sys.stderr)

    with open('src/assets/data/case_counts.json', 'w') as fh:
        json.dump(cases, fh)

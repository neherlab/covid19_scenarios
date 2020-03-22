'''
parse all manually maintained .tsv files in the case-counts/ folder
this should be run from the top level of the repo.
'''
import csv
import os
import json

from collections import defaultdict
from datetime import datetime, timedelta
from .utils import write_tsv, flatten, parse_countries, stoi, merge_cases, sorted_date, store_json

# -----------------------------------------------------------------------------
# Globals

cols = ['location', 'time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']

# -----------------------------------------------------------------------------
# Functions


def get_country_codes(twoletter=False):
    codes = {}
    rdr   = csv.reader(open(UN_COUNTRY))

    for row in rdr:
        codes[row[0]] = row[1] if twoletter else row[2]

    return codes




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

# -----------------------------------------------------------------------------
# Main point of entry

def parse():
    
    countries = parse_countries(2)    
    cases = defaultdict(list)

    files = [entry.name for entry in os.scandir('case-counts/') if entry.is_file() and os.path.splitext(entry.name)[1] == '.tsv']

    for f in files:
        print('now parsing',f)
        data, ok = parse_world(filter_tsv(f"case-counts/"+f))
        if ok:
            store_json(data)
        else:
            print(f"Panic: '{f}' incorrectly formatted", file=sys.stderr)
        



    

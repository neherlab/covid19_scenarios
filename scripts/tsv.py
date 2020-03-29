'''
parse all manually maintained .tsv files in the case-counts/ folder
this should be run from the top level of the repo.
'''
import sys
import csv
import os
from glob import glob

from collections import defaultdict
from datetime import datetime, timedelta
from parsers.utils import write_tsv, flatten, parse_countries, stoi, merge_cases, sorted_date, store_json
from paths import BASE_PATH, JSON_DIR, TMP_CASES, TSV_DIR

# -----------------------------------------------------------------------------
# Globals

cols = ['time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']

# -----------------------------------------------------------------------------
# Functions


def parse_tsv(tsv, location):
    rdr = csv.reader(tsv, delimiter='\t')
    hdr = next(rdr)
    idx = {}

    for col in cols:
        try:
            idx[col] = hdr.index(col)
        except:
            print(col, cols, hdr)
            return None, False

    data = defaultdict(list)
    for row in rdr:
        data[location].append({c:stoi(row[idx[c]]) if i > 0 else row[idx[c]] for i, c in enumerate(cols)})
    return data, True


def filter_tsv(fname):
    with open(fname) as fh:
        return filter(lambda row:row[0]!='#', fh.readlines())

# -----------------------------------------------------------------------------
# Main point of entry

def parse():
    json_file = os.path.join(BASE_PATH,JSON_DIR, TMP_CASES)
    
    files = defaultdict(list)

    for dirpath, dirnames, filenames in os.walk(os.path.join(BASE_PATH,TSV_DIR)):
        files[dirpath] = [f for f in filenames if f.endswith(".tsv")]
    i = 0
    for d in files:
        print(f'Now importing {len(files[d])} .tsv files for {d}')
        for f in files[d]:
            data, ok = parse_tsv(filter_tsv(os.path.join(d,f)), f[:-4])
            i += 1
            if ok:
                store_json(data, json_file)
            else:
                print(f"Panic: '{f}' incorrectly formatted", file=sys.stderr)
    print(f'Imported {len(files)} files with total {i} regions into {json_file}')






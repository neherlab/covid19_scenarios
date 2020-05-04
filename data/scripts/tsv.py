'''
parse all manually maintained .tsv files in the case-counts/ folder
this should be run from the top level of the repo.
'''
import sys
import csv
import os
import json
from glob import glob

from collections import defaultdict
from datetime import datetime, timedelta
from parsers.utils import write_tsv, flatten, parse_countries, stoi, merge_cases, sorted_date, store_json
from paths import BASE_PATH, JSON_DIR, TMP_CASES, TSV_DIR, SOURCES_FILE

# -----------------------------------------------------------------------------
# Globals

cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']

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

def parse(output=None):
    files = defaultdict(list)
    srcs = list(json.load(open(os.path.join(BASE_PATH, SOURCES_FILE))).keys())

    for dirpath, dirnames, filenames in os.walk(os.path.join(BASE_PATH,TSV_DIR)):
        files[os.path.basename(dirpath)] = [f for f in filenames if f.endswith(".tsv")]
    i = 0
    json_data = {}
    for d in srcs:
        print(f'Now importing {len(files[d])} .tsv files for {d}')
        for f in files[d]:
            data, ok = parse_tsv(filter_tsv(os.path.join(BASE_PATH,TSV_DIR,d,f)), f[:-4])
            i += 1
            if ok:
                json_data = merge_cases(json_data, data)
            else:
                print(f"Panic: '{f}' incorrectly formatted", file=sys.stderr)

    print(f'Imported {len(files)} files with total {i} regions')

    if output:
        print(f'Writing json to "{output}".')
        store_json(json_data, output)

    return json_data




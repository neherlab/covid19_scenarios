import os
import sys
import csv
import json

from glob import glob

# ------------------------------------------------------------------------
# Globals

DATA_DIR = "../data/case-counts"

# ------------------------------------------------------------------------
# Functions

'''
Expected format of tsv file:
date    cases   death   hospitalized    ICU     recovered
2020-03-14 ...

Numbers can be missing!
'''
cols = ['date', 'cases', 'death', 'hospitalized', 'ICU', 'recovered']
def parse(tsv):
    rdr = csv.reader(tsv, delimiter='\t')
    hdr = next(rdr)
    idx = {}

    for col in cols:
        try:
            idx[col] = hdr.index(col)
        except:
            return None, False

    data = []
    for row in rdr:
        data.append({c:stoi(row[idx[c]) if i > 0 else row[idx[c]] for i, c in enumerate(cols)})

    return data, True

# ------------------------------------------------------------------------
# Main point of entry

if __name__ == "__main__":

    case = {}
    for tsv in glob(f"{DATA_DIR}/*.tsv"):
        region = os.path.basename(tsv)[:-3]
        db, ok = parse(tsv)
        if ok:
            cases[region] = db
        else:
            print(f"Region '{region}' incorrectly formatted", file=sys.stderr)

    print(json.dumps(cases), file=sys.stdout)

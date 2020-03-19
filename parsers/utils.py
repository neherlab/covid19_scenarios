import csv
import json

# ------------------------------------------------------------------------
# Globals

with open("sources.json") as fh:
    sources = json.load(fh)

# ------------------------------------------------------------------------
# Functions

def write_tsv(path, cols, rows, region):
    with open(path, 'w+') as fd:
        fd.write(get_header(region))
        wtr = csv.writer(fd, delimiter='\t')
        wtr.writerow(cols)
        wtr.writerows(rows)

def get_header(source):
    d = sources[source]
    return (f"# Data source: {d.get('primarySource','not specified')}\n"
            f"# Data provenance: {d.get('dataProvenance','not specified')}\n"
            f"# License: {d.get('license','not specified')}\n")

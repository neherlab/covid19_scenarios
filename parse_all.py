import sys
import json
import importlib

SOURCES = "./sources.json"

if __name__ == "__main__":
    # initialize empty json
    with open('case-counts/case_counts.json', 'w') as fh:
        fh.write("{}")
        
    srcs = list(json.load(open(SOURCES)).keys())
    for src in srcs:
        #print(f"Running {src}", file=sys.stderr)
        print(f"Running {src}", file=sys.stdout)
        country = importlib.import_module(f"parsers.{src}")
        country.parse()

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
        # Allow running this as `python parse_all.py netherlands` to filter sources (debug mode)
        if len(sys.argv) == 1 or sys.argv[1] == src:
            print(f"Running {src}", file=sys.stderr)
            country = importlib.import_module(f"parsers.{src}")
            country.parse()

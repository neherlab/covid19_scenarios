import sys
import argparse
import os
import json
import importlib
import shutil
from paths import BASE_PATH, SOURCES_FILE, JSON_DIR, TMP_CASES, TMP_POPULATION

APP_PATH = 'src/assets/data'

if __name__ == "__main__":

    parser = argparse.ArgumentParser(description = "",
                                     usage="Parse data and copy output to app")

    parser.add_argument('--fetch', action='store_true', help='update sources from remote')
    parser.add_argument('--deploy', action='store_true', help='copy to app')
    parser.add_argument('--parsers', nargs='+', help='parsers to run')
    args = parser.parse_args()

    if args.fetch:
        # make directory for JSONs if it doesn't exist
        outpath = os.path.join(BASE_PATH, JSON_DIR)
        if not os.path.isdir(outpath):
            os.mkdir(outpath)

        # initialize empty json
        with open(os.path.join(BASE_PATH, JSON_DIR, TMP_CASES), 'w') as fh:
            fh.write("{}")

        srcs = list(json.load(open(os.path.join(BASE_PATH, SOURCES_FILE))).keys())
        for src in srcs:
            # Allow running this as `python parse_all.py netherlands` to filter sources (debug mode)
            if (args.parsers is None) or src in args.parsers:
                print(f"Running {src}", file=sys.stderr)
                country = importlib.import_module(f"parsers.{src}")
                country.parse()

        pop = importlib.import_module(f"scripts.populations")
        pop.parse()

    # copy jsons to app if requested
    if args.deploy:
        shutil.copy(os.path.join(BASE_PATH, JSON_DIR, TMP_CASES),
                     os.path.join(APP_PATH, 'case_counts.json'))

        shutil.copy(os.path.join(BASE_PATH, JSON_DIR, TMP_POPULATION),
                     os.path.join(APP_PATH, 'population.json'))

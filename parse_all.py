import json
import importlib

SOURCES = "./sources.json"

if __name__ == "__main__":
    srcs = list(json.load(open(SOURCES)).keys())
    for src in srcs:
        country = importlib.import_module(f"parsers.{src}")
        country.parse()

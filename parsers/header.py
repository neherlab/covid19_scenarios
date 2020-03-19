import json

with open("sources.json") as fh:
    sources = json.load(fh)

def getHeader(source):
    d = sources[source]
    return (f"# Data source: {d.get('primarySource','not specified')}\n"
            f"# Data provenance: {d.get('dataProvenance','not specified')}\n"
            f"# License: {d.get('license','not specified')}\n")


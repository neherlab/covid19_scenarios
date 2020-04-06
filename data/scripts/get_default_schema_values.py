import yaml
import sys

sys.path.append('..')
from paths import BASE_PATH, SCHEMA_SCENARIOS

# ------------------------------------------------------------------------
# Globals

PATH = f"{BASE_PATH}/{SCHEMA_SCENARIOS}"

# ------------------------------------------------------------------------
# Functions

def generate():
    types = yaml.load(open(PATH), yaml.BaseLoader)

    def add(obj, root):
        for prop, data in obj.items():
            if "type" in data and "default" in data:
                kind = data["type"]
                if kind == "object":
                    root[prop] = {}
                    root[prop] = add(data["properties"], root[prop])
                elif kind == "number":
                    root[prop] = float(data["default"])
                elif kind == "integer":
                    root[prop] = int(data["default"])
                else:
                    raise ValueError(f"Type '{kind}' not handled by default generation")

        return root

    defaults = {}
    for type, decl in types["definitions"].items():
        kind = decl["type"]
        if kind == "object":
            defaults[type] = {}
            defaults[type] = add(decl["properties"], defaults[type])
        elif kind == "number":
            if "default" in data:
                defaults[type] = float(data["default"])
        elif kind == "integer":
            if "default" in data:
                defaults[type] = int(data["default"])
        else:
            raise ValueError(f"Type '{kind}' not handled by default generation")

    return defaults

# ------------------------------------------------------------------------
# Exported data

DEFAULTS = generate()

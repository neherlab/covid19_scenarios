import os, json, yaml

from jsonschema import validate, FormatChecker

PATH_UN_AGES   = os.path.join("../", "../src/assets/data/country_age_distribution.json")

with open(os.path.join('../../schemas/CountryAgeDistribution.yml'), "r") as f:
    schema = yaml.load(f, Loader=yaml.FullLoader)

with open(PATH_UN_AGES, 'r') as f:
    data = json.load(f)
    
validate(data, schema, format_checker=FormatChecker())

data = sorted(data, key=lambda x: x['country'])

with open(PATH_UN_AGES, 'w') as f:
    json.dump(data, f, indent=0)

print(f'Validated age distribution data with len {len(data)}')

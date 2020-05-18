## loading the required libraries
import os, json, yaml

from jsonschema import validate, FormatChecker

## reading path for the age distribution JSON file
PATH_UN_AGES   = os.path.join("../", "../src/assets/data/country_age_distribution.json")

## loading the required schema to describe the structure of JSON file
with open(os.path.join('../../schemas/CountryAgeDistribution.yml'), "r") as f:
    schema = yaml.load(f, Loader=yaml.FullLoader)

## loading the age distribution data with read access
with open(PATH_UN_AGES, 'r') as f:
    data = json.load(f)

## validating the JSON data schema with the format checker function  
validate(data, schema, format_checker=FormatChecker())

## arrange the loaded data alphabetically by country name 
data = sorted(data, key=lambda x: x['country'])

## storing the sorted age data in the same folder structure 
with open(PATH_UN_AGES, 'w') as f:
    json.dump(data, f, indent=0)

## performing data check by looking at the number of rows loaded
print(f'Validated age distribution data with len {len(data)}')

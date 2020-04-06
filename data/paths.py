import os

BASE_PATH = os.path.join(os.path.dirname(os.path.realpath(__file__)))
JSON_DIR = 'assets'
TSV_DIR = 'case-counts'
SOURCES_FILE = 'sources.json'
TMP_CASES = 'case_counts.json'
TMP_POPULATION = 'population.json'
TMP_SCENARIOS = "scenario_defaults.json"
PARSERS_LOG_FILE = 'parsers.log'
FIT_PARAMETERS = 'fit_parameters.json'
SCHEMA_CASECOUNTS = '../schemas/CaseCounts.yml'
SCHEMA_SCENARIOS = '../schemas/Scenarios.yml'

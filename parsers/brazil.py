import sys
import requests
import csv
import io

from collections import defaultdict
from .utils import store_data, sorted_date

# ------------------------------------------------------------------------
# Globals

state_codes = {
    "AC": "Acre",
    "AL": "Alagoas",
    "AP": "Amapá",
    "AM": "Amazonas",
    "BA": "Bahia",
    "CE": "Ceará",
    "DF": "Distrito Federal",
    "ES": "Espírito Santo",
    "GO": "Goiás",
    "MA": "Maranhão",
    "MT": "Mato Grosso",
    "MS": "Mato Grosso do Sul",
    "MG": "Minas Gerais",
    "PA": "Pará",
    "PB": "Paraíba",
    "PR": "Paraná",
    "PE": "Pernambuco",
    "PI": "Piauí",
    "RJ": "Rio de Janeiro",
    "RN": "Rio Grande do Norte",
    "RS": "Rio Grande do Sul",
    "RO": "Rondônia",
    "RR": "Roraima",
    "SC": "Santa Catarina",
    "SP": "São Paulo",
    "SE": "Sergipe",
    "TO": "Tocantins"
}

URL  = "https://brasil.io/dataset/covid19/caso?format=csv"
LOC  = "case-counts/Americas/Latin America and the Caribbean/Brazil"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']

# ------------------------------------------------------------------------
# Functions

def to_int(x):
    if x == "NA" or x == "":
        return None
    else:
        return int(x)

# ------------------------------------------------------------------------
# Main point of entry

def parse():
    r  = requests.get(URL)
    if not r.ok:
        print(f"Failed to fetch {URL}", file=sys.stderr)
        exit(1)
        r.close()

    regions = defaultdict(list)
    fd  = io.StringIO(r.text)
    rdr = csv.reader(fd)
    hdr = next(rdr)

    for row in rdr:
        state = state_codes[row[1]]
        city = row[2]
        if city != "": continue
        date = row[0]
        cases = to_int(row[4])
        deaths = to_int(row[5])
        regions[state].append([date, cases, deaths, None, None, None])

    for state, data in regions.items():
        print(data)
        regions[state] = sorted_date(data, array_index=0)

    store_data(regions, { 'default': LOC}, 'brazil', 'BRA', cols)

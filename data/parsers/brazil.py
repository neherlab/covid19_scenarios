import sys
import requests
import csv
import io

from collections import defaultdict
from .utils import store_data, sorted_date, stoi

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
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']

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

    # Added block
    regions_external = {}
    for row in rdr:
        state = '-'.join(['BRA',state_codes[row[1]]])
        city = row[2]
        if city != "Importados/Indefinidos": continue
        date = row[0]
        cases = stoi(row[4])
        deaths = stoi(row[5])
        if state not in regions_external:
            regions_external[state] = {}
        regions_external[state][date] = [cases, deaths, None, None, None]

    fd  = io.StringIO(r.text)
    rdr = csv.reader(fd)
    hdr = next(rdr)

    for row in rdr:
        state = '-'.join(['BRA',state_codes[row[1]]])
        city = row[2]
        if city != "": continue
        date = row[0]
        cases = stoi(row[4])
        deaths = stoi(row[5])

        # remove the imported/undefined counts
        if state in regions_external and date in regions_external[state]:
            regions[state].append([date, cases-regions_external[state][date][0], deaths-regions_external[state][date][1], None, None, None])
        else:
            regions[state].append([date, cases, deaths, None, None, None])

    for state, data in regions.items():
        regions[state] = sorted_date(data, cols)

    store_data(regions, 'brazil',  cols)

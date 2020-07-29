import csv
import gzip
import io
import sys
from collections import defaultdict

import requests

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

URL = "https://data.brasil.io/dataset/covid19/caso.csv.gz"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']


def download_gz():
    r = requests.get(URL)
    if not r.ok:
        print(f"Failed to fetch {URL}", file=sys.stderr)
        exit(1)
        r.close()

    compressed_file = io.BytesIO(r.content)
    decompressed_file = gzip.open(compressed_file, mode='rt')
    return decompressed_file


def read(decompressed_file):
    decompressed_file.seek(0)
    rdr = csv.reader(decompressed_file)
    _ = next(rdr)
    return rdr


# ------------------------------------------------------------------------
# Main point of entry

def parse():
    decompressed_file = download_gz()
    rdr = read(decompressed_file)

    regions = defaultdict(list)

    # Added block
    regions_external = {}
    for row in rdr:
        state = '-'.join(['BRA', state_codes[row[1]]])
        city = row[2]
        if city != "Importados/Indefinidos": continue
        date = row[0]
        cases = stoi(row[4])
        deaths = stoi(row[5])
        if state not in regions_external:
            regions_external[state] = {}
        regions_external[state][date] = [cases, deaths, None, None, None]

    rdr = read(decompressed_file)

    for row in rdr:
        state = '-'.join(['BRA', state_codes[row[1]]])
        city = row[2]
        if city != "": continue
        date = row[0]
        cases = stoi(row[4])
        deaths = stoi(row[5])

        # remove the imported/undefined counts
        if state in regions_external and date in regions_external[state]:
            regions[state].append(
                [date, cases - regions_external[state][date][0], deaths - regions_external[state][date][1], None, None,
                 None])
        else:
            regions[state].append([date, cases, deaths, None, None, None])

    for state, data in regions.items():
        regions[state] = sorted_date(data, cols)

    store_data(regions, 'brazil', cols)


if __name__ == '__main__':
    parse()

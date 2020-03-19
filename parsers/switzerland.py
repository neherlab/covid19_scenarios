import csv
from collections import defaultdict
from .utils import write_tsv

# ------------------------------------------------------------------------
# Globals

cantonal_codes = {
   "ZH": "Zürich",
   "BE": "Bern",
   "LU": "Luzern",
   "UR": "Uri",
   "SZ": "Schwyz",
   "OW": "Obwalden",
   "NW": "Nidwalden",
   "GL": "Glarus",
   "ZG": "Zug",
   "FR": "Fribourg",
   "SO": "Solothurn",
   "BS": "Basel-Stadt",
   "BL": "Basel-Landschaft",
   "SH": "Schaffhausen",
   "AR": "Appenzell Ausserrhoden",
   "AI": "Appenzell Innerrhoden",
   "SG": "St. Gallen",
   "GR": "Graubünden",
   "AG": "Aargau",
   "TG": "Thurgau",
   "TI": "Ticino",
   "VD": "Vaud",
   "VS": "Valais",
   "NE": "Neuchâtel",
   "GE": "Geneva",
   "JU": "Jura",
}

PATH = "../raw_data/CHE-Tabelle_Faelle_Todesfaelle_2020-03-17.csv"
LOC  = "case-counts/Europe/Western Europe/Switzerland"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']

# ------------------------------------------------------------------------
# Main point of entry

def parse():
    regions = defaultdict(list)
    with open(PATH) as fd:
        rdr = csv.reader(fd)
        hdr = next(rdr)

        for row in rdr:
            if row[1] == "FL":
                continue
            date   = row[0]
            canton = cantonal_codes[row[1]]
            regions[canton].append([date, int(row[4]), int(row[5]), None, None, None])

    for region, data in regions.items():
        write_tsv(f"{LOC}/{region}.tsv", cols, data, "switzerland")

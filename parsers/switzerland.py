import csv
from collections import defaultdict

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

PATH = "raw_data/CHE-Tabelle.csv"
LOC  = "case-counts/Europe/Western Europe/Switzerland"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']

# ------------------------------------------------------------------------
# Functions

# TODO: Pull out into a utils file
def write_tsv(path, rows):
    with open(path, 'w+') as fd:
        wtr = csv.writer(fd, delimiter='\t')
        wtr.writerow(cols)
        wtr.writerows(rows)

# ------------------------------------------------------------------------
# Main point of entry

if __name__ == "__main__":
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
        write_tsv(f"{LOC}/{region}.tsv", data)

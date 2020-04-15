import sys
import requests
import csv
import io
from datetime import datetime

from .utils import store_data, stoi

# ------------------------------------------------------------------------
# Globals

#URL  = "https://github.com/spigolotti/covid2019data_okinawa/okinawaCOVID19.csv"
URL = "https://github.com/spigolotti/covid2019data_okinawa/blob/master/okinawaCOVID19.csv?raw=true"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']

# ------------------------------------------------------------------------
# Main point of entry

def parse():
    r  = requests.get(URL)
    if not r.ok:
        print(f"Failed to fetch {URL}", file=sys.stderr)
        exit(1)
        r.close()
    regions={'JPN-Okinawa'=[]}   
    fd  = io.StringIO(r.text)
    rdr = csv.reader(fd)
    hdr = next(rdr)
    for row in rdr:
        if len(row[0])==0:
            continue
        date_str=row[0]
        num_cases = stoi(row[1])
        num_deaths = stoi(row[2])
        num_hosp = stoi(row[3])
        num_recover = stoi(row[5])
        regions["JPN-Okinawa"].append([date_str, num_cases, num_deaths, num_hosp, None, num_recover])

    store_data(regions, 'okinawa', cols)

import sys
import requests
import csv
import io
import pandas as pd
from pandas.core.groupby.groupby import DataError
import numpy as np
from .utils import store_data, stoi

from collections import defaultdict
from .utils import store_data, sorted_date, stoi

# ------------------------------------------------------------------------
# Globals

rs_region_codes = {
    "SM": "Santa Maria (R01 e R02)",
    "UR": "Uruguaiana (R03)",
    "CC": "Capão da Canoa (R0 4 e R05)",
    "TQ": "Taquara (R06)",
    "NH": "Novo Hamburgo (R07)",
    "CA": "Canoas (R08)",
    "PA": "Porto Alegre (R09 e R10)",
    "SA": "Santo Ângelo (R11)",
    "CA": "Cruz Alta (R12)",
    "IJ": "Ijuí (R13)",
    "SR": "Santa Rosa (R14)",
    "PM": "Palmeira das Missões (R15 e R20)",
    "ER": "Erechim (R16)",
    "PF": "Passo Fundo (R17, R18 e R19)",
    "PE": "Pelotas (R21)",
    "BG": "Bagé (R22)",
    "CX": "Caxias do Sul (R23, R24, R25 e R26)",
    "CS": "Cachoeira do Sul (R27)",
    "SC": "Santa Cruz do Sul (R28)",
    "LJ": "Lajeado (R29 e R30)"
}


#BR/RS state source format
#time, regions, cases, deaths, hospitalized, icu, recovered
URL_RS = "https://raw.githubusercontent.com/seplagses/Covid-RS/master/data/Data_Regions_RS.csv"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']

def parse():
    r_rs  = requests.get(URL_RS)
    if not r_rs.ok:
        print(f"Failed to fetch {URL_RS}", file=sys.stderr)
        exit(1)
        r.close()
    else:  print(f"Connected to {URL_RS}", file=sys.stderr)

    
    dataframe=pd.read_csv(URL_RS, quoting=csv.QUOTE_NONE, header = 0, skiprows=2)
    print(f"data {dataframe.head()}", file=sys.stderr)
    print(list(dataframe), file=sys.stderr)
 
    try:
           dummy=pd.get_dummies(dataframe['regions'])
           dataframe=pd.concat([dataframe,dummy],axis=1)
           dataframe = dataframe.fillna(0)
           regions_name=dataframe.iloc[:,7:].columns
           print(regions_name)
           dataframe_region=dataframe[['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']].copy() 
           dataframe_region['cases']=dataframe_region['cases'].astype(int)
           dataframe_region['deaths']=dataframe_region['deaths'].astype(int)
           dataframe_region['hospitalized']=dataframe_region['hospitalized'].astype(int)
           dataframe_region['icu']=dataframe_region['icu'].astype(int)
           dataframe_region['recovered']=dataframe_region['recovered'].astype(int)
           print(f"data: {dataframe_region.head()}", file=sys.stderr)
    except DataError:
           print(f"error: {DataError}", file=sys.stderr)

    region_tables = {}
    for region in regions_name:
        region_tables['-'.join(['RS',region])]  = dataframe_region[dataframe[region]==1].values.tolist()
        
    store_data(region_tables, 'brazil_rs',  cols)

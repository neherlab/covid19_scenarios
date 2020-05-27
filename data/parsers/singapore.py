# -*- coding: utf-8 -*-
"""
Created on Sat May 23 23:15:07 2020

@author: hxchua
"""

import sys
import requests
import csv
import io
from datetime import datetime
import pandas as pd

from .utils import store_data, stoi

# ------------------------------------------------------------------------
# Globals

URL  = "https://raw.githubusercontent.com/hxchua/datadoubleconfirm/master/datasets/covid19_sg.csv"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']

# ------------------------------------------------------------------------
# Main point of entry

def parse():
    r  = requests.get(URL)
    if not r.ok:
        print(f"Failed to fetch {URL}", file=sys.stderr)
        exit(1)
        r.close()
    sg_data = dict(Singapore=[])
    
    df = pd.read_csv(URL)
    
    df.loc[df['Date'] <= '2020-03-19', 'hosp_cleaned'] = df['Still_Hospitalised'] - df['Intensive_Care_Unit_(ICU)']   
    df.loc[df['Date'] > '2020-03-19', 'hosp_cleaned'] = df['General_Wards_MOH_report'] 
    
    for i in range(0,df.shape[0]):
        date_str = df['Date'][i]
        num_cases = df['Cumulative_Confirmed'][i]
        num_deaths = df['Cumulative_Deaths'][i]
        num_hosp = df['hosp_cleaned'][i].astype(int)
        num_icus = df['Intensive_Care_Unit_(ICU)'][i]
        num_recovered = df['Cumulative_Discharged'][i]

        sg_data["Singapore"].append([date_str, num_cases, num_deaths, num_hosp, num_icus, num_recovered])
    
    store_data(sg_data, 'singapore', cols)
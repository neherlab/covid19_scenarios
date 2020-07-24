import pandas as pd
import numpy as np
from .utils import store_data, stoi

# ------------------------------------------------------------------------
# Globals
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']

# ------------------------------------------------------------------------
# Main point of entry

def parse():

    #Data extraction from source
    dataframe=pd.read_csv("https://raw.githubusercontent.com/kaz-ogiwara/covid19/master/data/prefectures.csv")

    #Time format conversion
    time_format = '%Y-%m-%d'
    dataframe['date'] = pd.to_datetime(dataframe.year.astype(str)+'-'+dataframe.month.astype(str)+'-'+dataframe.date.astype(str), format=time_format)

    #Separate by region
    dummy=pd.get_dummies(dataframe['prefectureNameE'])
    dataframe=pd.concat([dataframe,dummy],axis=1)
    regions_name=dataframe.iloc[:,9:].columns
    dataframe['icu']=None
    dataframe['hospital']=None
    dataframe_region=dataframe[['date', 'testedPositive', 'deaths', 'hospital', 'icu', 'discharged']].copy()
    dataframe_region['date']=dataframe_region['date'].astype(str)
    cols_int=['testedPositive', 'deaths', 'discharged']
    for col in cols_int:
        dataframe_region[col] = dataframe_region[col].apply(lambda x: int(x) if x == x else "")
    dataframe_region = dataframe_region.where(pd.notnull(dataframe_region), None)

    region_tables = {}
    for region in regions_name:
        region_tables['-'.join(['JPN',region])]  = dataframe_region[dataframe[region]==1].values.tolist()

    #All Japan cases
    #Data extraction from source
    dataframe=pd.read_csv("https://raw.githubusercontent.com/kaz-ogiwara/covid19/master/data/summary.csv")

    #Time format conversion
    time_format = '%Y-%m-%d'
    dataframe['date'] = pd.to_datetime(dataframe.year.astype(str)+'-'+dataframe.month.astype(str)+'-'+dataframe.date.astype(str), format=time_format)
    dataframe['date']=dataframe['date'].astype(str)

    dataframe_japan=dataframe[['date', 'tested_positive', 'death', 'hospitalized', 'serious', 'discharged']].copy()
    cols_int=['tested_positive', 'death', 'hospitalized', 'serious', 'discharged']
    for col in cols_int:
        dataframe_japan[col] = dataframe_japan[col].apply(lambda x: int(x) if x == x else "")
    dataframe_japan = dataframe_japan.where(pd.notnull(dataframe_japan), None)
    region_tables['Japan']=dataframe_japan.values.tolist()
    store_data(region_tables, 'japan', cols)

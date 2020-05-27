import os
from typing import Dict

import pandas as pd
import requests

from parsers.utils import sanitize
from paths import BASE_PATH, TSV_DIR

COUNTRY = 'canada'
REGION = 'CAN-Ontario'
URL = 'https://data.ontario.ca/api/3/action/datastore_search?resource_id=ed270bb8-340b-41f9-a7c6-e8ef587e6d11'
DESIRED_PAGE_SIZE = 1000
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']
dcols = {
    'Reported Date': 'time',
    'Total Cases': 'cases',
    'Deaths': 'deaths',
    'Number of patients hospitalized with COVID-19': 'hospitalized',
    'Number of patients in ICU with COVID-19': 'icu',
    'Resolved': 'recovered',
}


def parse():
    real_page_size = DESIRED_PAGE_SIZE
    url = f'{URL}&offset=0&limit={real_page_size}'
    response: Dict = requests.get(url).json()
    result = response.get('result')

    n_rows = int(result.get('total'))
    real_page_size = int(result.get('limit'))
    n_pages = int(n_rows / real_page_size) + 1

    records = result.get('records')
    df = pd.DataFrame.from_dict(records)

    for page in range(1, n_pages):
        offset = page * real_page_size
        response: Dict = requests.get(f'{URL}&offset={offset}&limit={real_page_size}').json()
        new_records = response.get('result').get('records')
        new_df = pd.DataFrame.from_dict(new_records)
        df = df.append(new_df)

    df = df[dcols.keys()]
    df = df.rename(columns=dcols)
    df['time'] = df['time'].apply(pd.to_datetime)
    df = df.set_index('time')

    assert len(df.index) == n_rows

    region = sanitize(REGION)
    filepath = f'{BASE_PATH}/{TSV_DIR}/{COUNTRY}/{region}.tsv'
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    df.to_csv(filepath, sep='\t', na_rep='', float_format='%i', date_format='%Y-%m-%d')


if __name__ == '__main__':
    parse()

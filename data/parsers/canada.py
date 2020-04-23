import xlrd
from datetime import datetime

from urllib.request import urlretrieve
from .utils import store_data, sorted_date

# ------------------------------------------------------------------------
# Globals

# https://github.com/ishaberry/Covid19Canada
URL  = "https://docs.google.com/spreadsheets/d/1D6okqtBS3S2NRC7GFVHzaZ67DuTw7LX49-fqSLwJyeo/export?format=xlsx"
cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']
dcols = {'cases': 'date_report', 'deaths': 'date_death_report', 'recovered': 'date_recovered'}
# ------------------------------------------------------------------------
# Main point of entry

def parse():
    file_name, headers = urlretrieve(URL)
    workbook = xlrd.open_workbook(file_name)

    #The API provides multiple sheets, each sheet contains rows for an individual person, with province and date
    data = {}
    data['cases'] = workbook.sheet_by_name('Cases')
    data['deaths'] = workbook.sheet_by_name('Mortality')
    data['recovered'] = workbook.sheet_by_name('Recovered')

    cases = {}
    for k in data: 
        i = 0
        Ix = {}
        worksheet = data[k]
        # dynamically build a dictionary of row headers, should be fixed to row 4 now
        for c in worksheet.row_values(3):
            Ix[c] = i
            i += 1
        # add each entry
        for row_index in range(4, worksheet.nrows):
            row = worksheet.row_values(row_index)

            state = '-'.join(['CAN',row[Ix['province']]])

            # fix some names that do not fit entries in populationData.tsv
            if state == 'CAN-BC':
                state = 'CAN-British Columbia'
            elif state == 'CAN-NL':
                state = 'CAN-Newfoundland and Labrador'
            elif state == 'CAN-PEI':
                state = 'CAN-Prince Edward Island'

            
            # Hack: recovered currently has no county-level data.            
            county = None
            # county-level removed as requested in https://github.com/neherlab/covid19_scenarios_data/pull/42#issuecomment-603427339
            #if  k=='recovered':
            #    county = None
            #else:
            #    county = state+'-'+row[Ix['health_region']]
            time =  xlrd.xldate_as_datetime(row[Ix[dcols[k]]], workbook.datemode).strftime('%Y-%m-%d')
            # add this row to both state and county-level data
            for p in [state, county]:
                if not p:
                    continue
                if not p in cases:
                    cases[p] = []
                try:
                    od = next(x for x in cases[p] if x['time']==time)
                    # we found prior data, update it. There should only be one match here
                    # recovered is cumulative, and the other two are just 1 item per row
                    if k=='recovered':
                        if k in od and not row[Ix['cumulative_recovered']] == 'NA':
                            od[k] += int(row[Ix['cumulative_recovered']])
                        elif not row[Ix['cumulative_recovered']] == 'NA':
                            od[k] = int(row[Ix['cumulative_recovered']])
                    else:
                        if k in od:
                            od[k] += 1
                        else:
                            od[k] = 1
                except (StopIteration, KeyError) as e:
                    # first observation for that date and
                    cases[p].append({'time': time, k: 1})

    for cntry, data in cases.items():
        cases[cntry] = sorted_date(cases[cntry])

    # aggregate cases/deaths here after sorting
    for cntry, data in cases.items():
        total = {}
        total['cases']  = 0
        total['deaths'] = 0
        # recovered seems to be cumulative already
        #total['recovered'] = 0
        for k in total:        
            for d in data:
                if k in d and d[k]:
                    total[k] += d[k]
                d[k] = total[k]
    
    store_data(cases, 'canada', cols)

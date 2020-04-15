# script to get population data, hospital beds, and ICU beds from trusted sources
# to be run via 'make population' in data/, will produce populationData.tsv in same folder

import xlrd
import csv
import json

from requests import get
from urllib.request import urlretrieve
from collections import defaultdict
from datetime import datetime, timedelta
from parsers.utils import sorted_date, parse_countries, stoi, store_data

#  WHO Hospital data from https://gateway.euro.who.int/en/indicators/hfa_479-5061-number-of-acute-care-hospital-beds/
# WHO data is from 2015
URL_Hosp = "https://dw.euro.who.int/api/v3/export/download/a8cb2f20d3e74b75a38769fb44c2dc9b"
# eurostat data is from 2017
URL_Hosp_Eurostat = "https://ec.europa.eu/eurostat/tgm/table.do?tab=table&init=1&plugin=1&language=en&pcode=tps00046"
# hardcode a date for ecdc because the data is not daily anyways, and sometimes has bugs
URL_Pop  = "https://www.ecdc.europa.eu/sites/default/files/documents/COVID-19-geographic-disbtribution-worldwide-2020-04-04.xlsx"
URL_ICU = "http://dx.doi.org/10.1007/s00134-012-2627-8" # the paper where the numbers came from
# other ICU source: https://doi.org/10.1097/CCM.0000000000004222, Critical Care Bed Capacity in Asian Countries and Regions Article in Critical Care Medicine · January 2020
URL_ICU_ASIA = "https://doi.org/10.1097/CCM.0000000000004222" # the paper where the numbers came from
URL_CIA = "https://raw.githubusercontent.com/iancoleman/cia_world_factbook_api/master/data/factbook.json"

cols = ['name', 'populationServed', 'ageDistribution', 'hospitalBeds', 'ICUBeds', 'hemisphere', 'srcPopulation', 'srcHospitalBeds','srcICUBeds']

ciaMap = {
    'bahamas_the': 'Bahamas',
    'british_virgin_islands': 'Virgin Islands (British)',
'burma': 'Myanmar',
'congo_democratic_republic_of_the': 'Congo, Democratic Republic of the',
'congo_republic_of_the': 'Congo',
"cote_d'_ivoire": "Côte d'Ivoire",
'curacao': 'Curaçao',
'gambia_the': 'Gambia',
'guinea_bissau': 'Guinea-Bissau',
'holy_see_vatican_city': 'Holy See',
'korea_north': "Korea (Democratic People's Republic of)",
'korea_south': 'Korea, Republic of',
'laos': "Lao People's Democratic Republic",
'macau': 'Macao',
'micronesia_federated_states_of': 'Micronesia (Federated States of)',
'pitcairn_islands': 'Pitcairn',
'saint_barthelemy': 'Saint Barthélemy',
'saint_helena_ascension_and_tristan_da_cunha': 'Saint Helena, Ascension and Tristan da Cunha',
'south_georgia_and_south_sandwich_islands': 'South Georgia and the South Sandwich Islands',
'timor_leste': 'Timor-Leste',
'vietnam': 'Viet Nam'
}


def update_cia_facts(hospData, popData):
    r  = get(URL_CIA)
    if not r.ok:
        print(f"Failed to fetch {URL}", file=sys.stderr)
        exit(1)

    db = json.loads(r.text)

    countries = parse_countries(2)

    for country in db["countries"]:
        country2 = None
        matches = [r for s,r in zip([x.lower() for x in countries.values()],[x for x in countries.values()]) if country.replace("_"," ") in s]
        if len(matches) == 0:
            # manual map to compensate
            if country in ciaMap:
                country2 = ciaMap[country]
            else:
                #print(f'no match found for {country}')
                continue
        elif len(matches) == 1:
            country2 = matches[0]
        else:
            # only few cases, handle manually
            for n in matches:
                if country.replace("_"," ") == n.lower():
                    country2 = n
            if country == 'united_states':
                country2 = 'United States of America'
            elif country == 'virgin_islands':
                country2 = 'Virgin Islands (U.S.)'
            if not country2:
                print(f'{country} matches {matches}')
                continue
        if not 'people' in db['countries'][country]['data']:
            continue
        
        population = stoi(db["countries"][country]["data"]["people"]["population"]["total"])
        source = db["countries"][country]["metadata"]["source"]
        if not country2 in hospData and 'hospital_bed_density' in db['countries'][country]['data']['people']:
            hospData[country2] = {}
            hospData[country2]['hospitalBeds'] = int(population/1000*float(db['countries'][country]['data']['people']['hospital_bed_density']['beds_per_1000_population']))
            if 'date' in db['countries'][country]['data']['people']['hospital_bed_density']:
                hospData[country2]['srcHospitalBeds'] = f"Computed from {db['countries'][country]['data']['people']['hospital_bed_density']['date']} data in CIA fact book {source}"
            else:
                hospData[country2]['srcHospitalBeds'] = f"Computed from data in CIA fact book {source}"

        if not country2 in popData and 'population' in db['countries'][country]['data']['people']:
            popData[country2] = {}
            popData[country2]['populationServed'] = population
            if 'date' in db['countries'][country]['data']['people']['population']:
                popData[country2]['srcPopulation'] = f"{db['countries'][country]['data']['people']['population']['date']} data in CIA fact book {source}"
            else:
                popData[country2]['srcPopulation'] = f"Data in CIA fact book {source}"
    return hospData, popData
    

def update_hosp_data(hospData, popData):
    countries = parse_countries(2)
    newData = {}
    # OECD, only in percentages of population, up to around 2016
    with open('hospital-data/hospital_capacity_oecd.csv', 'r') as fd:
        rdr = csv.reader(fd, delimiter=',')
        hdr = next(rdr)
        
        for row in rdr:
            country   = row[0].strip()
            if not country in countries:
                #print(f'{country} not found in countries')
                continue
            else:
                country = countries[country]
            if not country in hospData:
                if not country in newData:
                    newData[country] = {}
                newData[country][row[2]] = float(row[6])

    # newData contains latest=newest entries only now, for countries we need to add
    for country in newData:
        if country in popData:
            if 'ACUTE' in newData[country]:
                if not country in hospData:
                    hospData[country] = {}
                hospData[country]['hospitalBeds'] = int(popData[country]['populationServed']/1000*newData[country]['ACUTE'])
                hospData[country]['srcHospitalBeds'] = "Computed from acute care OECD numbers and population size"
            elif 'TOT' in newData[country]:
                if not country in hospData:
                    hospData[country] = {}
                hospData[country]['hospitalBeds'] = int(popData[country]['populationServed']/1000*newData[country]['TOT'])
                hospData[country]['srcHospitalBeds'] = "Computed from total bed OECD numbers and population size"
    return hospData

def retrieve_hosp_data():
    countries = parse_countries(2)
    hospData = {}
    
    # For now, always get the data from yesterday. We could make fancier check if today's data is already available
    file_name, headers = urlretrieve(URL_Hosp)

    workbook = xlrd.open_workbook(file_name)

    worksheet = workbook.sheet_by_name('Data (table)')
    i = 0
    Ix = {}
    for c in worksheet.row_values(0):
        Ix[c] = i
        i += 1
    for row_index in range(1, worksheet.nrows):
        row = worksheet.row_values(row_index)
        country = row[Ix['COUNTRY_REGION']]
        if country in countries:
            country = countries[country]
        else:
            #print(f'could not find country {country}')
            continue
        hospData[country] = {'hospitalBeds': stoi(row[Ix['VALUE']]), 'srcHospitalBeds': 'WHO Hospital data from https://gateway.euro.who.int/en/indicators/hfa_479-5061-number-of-acute-care-hospital-beds/'}

    # second data set, for Asia
    with open('hospital-data/ICU_asia.tsv', 'r') as fd:
        rdr = csv.reader(fd, delimiter='\t')
        hdr = next(rdr)

        for row in rdr:
            country   = row[0].strip()
            if stoi(row[1]):
                hospData[country] = {'hospitalBeds': stoi(row[1]), 'srcHospitalBeds': URL_ICU_ASIA}

    # Eurostat, newer than from WHO (2017 vs 2015)
    with open('hospital-data/hospital_eurostat.tsv', 'r') as fd:
        rdr = csv.reader(fd, delimiter='\t')
        hdr = next(rdr)

        for row in rdr:
            country   = row[0].strip()
            if not country in hospData:
                hospData[country] = {'hospitalBeds': stoi(row[1]), 'srcHospitalBeds': URL_Hosp_Eurostat}
            else:
                #print(f'found new data for {country}: old: {hospData[country]["hospitalBeds"]}, new: {stoi(row[1])}')
                hospData[country] = {'hospitalBeds': stoi(row[1]), 'srcHospitalBeds': URL_Hosp_Eurostat}

            
    return hospData

def retrieve_pop_data():
    countries = parse_countries(2)
    countries1 = parse_countries(1)
    countries['XKX'] = countries['RKS']
    countries1['BLM'] = countries1['BL']
    popData = {}

    file_name, headers = urlretrieve(URL_Pop)

    workbook = xlrd.open_workbook(file_name)

    worksheet = workbook.sheet_by_index(0) 

    i = 0
    Ix = {}
    for c in worksheet.row_values(0):
        Ix[c] = i
        i += 1
    for row_index in range(1, worksheet.nrows):
        row = worksheet.row_values(row_index)

        popData2018 = stoi(row[Ix['popData2018']])

        # replace country name if we have the "official" one in country_codes.csv
        country = row[Ix['countryterritoryCode']]
        if country == [] or not country:
            country = countries1[row[Ix['geoId']]]
        elif country in countries:
            country = countries[country] 
        else:
            #print(f'could not find country {country}')        
            continue
        popData[country] = {'populationServed': popData2018, 'srcPopulation': 'ECDC'}

    return popData

def retrieve_icu_data():
    icuData = {}
    with open('hospital-data/ICU_capacity.tsv', 'r') as fd:
        rdr = csv.reader(fd, delimiter='\t')
        hdr = next(rdr)

        for row in rdr:
            country   = row[0].strip()
            icuData[country] = {'ICUBeds': stoi(row[5]), 'srcICUBeds': URL_ICU}

    # second data set, for Asia
    with open('hospital-data/ICU_asia.tsv', 'r') as fd:
        rdr = csv.reader(fd, delimiter='\t')
        hdr = next(rdr)

        for row in rdr:
            country   = row[0].strip()
            icuData[country] = {'ICUBeds': stoi(row[5]), 'srcICUBeds': URL_ICU_ASIA}
            
    return icuData

def get_old_data():
    known = {}
    with open('populationData.tsv', 'r') as fd:
        rdr = csv.reader(fd, delimiter='\t')
        hdr = next(rdr)
        i = 0
        Ix = {}
        for c in hdr:
            Ix[c] = i
            i += 1
        for row in rdr:
            name   = row[0]
            if not name in known:
                known[name] = {}
            for n in Ix:
                if n == 'name':
                    continue
                if  'name' in n or  'ageDistribution' in n or  'hemisphere' in n or  'src' in n:
                    known[name][n] = row[Ix[n]]
                else:
                    known[name][n] = stoi(row[Ix[n]])
    return known

def generate(output):


    hospData = retrieve_hosp_data()
    icuData = retrieve_icu_data()
    popData = retrieve_pop_data()

    hospData = update_hosp_data(hospData, popData)
    hospData, popData = update_cia_facts(hospData, popData)
    
    newData = {}
    for d in hospData:
        if not d in newData:
            newData[d] = {}
        newData[d].update(hospData[d])
    for d in icuData:
        if not d in newData:
            newData[d] = {}
        newData[d].update(icuData[d])
    for d in popData:
        if not d in newData:
            newData[d] = {}
        newData[d].update(popData[d])
    
    oldData = get_old_data()
    i = 0
    for c in oldData:
        if 'populationServed' in oldData[c] and 'hospitalBeds' in oldData[c] and 'ICUBeds' in oldData[c]:
            i += 1
    #print(f'{i} old entries are complete')

    #merge data with old data. Give preference to new (sourced) data
    for n in oldData:
            if n in newData:
                if not 'populationServed' in newData[n]:
                    newData[n]['populationServed'] = oldData[n]['populationServed']
                    newData[n]['srcPopulation'] = oldData[n]['srcPopulation']
                #elif oldData[n]['srcPopulation'] and not oldData[n]['srcPopulation']== 'None':
                #    print(f'Ignoring old pop source {oldData[n]["srcPopulation"]}')
                #    print(f'old val was {oldData[n]["populationServed"]}, new val is {newData[n]["populationServed"]}')
                if not 'hospitalBeds' in newData[n]:
                    newData[n]['hospitalBeds'] = oldData[n]['hospitalBeds']
                    newData[n]['srcHospitalBeds'] = oldData[n]['srcHospitalBeds']
                #elif oldData[n]['srcHospitalBeds'] and not oldData[n]['srcHospitalBeds']== 'None':
                #    print(f'Ignoring old hosp source {oldData[n]["srcPopulation"]}')
                if not 'ICUBeds' in newData[n]:
                    newData[n]['ICUBeds'] = oldData[n]['ICUBeds']
                    newData[n]['srcICUBeds'] = oldData[n]['srcICUBeds']
                if not 'hemisphere' in newData[n]:
                    newData[n]['hemisphere'] = oldData[n]['hemisphere']
            else:
                newData[n] = oldData [n]

    # estimate ICU data if only hospital data is available, and pop > 1M
    for c in newData:
        if 'populationServed' in newData[c] and newData[c]['populationServed'] and newData[c]['populationServed'] > 1000000 and 'hospitalBeds' in newData[c] and not 'ICUBeds' in newData[c]:
            # global average of ICU beds vs hospital beds seems to be 3%
            newData[c]['ICUBeds'] = int(newData[c]['hospitalBeds']*0.03) 
            newData[c]['srcICUBeds'] = "Estimated based on 3% of hospital beds" 


    # lets count how many entries are complete
    i = 0
    toDel = []
    for c in newData:
        if 'populationServed' in newData[c] and 'hospitalBeds' in newData[c] and 'ICUBeds' in newData[c]:
        #if  'hospitalBeds' in newData[c] :
            i += 1
        else:
            # remove non-complete entries for now
            toDel.append(c)
    for k in toDel:
        del newData[k]
    print(f'{i} entries are complete')

    

    
    with open(output, 'w', newline="") as fd:
        wtr = csv.writer(fd, delimiter='\t', lineterminator='\n')
        wtr.writerow(cols)
        rows = []
        for d in newData:
            nrow = [d]
            for c in cols:
                if c == 'name':
                    continue
                # TODO check if we actually have the age distribution?
                if c == 'ageDistribution' and not 'ageDistribution' in newData[d] :
                    nrow.append(d)
                elif c in newData[d]:
                    nrow.append(newData[d][c])
                else:
                    nrow.append(None)
            rows.append(nrow)
        rows = sorted(rows, key=lambda x: x[0])
            
        wtr.writerows(rows)

import os, sys, io
import csv
import json
import requests
from datetime import date

from collections import defaultdict
from .utils import store_data

# ------------------------------------------------------------------------
# Globals

measure_categories = { # for use in covid-19 scenarios
  '1':['Ban on mass gatherings'],
  '2':['Nurseries/schools/universities closure'],
  '3':['Restaurants/entertainment/shops closure'],
  '4':['Household confinement'],
  '5':['Contact Tracing'],
  '6':['Borders closure/limitation of movements/symptoms screening'],
  '7':['Isolation/quarantine of cases'],
  '8':['Office closures'],
  '9':['Universal mask'],
  '10':['NA']}

# --> TO DO: assign a reduction range to each measure in measure_categories

# Mapping of HIT mitigation measures (JHU) to covid-19 categories
mapping = {
  'Universal facemask policies':[measure_categories['9']],
  'Testing of symptomatic individuals':[measure_categories['5']],
  'Testing of asymptomatic individuals':[measure_categories['5']],
  'Symptom screening when entering by sea':[measure_categories['6']],
  'Symptom screening when entering by land':[measure_categories['6']],
  'Symptom screening when entering by air':[measure_categories['6']],
  'Symptom screening at checkpoints within borders':[measure_categories['6']],
  'State of emergency':[measure_categories['10']],
  'Secondary school closures':[measure_categories['2']],
  'School closures of unknown type':[measure_categories['2']],
  'Retail store closures (excluding essentials)':[measure_categories['3']],
  'Restaurant closures (excluding takeout/delivery)':[measure_categories['3']],
  'Quarantine of travelers':[measure_categories['7']],
  'Quarantine of other asymptomatic individuals':[measure_categories['7']],
  'Quarantine of contacts suspected (symptomatic) cases':[measure_categories['7']],
  'Quarantine of contacts confirmed cases':[measure_categories['7']],
  'Public transportation closures':[measure_categories['10']],
  'Public space closures':[measure_categories['3']],
  'Primary school closures':[measure_categories['2']],
  'Post-secondary school closures':[measure_categories['2']],
  'Office closures':[measure_categories['8']],
  'Nursing home/long-term care closures':[measure_categories['2']],
  'Nursery school closures':[measure_categories['2']],
  'Military and police deployment':[measure_categories['10']],
  'Limiting size of gatherings':[measure_categories['1']],
  'Limiting number of patrons in restaurants':[measure_categories['1']],
  'Limiting movement within borders':[measure_categories['6']],
  'Leisure, entertainment, and religious venue closures':[measure_categories['3']],
  'Household confinement':[measure_categories['4']],
  'Home isolation of suspected (symptomatic) cases':[measure_categories['7']],
  'Home isolation of non-hospitalized confirmed cases':[measure_categories['7']],
  'Home isolation of confirmed cases discharged from the hospital':[measure_categories['7']],
  'Contact tracing':[measure_categories['5']],
  'Border closures for leaving by sea':[measure_categories['6']],
  'Border closures for leaving by land':[measure_categories['6']],
  'Border closures for leaving by air':[measure_categories['6']],
  'Border closures for entering by sea':[measure_categories['6']],
  'Border closures for entering by land':[measure_categories['6']],
  'Border closures for entering by air':[measure_categories['6']]}

# --> TO DO: URL changes dynamically, need to fix this !
URL = "https://iddynamics.jhsph.edu/apps/connect/content/25/_w_f79c18ee/session/089681125bfd645ece0c677db0997ecb/download/download_data?w=f79c18ee"
r  = requests.get(URL)
cols = ['timestamp','state','mitigation_measure','mitigation_category','status','update_date','end_date']

# ------------------------------------------------------------------------
# Main point of entry

def parse():
    r  = requests.get(URL)

    if not r.ok:
        print(f"Failed to fetch {URL}", file=sys.stderr)
        exit(1)
        r.close()

    mitigations = r.text
    r.close()

    mitigations = defaultdict(list)
    mtg  = io.StringIO(r.text)
    mtg = csv.reader(mtg)
    next(mtg, None)

    for row in mtg:
        timestamp = row[1]
        country = row[3]
        state = row[6]
        measure = row[8]
        if measure in mapping.keys():
          measure_category = mapping[measure]
        else:
          measure_category = 'NA'
        status = row[11] # status can be "strongly/partially/not implemented"... this may hide end_dates...!
        if row[9]!="NA": # skip measure if not date was given
            tmp_date = list(map(int,row[9].split('-')))
            update_date = date(tmp_date[0],tmp_date[1],tmp_date[2])
            mitigations[country].append([timestamp,state,measure,measure_category,status,update_date,None])

    # --> TO DO: store_data: agree how/where to save it.
    #store_data(mitigations, 'mitigationMeasures',  cols)

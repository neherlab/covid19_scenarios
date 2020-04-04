'''
This script generates the json with the population presets that contain
 * name
 * populationServed
 * initial cases
 * imports
 * hospital beds
 * ICU beds

It should be run from outside the repo as

  python3 covid19_scenarios_data/scripts/make_populations.py

'''

from collections import defaultdict
import csv
import json
import numpy as np
import os
import sys
sys.path.append('..')
from paths import TMP_CASES, BASE_PATH, JSON_DIR, TMP_POPULATION
from scripts.tsv import parse as parse_tsv

# obsolete
def getImportsPerDay(pop, cases):
    return np.maximum(0.1, 0.00003*np.maximum(pop**0.3,10)*np.maximum(cases,1))

# utility, might be handy in the future. currently no used.
def getCountryAbbreviations():
    toThreeLetter = {}
    toName = {}
    with open(os.path.join(BASE_PATH, 'country_codes.csv')) as fh:
        header = [x.strip('"') for x in fh.readline().strip().split(',')]
        name_index = header.index('name')
        three_letter_index = header.index('alpha-3')
        for line in fh:
            entries = [x.strip('"') for x in line.strip().split(',')]
            if entries[0]=='SWE':
                print(entries)
            if len(entries) > three_letter_index:
                toThreeLetter[entries[name_index]] = entries[three_letter_index]
                toName[entries[three_letter_index]] = entries[name_index]

    return toThreeLetter, toName

def dumpPopTable(pops, fname):
    with open(fname, 'w') as fh:
        fh.write('\t'.join(['name', 'populationServed', 'ageDistribution', 'hospitalBeds', 'ICUBeds', 'hemisphere'])+'\n')
        for pop in pops:
            fh.write('\t'.join([pop['name'],
                                str(pop['data']['populationServed']),
                                pop['data']['country'],
                                str(pop['data']['hospitalBeds']),
                                str(pop['data']['ICUBeds']),
                                str(pop['data']['hemisphere'])])+'\n')

def loadPopTable(fname):
    pops = []
    with open(fname, 'r') as fh:
        header = fh.readline().strip().split('\t')
        for line in fh:
            entries = line.strip().split('\t')
            tmp = {'name':entries[0], 'data':{}}
            tmp['data']['populationServed'] = int(entries[1])
            tmp['data']['country'] = entries[2]
            tmp['data']['hospitalBeds'] = int(entries[3])
            tmp['data']['ICUBeds'] = int(entries[4])
            tmp['data']['hemisphere'] = entries[5]
            pops.append(tmp)

    return pops

def getRegions():
    regions = parse_tsv()
    return set(regions.keys())

def generate(output):
    pops = loadPopTable(os.path.join(BASE_PATH,"populationData.tsv"))
    popSizes = {d['name']:d['data']['populationServed'] for d in pops}

    regions = getRegions()

    for d in pops:
        d['data']['cases'] = d['name'] if d['name'] in regions else 'none'

    with open(output, 'w') as fh:
        json.dump(pops, fh)


if __name__ == '__main__':
    parse()

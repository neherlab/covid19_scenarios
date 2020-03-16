from collections import defaultdict
import csv
import json
import numpy as np
from download_case_counts import getCaseCounts

def getImportsPerDay(pop, cases):
    return np.maximum(0.1, 0.00001*np.maximum(pop**0.3,10)*np.maximum(cases,1))

def getCountryAbbreviations():
    toThreeLetter = {}
    toName = {}
    with open('auxillaryData/country_codes.csv') as fh:
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


def getHospitalBedData(fname, toName):
    hospitalBedsSeries = defaultdict(list)
    with open(fname) as fh:
        header = [x.strip('"') for x in fh.readline().strip().split(',')]
        countryIndex = 0 #header.index('COUNTRY')
        yearIndex = header.index('YEAR')
        valueIndex = header.index('VALUE')
        for line in fh:
            entries = [x.strip('"') for x in line.strip().split(',')]
            if len(entries[0])==3 and entries[0] in toName:
                hospitalBedsSeries [toName[entries[0]]].append((int(entries[yearIndex]), int(float(entries[valueIndex]))))

    hospitalBeds = {}
    for c, v in hospitalBedsSeries.items():
        hospitalBeds[c] = sorted(v, key=lambda x:x[0], reverse=True)[0][1]

    return hospitalBeds

def getICUBedData(fname, toName):
    ICUBeds = {}
    with open(fname) as fh:
        header = [x.strip(' ') for x in fh.readline().strip().split('\t')]
        countryIndex = header.index('country')
        valueIndex = header.index('CriticalCare')
        for line in fh:
            entries = [x.strip(' ') for x in line.strip().split('\t')]
            ICUBeds[entries[countryIndex]] = int(float(entries[valueIndex]))

    return ICUBeds

def dumpPopTable(pops, fname):
    with open(fname, 'w') as fh:
        fh.write('\t'.join(['name', 'populationServed', 'ageDistribution', 'hospitalBeds', 'ICUBeds'])+'\n')
        for pop in pops:
            fh.write('\t'.join([pop['name'],
                                str(pop['data']['populationServed']),
                                pop['data']['country'],
                                str(pop['data']['hospitalBeds']),
                                str(pop['data']['ICUBeds'])])+'\n')

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
            pops.append(tmp)

    return pops

def generateTable():
    pops = []
    toThreeLetter, toName = getCountryAbbreviations()
    hospitalBeds = getHospitalBedData('auxillaryData/hospital_capacity.csv', toName)
    ICUBeds = getICUBedData('auxillaryData/ICU_capacity.tsv', toName)
    defaultHospitalValuePerCapita = 0.0045 #OECD average
    defaultICUValuePerCapita = 0.00015 #OECD average
    caseCountMultiplier = {}

    with open("auxillaryData/population_sizes.tsv") as fh:
        header = fh.readline().strip().split('\t')
        for line in fh:
            entries = line.strip().split('\t')
            tmp = {}
            popSize = int(entries[1])
            tmp['name'] = entries[0]
            tmp['data'] = {'populationServed': round(popSize/1000)*1000,
                           'country':entries[2]
                           }
            pops.append(tmp)
            if len(entries)>3:
                caseCountMultiplier[tmp['name']] = float(entries[3])

    popSizes = {d['name']:d['data']['populationServed'] for d in pops}

    for d in pops:
        popSize = d['data']['populationServed']
        dd = d['data']
        country = dd['country']
        if d['name'] in hospitalBeds:
            dd['hospitalBeds']  = hospitalBeds[d['name']]
        elif country in hospitalBeds and country in popSizes: # scale country value to division
            dd['hospitalBeds'] = int(hospitalBeds[country]*popSize/popSizes[country])
        else:
            dd['hospitalBeds'] = int(defaultHospitalValuePerCapita*popSize)

        if d['name'] in ICUBeds:
            dd['ICUBeds']  = ICUBeds[d['name']]
        elif country in ICUBeds and country in popSizes: # scale country value to division
            dd['ICUBeds'] = int(ICUBeds[country]*popSize/popSizes[country])
        else:
            dd['ICUBeds'] = int(defaultICUValuePerCapita*popSize)

    return pops, caseCountMultiplier

if __name__ == '__main__':

    pops = loadPopTable("auxillaryData/populationData.tsv")
    oldPops, caseCountMultiplier = generateTable()

    targetDate = '2020-03-01'
    cases = getCaseCounts()

    popSizes = {d['name']:d['data']['populationServed'] for d in pops}
    caseCountsMarch = {}
    for c in cases:
        start = [x['cases'] for x in cases[c] if x['time']==targetDate]
        caseCountsMarch[c] = start[0] if len(start) else cases[c][0]['cases']

    for d in pops:
        popSize = d['data']['populationServed']
        dd = d['data']
        country = dd['country']

        if d['name'] in caseCountsMarch:
            dd['suspectedCasesToday'] = int(caseCountsMarch[d['name']]*caseCountMultiplier[d['name']])
        elif country in caseCountsMarch and country in popSizes:
            dd['suspectedCasesToday'] = int(caseCountsMarch[country]*caseCountMultiplier[country]*popSize/popSizes[country])
        else:
            dd['suspectedCasesToday'] = 5

        dd['importsPerDay'] = round(getImportsPerDay(popSize, dd['suspectedCasesToday']),1)
        dd['importsPerDay'] = round(getImportsPerDay(popSize, dd['suspectedCasesToday']),1)
        dd['cases'] = d['name'] if d['name'] in cases else 'none'

    with open('../src/assets/data/population.json', 'w') as fh:
        json.dump(pops, fh)

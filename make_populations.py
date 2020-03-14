import csv
import json
import numpy as np

def getImportsPerDay(pop, cases):
    return np.maximum(0.1, 0.00001*np.maximum(pop**0.3,10)*np.maximum(cases,1))


if __name__ == '__main__':
    pops = []
    with open("population_sizes.tsv") as fh:
        header = fh.readline().strip().split('\t')
        for line in fh:
            entries = line.strip().split('\t')
            tmp = {}
            tmp['name'] = entries[0]
            tmp['data'] = {'populationServed': round(int(entries[1])/1000)*1000,
                           'country':entries[2],
                           'suspectedCasesToday':int(entries[3]),
                           'importsPerDay':round(getImportsPerDay(int(entries[1]), int(entries[3])),1)}
            pops.append(tmp)

    with open('../src/assets/data/population.json', 'w') as fh:
        json.dump(pops, fh)

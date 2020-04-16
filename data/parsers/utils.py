import csv
import json
import functools
import os
import re
import sys
import yaml

from paths import TMP_CASES, BASE_PATH, JSON_DIR, SOURCES_FILE, TSV_DIR, SCHEMA_CASECOUNTS

from datetime import datetime
from collections import defaultdict
from jsonschema import validate, FormatChecker

# ------------------------------------------------------------------------
# Globals
with open(os.path.join(BASE_PATH, SOURCES_FILE)) as fh:
    sources = json.load(fh)

default_cols = ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']


# ------------------------------------------------------------------------
# Functions

def stoi(x):
    if x is None or x == "NA" or x == '':
        return None

    return int(x)

def write_tsv(path, cols, rows, region):
    with open(path, 'w+') as fd:
        fd.write(get_header(region))
        wtr = csv.writer(fd, delimiter='\t')
        wtr.writerow(cols)
        wtr.writerows(rows)

def get_header(source):
    d = sources[source]
    return (f"# Data source: {d.get('primarySource','not specified')}\n"
            f"# Data provenance: {d.get('dataProvenance','not specified')}\n"
            f"# License: {d.get('license','not specified')}\n")

def flatten(cases):
    # Expects a dict of lists of dicts {'USA': [{'cases': 0, 'time': '2020-03-20'}, ..., ] }
    # Converts to list of lists [['USA', '2020-03-20', 0, ...]]
    rows = []
    for cntry, data in cases.items():
        for datum in data:
            row = [cntry]
            for c in default_cols:
                if c in datum:
                    row.append(datum[c])
                else:
                    row.append(None)
            rows.append(row)
    return rows

def parse_countries(index=1):
    # read the country_codes.csv for official country names
    # index=1 is the alpha2
    # index=2 is the alpha3
    country_names = {}
    file = os.path.join(BASE_PATH, "country_codes.csv")
    countries = defaultdict(lambda: defaultdict(list))
    with open(file) as f:
        rdr = csv.reader(f)
        next(rdr)
        for row in rdr:
            countries[row[index]] = row[0]
    return countries

def sorted_date(s, cols=None):
    # if you provide a list of  lists, you need to provide your cols vector
    if isinstance(s[0], list) and cols:
        return sorted(s, key=lambda d: datetime.strptime(d[cols.index('time')], "%Y-%m-%d"))
    elif isinstance(s[0], dict):
        return sorted(s, key=lambda d: datetime.strptime(d["time"], "%Y-%m-%d"))
    else:
        print('sorted_data: if you provide a list of lists, you need to provide your cols vector', file=sys.stderr)

def compare_day(day1, day2):
    try:
        time1 = datetime.strptime(day1['time'][:10], "%Y-%m-%d")
        time2 = datetime.strptime(day2['time'][:10], "%Y-%m-%d")
    except:
        print('Problems in parsing ', day1, day2)
    if time1 < time2:
        return -1
    elif time1 > time2:
        return 1
    else:
        return 0

def add_cases(cases, toAdd, target, cols=default_cols):
    """ Add daily counts of toAdd countries together, and aggregate in target country
    Keyword arguments:
    cases -- a dict of lists of lists {'USA': [['2020-03-20', 0, ...], ...]}. 
    toAdd -- a list of country strings of countries that should be added together
    target-- a string denoting the target country for the added data
    cols  -- list of column headers
    """

    # we expect to not have target in cases already
    if target in cases:
        print(f'Warning: add_cases called to overwrite values in {target}', sys.stderr)
    cases[target] = []
    for s in toAdd:        
        for e in cases[s]:
            time = e[cols.index('time')]
            new = True
            for d in cases[target]:
                # Check if we had data for this date already, if yes add if needed/possible
                if d[cols.index('time')] == time:
                    new = False
                    for i in range(1,len(d)):
                        d[i] += e[i]
            if new:
                # we did not have that date in the aggregate yet
                cases[target].append(e.copy())
    cases[target] = sorted_date(cases[target], cols)
    return cases
    
def merge_cases(oldcases, newcases):
    # We expect dicts of lists
    # {"Thailand": [{"time": "2020-1-22", "cases": "2", "deaths": "0", "recovered": "0"}, {"time": "2020-1-23", "cases": "3", "deaths": "0", "recovered": "0"}]}
    # If entries for country already in oldcases, only add new keys if present in newcases
    res = oldcases.copy()
    for c in newcases:
        if not c in res:
            res[c] = newcases[c]
        else:
            # join both lists and sort. Then, check for duplicates and merge them
            try:
                joinedDays = sorted(res[c]+newcases[c], key=functools.cmp_to_key(compare_day))
            except:
                print(f'problem with {c}:\nRes: {res[c]}\n\n {newcases[c]}')
            prevDay = joinedDays[0]
            for d in joinedDays[1:]:
                # fix dates here if required
                d['time'] = datetime.strptime(d['time'][:10], '%Y-%m-%d').strftime('%Y-%m-%d')
                prevDay['time'] = datetime.strptime(prevDay['time'][:10], '%Y-%m-%d').strftime('%Y-%m-%d')
                if d['time'] == prevDay['time']:
                    # merging will only add new keys (not replace old values), and remove the duplicate day afterwards
                    for k in d:
                        if (not k in prevDay) or (not prevDay[k]):
                            prevDay[k] = d[k]
                    joinedDays.remove(d)
                else:
                    prevDay = d
            res[c] = joinedDays
    return res

def store_tsv(regions, source, cols):
    dirname = f"{BASE_PATH}/{TSV_DIR}/{source}"
    if not os.path.isdir(dirname):
        os.mkdir(dirname)

    for region, data in regions.items():
        # region is API provided and should be sanitized before using it to construct paths for security reasons
        region = sanitize(region)
        write_tsv(f"{dirname}/{region}.tsv", cols, data, source)

def list_to_dict(regions, cols):
    # transform a a dict of lists of lists {'USA':[['2020-03-01', 1, 2,...],..]} into a dict of lists of dicts {'USA': [{'time': '2020-03-01', 'cases': 1, ...},...]}
    res = {}
    for k in regions:
        nk = []
        for d in regions[k]:
            i = 0
            nd = {}
            while (i < len(d)):
                # cols is likely ['time', 'cases', 'deaths', 'hospitalized', 'icu', 'recovered']
                if cols[i] == 'time':
                    nd[cols[i]] = d[i]
                elif d[i] is not None:
                    nd[cols[i]] = int(d[i])
                else:
                    nd[cols[i]] = None
                i += 1
            nk.append(nd)
        res[k] = nk
    return res

def dict_to_list(regions, cols):
    # transform a dict of lists of dicts {'USA': [{'time': '2020-03-01', 'cases': 1, ...},...]} into a dict of lists of lists {'USA':[['2020-03-01', 1, 2,...],..]}
    res = {}
    for k in regions:
        nk = []
        for d in regions[k]:
            nd = []
            for c in cols:
                if c in d:
                    nd.append(d[c])
                else:
                    nd.append(None)
            nk.append(nd)
        res[k] = nk
    return res

def remove_country_code(regions, code):
    # Assumes that the keys of this dict have a three letter country code prepended, and removes it.
    res = {}
    for k in regions:
        if code+'-' in k:
            k = k[4:]
    return res

def add_country_code(regions, exceptions, code):
    # Adds three letter code to keys of this dict
    res = {}
    for k in regions:
        if not k in exceptions:
           res['-'.join([code,k])] = regions[k]
        else:
            res[k] = regions[k]
    return res


def store_json(case_counts, json_file):
    """ Validate and store data to .json file
    Arguments:
    - case_counts: a dict of lists of dicts for case counts
    - json_file: name of file to store into
    """

    #convert dict of lists of dicts to list of dicts of lists of dicts
    newdata = []
    for k in case_counts:
        newdata.append({'country': k, 'empiricalData': case_counts[k]})

    with open(os.path.join(BASE_PATH, SCHEMA_CASECOUNTS), "r") as f:
        schema = yaml.load(f, Loader=yaml.FullLoader)
        validate(newdata, schema, format_checker=FormatChecker())

    with open(json_file, 'w') as fh:
        json.dump(newdata, fh)

def sanitize(fname):
    # we sanitize to ASCII alphabetic here
    #fname2 = re.sub('[^a-zA-Z ]+', '_', fname)
    # lets not discard possible UTF8 alphabetic, for now just removing .\/~
    fname2 = re.sub('[\\\\\/\~]+(\.\.)+', '_', fname)
    if not fname2==fname:
        print(f'Filename sanitized: was {fname}, now {fname2}')
    return fname2


def store_data(regions, source, cols=[]):
    """ Store data to .tsv and .json files
    Keyword arguments:
    regions -- a dict of lists of lists {'USA': [['2020-03-20', 0, ...], ...]}, or a dict of lists of dicts {'USA': [{'cases': 0, 'time': '2020-03-20'}, ... ] }. Keys of states need to include 3 letter country code from country_codes.tsv
    source --  the string identifyig the source in sources.json
    cols -- the colum headers that were used to prepare the innermost list
    """

    # check if we have a dict of list of list, or dict of list of dicts

    if isinstance(regions, dict):
        cd1 = list(regions.values())[0]
        if isinstance(cd1, list):
            cd2 = cd1[0]
            if isinstance(cd2, dict):
                store_tsv(dict_to_list(regions, default_cols), source, default_cols)
            elif isinstance(cd2, list):
                if not cols==[]:
                    store_tsv(regions, source, cols)
                else:
                    print(f'ERROR: You need to provide cols to store_data for the format you use. cols will indicate type of values in your inner lists. No data was stored to .tsv now!', file=sys.stderr)
                    exit(1)
            else:
                print(f'ERROR: unable to parse {regions}', file=sys.stderr)
        else:
            print(f'ERROR: unable to parse {regions}', file=sys.stderr)

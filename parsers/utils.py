import csv
import json
import functools
import os
import re
import sys
sys.path.append('..')
from paths import TMP_CASES, BASE_PATH, JSON_DIR, SOURCES_FILE

from datetime import datetime
from collections import defaultdict

# ------------------------------------------------------------------------
# Globals
with open(os.path.join(BASE_PATH, SOURCES_FILE)) as fh:
    sources = json.load(fh)

default_cols = ['time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']


# ------------------------------------------------------------------------
# Functions

def stoi(x):
    if x is None:
        return None
    if x == "":
        return 0

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
    # This is mostly required for World.tsv and similar
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

def merge_cases(oldcases, newcases):
    # We expect dicts of lists
    # {"Thailand": [{"time": "2020-1-22", "cases": "2", "deaths": "0", "recovered": "0"}, {"time": "2020-1-23", "cases": "3", "deaths": "0", "recovered": "0"}]}
    # If entries for country already in oldcases, only add new keys if present in newcases
    res = oldcases.copy()
    for c in newcases:
        if not c in res:
            res[c] = newcases[c]
        else:
            #print('Found old and new data for ',c)
            # join both lists and sort. Then, check for duplicates and merge them
            try:
                joinedDays = sorted(res[c]+newcases[c], key=functools.cmp_to_key(compare_day))
            except:
                print('problem with ',c,res[c], newcases[c])
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

def store_tsv(regions, exceptions, source, cols):
    for region, data in regions.items():
        # region is API provided and should be sanitized before using it to construct paths for security reasons
        region = sanitize(region)

        # If we only want to store one .tsv in the root, we signal this with exceptions['default': 'FOO.tsv']
        if  '.tsv' in exceptions['default']:
            # TODO this is actually creating the World.tsv n times at the moment (open(,'w='), not what we really want.)
            write_tsv(os.path.join(BASE_PATH, exceptions['default']), ['location']+cols, flatten(regions), source)
        # For normal .tsv storage in individual regions' tsv
        elif region not in exceptions:
            write_tsv(f"{BASE_PATH}/{exceptions['default']}/{region}.tsv", cols, data, source)
        else:
            write_tsv(f"{BASE_PATH}/{exceptions[region]}/{region}.tsv", cols, data, source)

def list_to_dict(regions, cols):
    # transform a a dict of lists of lists {'USA':[['2020-03-01', 1, 2,...],..]} into a dict of lists of dicts {'USA': [{'time': '2020-03-01', 'cases': 1, ...},...]}
    res = {}
    for k in regions:
        nk = []
        for d in regions[k]:
            i = 0
            nd = {}
            while (i < len(d)):
                # cols is likely ['time', 'cases', 'deaths', 'hospitalized', 'ICU', 'recovered']
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


def store_json(newdata):
    json_file = os.path.join(BASE_PATH,JSON_DIR, TMP_CASES)
    if os.path.isfile(json_file):
        with open(json_file, 'r') as fh:
            oldcases = json.load(fh)
    else:
        oldcases = {}

    mergedCases = merge_cases(oldcases, newdata)
    with open(json_file, 'w') as fh:
        json.dump(mergedCases, fh)

    #print('first layer keys are %s'%mergedCases.keys())
    print(f'Stored data for {len(mergedCases)} regions to {json_file}')

def sanitize(fname):
    # we sanitize to ASCII alphabetic here
    #fname2 = re.sub('[^a-zA-Z ]+', '_', fname)
    # lets not discard possible UTF8 alphabetic, for now just removing .\/~
    fname2 = re.sub('[\\\\\/\~]+(\.\.)+', '_', fname)
    if not fname2==fname:
        print(f'Filename sanitized: was {fname}, now {fname2}')
    return fname2


def store_data(regions, exceptions, source, code='', cols=[]):
    """ Store data to .tsv and .json files

    Keyword arguments:
    regions -- a dict of lists of lists {'USA': [['2020-03-20', 0, ...], ...]}, or a dict of lists of dicts {'USA': [{'cases': 0, 'time': '2020-03-20'}, ... ] }
    exceptions -- a dict that provides the path for .tsv files. Needs at least a {'default': LOC} entry. If region and total data is available, this typically looks like {'default': LOC, 'Spain': LOC}
    source --  the string identifyig the source in sources.json
    code -- the three letter code for the country from country_codes.csv
    cols -- the colum headers that were used to prepare the innermost list
    """

    # check if we have a dict of list of list, or dict of list of dicts

    if isinstance(regions, dict):
        cd1 = list(regions.values())[0]
        if isinstance(cd1, list):
            cd2 = cd1[0]
            if isinstance(cd2, list):
                store_tsv(regions, exceptions, source, cols)
                if not cols==[]:
                    regions2 = {}
                    for region, data in regions.items():
                        if not region in exceptions:
                            regions2[code+"-"+region] = data
                        else:
                            regions2[region] = data
                    store_json(list_to_dict(regions2, cols))
                else:
                    print(f'ERROR: You need to provide cols to store_data for the format you use. cols will indicate type of values in your inner lists. No data was stored to .tsv now!', file=sys.stderr)
                    return
            elif isinstance(cd2, dict):
                # catch the World.tsv case
                if not '.tsv' in exceptions['default']:
                    regions = dict_to_list(regions, default_cols)
                store_tsv(regions, exceptions, source, default_cols)
                # for non-World data we need to add country code for json
                if not '.tsv' in exceptions['default']:
                    regions = add_country_code(regions, exceptions, code)
                store_json(regions)

            else:
                print(f'ERROR: unable to parse {regions}', file=sys.stderr)
        else:
            print(f'ERROR: unable to parse {regions}', file=sys.stderr)

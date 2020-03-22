import csv
import json
import functools
import os
from datetime import datetime
from collections import defaultdict

# ------------------------------------------------------------------------
# Globals

with open("sources.json") as fh:
    sources = json.load(fh)

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
    rows = []
    for cntry, data in cases.items():
        for datum in data:
            rows.append([cntry, datum['time'], datum['cases'], datum['deaths'], None, None, None])

    return rows

def parse_countries(index=1):
    # read the country_codes.csv for official country names
    # index=1 is the alpha2
    # index=2 is the alpha3
    country_names = {}
    file = "country_codes.csv"
    countries = defaultdict(lambda: defaultdict(list))
    with open(file) as f:
        rdr = csv.reader(f)
        next(rdr)
        for row in rdr:
            countries[row[index]] = row[0]
    return countries

def sorted_date(s):
    return sorted(s, key=lambda d: datetime.strptime(d["time"], "%Y-%m-%d"))

def compare_day(day1, day2):
    try:
        time1 = datetime.strptime(day1['time'], "%Y-%m-%d")
        time2 = datetime.strptime(day2['time'], "%Y-%m-%d")
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
                d['time'] = datetime.strptime(d['time'], '%Y-%m-%d').strftime('%Y-%m-%d')
                prevDay['time'] = datetime.strptime(prevDay['time'], '%Y-%m-%d').strftime('%Y-%m-%d')
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

def list_to_dict(regions, cols):
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

def store_json(newdata):
    json_file = 'case-counts/case_counts.json'
    if os.path.isfile(json_file):
        with open(json_file, 'r') as fh:
            oldcases = json.load(fh)
    else:
        oldcases = {}

    mergedCases = merge_cases(oldcases, newdata)
    with open(json_file, 'w') as fh:
        json.dump(mergedCases, fh)

    #print('first layer keys are %s'%mergedCases.keys())
    print('Stored data for %d regions to json'%len(mergedCases))

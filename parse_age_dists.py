import sys
import re
import json
import argparse

from collections import defaultdict, Counter

# ---------------------------------------------------------
# Globals

UNdata = "data/UNdata_Export_20200229_174614791.csv"
Delta  = 10

# ---------------------------------------------------------
# Functions

def parse_table(rdr, rowkey="Country or Area"):
    hdr = [s.strip('"') for s in rdr.readline().strip().split(',')]
    I   = hdr.index(rowkey)
    tbl = defaultdict(list)
    hdr.pop(I)
    for line in rdr:
        if line == '\n' or '"footnoteSeqID"' in line:
            break
        elts = re.split(r',(?=")', line.strip('\n'))
        key  = elts.pop(I).strip('"')
        tbl[key].append({h:elt for h, elt in zip(hdr, elts)})

    return dict(tbl)

def compile_distribution(tbl):
    ages = {k:[] for k in tbl.keys()}
    bps  = list(range(Delta, 80+Delta, Delta))
    for cntry, data in tbl.items():
        # Need to deal with all possibe cases of age entries here
        num = Counter([d['Age'].strip('"') for d in data if d['Age'] != '"Total"'])

        if num["0 - 4"] > 0:
            # Multiple years can be present w/in data set. 
            # If so, choose the latest
            if num["0 - 4"] == 1:
                cnts = { d['Age'].strip('"') : int(float(d['Value'].strip('"'))) for d in data }
            else:
                # TODO: Check that all key/value pairs are represented twice...
                src_yr = max([ int(d['Source Year'].strip('"')) for d in data ])
                cnts = { d['Age'].strip('"') : int(float(d['Value'].strip('"'))) for d in data if int(d['Source Year'].strip('"')) == src_yr }

            ages[cntry] = [0 for _ in range(len(bps)+1)]

            a, i = 0, 0
            while a < 200:
                if i < len(bps) and a >= bps[i]:
                    i += 1

                if (s := f"{a} - {a+4}") in cnts:
                    ages[cntry][i] += cnts[s]
                    a += 5
                    continue
                elif (s := f"{a} +") in cnts:
                    ages[cntry][i] += cnts[s]
                break

        elif num["0"] == 1:
            cnts = { d['Age'].strip('"') : int(float(d['Value'].strip('"'))) for d in data }

            a, i = 0, 0
            ages[cntry] = [0 for _ in range(len(bps)+1)]
            while a < 200:
                if i < len(bps) and a >= bps[i]:
                    i += 1

                if str(a) in cnts:
                    ages[cntry][i] += cnts[str(a)]
                else:
                    # NOTE: Assumes age distribution in file is in 5 yr breaks
                    if (s := f"{a} - {a+4}") in cnts:
                        ages[cntry][i] += cnts[s]
                        a += 5
                        continue
                    elif (s := f"{a} +") in cnts:
                        ages[cntry][i] += cnts[s]
                    break

                a += 1
        else:
            print(f"Could not parse data for country '{cntry}'", file=sys.stderr)
            del ages[cntry]

    return ages, [0] + bps

def canonicalize(ages, bps):
    data = {}
    keys = [f"{b}-{bps[i+1]-1}" for i, b in enumerate(bps[:-1])] + [f"{bps[-1]}+"]
    for cntry, vals in ages.items():
        data[cntry] = {k:val for k, val in zip(keys, vals)}

    return data

def concatenate(*tbls):
    full_tbl = tbls[0]
    Ks = set(full_tbl.keys())
    for tbl in tbls[1:]:
        for new_cntry in set(tbl.keys()).difference(set(full_tbl.keys())):
            full_tbl[new_cntry] = tbl[new_cntry]

    return full_tbl

# ---------------------------------------------------------
# Main point of entry

parser = argparse.ArgumentParser(description="Convert UN age csv into our json format",
                                 usage='''parse_age_dists.py [<path>, ...]

    Outputs json formatted distribution to standard output.
    If more than one path is given, secondary csv files are concatenated to the first.
                                 ''')

parser.add_argument("files",
        metavar="[path(s) to file]",
        type=str,
        nargs='+',
        help="path to csv file with UN age distributions")

if __name__ == "__main__":
    args = parser.parse_args()
    tbls = []
    for path in sorted(args.files):
        print(f"Analyzing {path}", file=sys.stderr)
        if not path.endswith(".csv"):
            print(f"Input must be a csv formatted file. Recieved {path.split('.')[-1]}", file=sys.stderr)
            exit(1)

        tbls.append(parse_table(open(path)))

    tbl = concatenate(*tbls)
    print(f"Number of countries: {len(tbl)}", file=sys.stderr)
    data = canonicalize(*compile_distribution(tbl))
    json.dump(data, sys.stdout)

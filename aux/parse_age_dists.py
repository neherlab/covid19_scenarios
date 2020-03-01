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

    return ages, bps

# ---------------------------------------------------------
# Main point of entry

parser = argparse.ArgumentParser(description="Convert UN age csv into our json format",
                                 usage='''parse_age_dists.py <path>

    Outputs json formatted distribution to standard output.
                                 ''')

parser.add_argument("file", metavar="[path to file]", type=str, nargs=1, help="path to csv file with UN age distributions")

if __name__ == "__main__":
    args = parser.parse_args()
    path = args.file[0]
    if not path.endswith(".csv"):
        print(f"Input must be a csv formatted file. Recieved {path.split('.')[-1]}")
        exit(1)

    tbl  = parse_table(open(path))
    ages, bps = compile_distribution(tbl)

    data = {"country" : ages, "bins": [0] + bps}
    json.dump(data, sys.stdout)

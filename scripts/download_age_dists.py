from pandasdmx import Request

# ------------------------------------------------------------------------
# Globals

age_codes = {
        "Y_LT5" : "0-4",
        "Y5T10" : "5-9",
        "Y10T14": "10-14",
        "Y15T19": "15-19",
        "Y20T24": "20-24",
        "Y25T29": "25-29",
        "Y30T34": "30-34",
        "Y35T39": "35-39",
        "Y40T44": "40-44",
        "Y45T49": "45-49",
        "Y50T54": "50-54",
        "Y55T59": "55-59",
        "Y60T64": "60-64",
        "Y65T69": "65-69",
        "Y70T74": "70-74",
        "Y75T79": "75-79",
        "Y80T84": "80-84",
        "Y85T89": "85-89",
        "Y90T94": "90-94",
        "Y95T99": "95-99",
        "Y_GE100": "100+",
}

country_codes = {
  "012" : "Algeria",
  "434" : "Libya",
  "504" : "Morocco",
  "729" : "Sudan",
  "732" : "Western Sahara",
  "788" : "Tunisia",
  "818" : "Egypt",
  "132" : "Cabo Verde",
  "204" : "Benin",
  "270" : "Gambia",
  "288" : "Ghana",
  "324" : "Guinea",
  "384" : "Côte d’Ivoire",
  "430" : "Liberia",
  "466" : "Mali",
  "478" : "Mauritania",
  "562" : "Niger",
  "566" : "Nigeria",
  "624" : "Guinea-Bissau",
  "654" : "Saint Helena",
  "686" : "Senegal",
  "694" : "Sierra Leone",
  "768" : "Togo",
  "854" : "Burkina Faso",
  "108" : "Burundi",
  "174" : "Comoros",
  "175" : "Mayotte",
  "231" : "Ethiopia",
  "232" : "Eritrea",
  "262" : "Djibouti",
  "404" : "Kenya",
  "450" : "Madagascar",
  "454" : "Malawi",
  "480" : "Mauritius",
  "508" : "Mozambique",
  "638" : "Réunion",
  "646" : "Rwanda",
  "690" : "Seychelles",
  "706" : "Somalia",
  "716" : "Zimbabwe",
  "728" : "South Sudan",
  "800" : "Uganda",
  "834" : "United Republic of Tanzania",
  "894" : "Zambia",
  "024" : "Angola",
  "120" : "Cameroon",
  "140" : "Central African Republic",
  "148" : "Chad",
  "178" : "Congo",
  "180" : "Democratic Republic of the Congo",
  "226" : "Equatorial Guinea",
  "266" : "Gabon",
  "678" : "Sao Tome and Principe",
  "072" : "Botswana",
  "426" : "Lesotho",
  "516" : "Namibia",
  "710" : "South Africa",
  "748" : "Eswatini",
  "036" : "Australia",
  "554" : "New Zealand",
  "090" : "Solomon Islands",
  "242" : "Fiji",
  "540" : "New Caledonia",
  "548" : "Vanuatu",
  "598" : "Papua New Guinea",
  "296" : "Kiribati",
  "316" : "Guam",
  "520" : "Nauru",
  "580" : "Northern Mariana Islands",
  "583" : "Micronesia (Federated States of)",
  "584" : "Marshall Islands",
  "585" : "Palau",
  "016" : "American Samoa",
  "184" : "Cook Islands",
  "258" : "French Polynesia",
  "570" : "Niue",
  "772" : "Tokelau",
  "776" : "Tonga",
  "798" : "Tuvalu",
  "876" : "Wallis and Futuna Islands",
  "882" : "Samoa",
  "060" : "Bermuda",
  "124" : "Canada",
  "304" : "Greenland",
  "666" : "Saint Pierre and Miquelon",
  "840" : "United States of America",
  "156" : "China",
  "158" : "Taiwan Province of China",
  "344" : "China, Hong Kong Special Administrative Region",
  "392" : "Japan",
  "408" : "Democratic People's Republic of Korea",
  "410" : "Republic of Korea",
  "446" : "China, Macao Special Administrative Region",
  "496" : "Mongolia",
  "004" : "Afghanistan",
  "050" : "Bangladesh",
  "064" : "Bhutan",
  "144" : "Sri Lanka",
  "356" : "India",
  "364" : "Iran (Islamic Republic of)",
  "462" : "Maldives",
  "524" : "Nepal",
  "586" : "Pakistan",
  "096" : "Brunei Darussalam",
  "104" : "Myanmar",
  "116" : "Cambodia",
  "360" : "Indonesia",
  "418" : "Lao People's Democratic Republic",
  "458" : "Malaysia",
  "608" : "Philippines",
  "626" : "Timor-Leste",
  "702" : "Singapore",
  "704" : "Viet Nam",
  "764" : "Thailand",
  "398" : "Kazakhstan",
  "417" : "Kyrgyzstan",
  "762" : "Tajikistan",
  "795" : "Turkmenistan",
  "860" : "Uzbekistan",
  "031" : "Azerbaijan",
  "048" : "Bahrain",
  "051" : "Armenia",
  "196" : "Cyprus",
  "268" : "Georgia",
  "275" : "State of Palestine",
  "368" : "Iraq",
  "376" : "Israel",
  "400" : "Jordan",
  "414" : "Kuwait",
  "422" : "Lebanon",
  "512" : "Oman",
  "634" : "Qatar",
  "682" : "Saudi Arabia",
  "760" : "Syrian Arab Republic",
  "784" : "United Arab Emirates",
  "792" : "Turkey",
  "887" : "Yemen",
  "008" : "Albania",
  "020" : "Andorra",
  "070" : "Bosnia and Herzegovina",
  "191" : "Croatia",
  "292" : "Gibraltar",
  "300" : "Greece",
  "336" : "Holy See",
  "380" : "Italy",
  "470" : "Malta",
  "499" : "Montenegro",
  "620" : "Portugal",
  "674" : "San Marino",
  "688" : "Serbia",
  "705" : "Slovenia",
  "724" : "Spain",
  "807" : "The former Yugoslav Republic of Macedonia",
  "100" : "Bulgaria",
  "112" : "Belarus",
  "203" : "Czechia",
  "348" : "Hungary",
  "498" : "Republic of Moldova",
  "616" : "Poland",
  "642" : "Romania",
  "643" : "Russian Federation",
  "703" : "Slovakia",
  "804" : "Ukraine",
  "208" : "Denmark",
  "233" : "Estonia",
  "234" : "Faroe Islands",
  "246" : "Finland",
  "352" : "Iceland",
  "372" : "Ireland",
  "428" : "Latvia",
  "440" : "Lithuania",
  "578" : "Norway",
  "752" : "Sweden",
  "826" : "United Kingdom of Great Britain and Northern Ireland",
  "830" : "Channel Islands",
  "833" : "Isle of Man",
  "040" : "Austria",
  "056" : "Belgium",
  "250" : "France",
  "276" : "Germany",
  "438" : "Liechtenstein",
  "442" : "Luxembourg",
  "492" : "Monaco",
  "528" : "Netherlands",
  "756" : "Switzerland",
  "032" : "Argentina",
  "068" : "Bolivia (Plurinational State of)",
  "076" : "Brazil",
  "152" : "Chile",
  "170" : "Colombia",
  "218" : "Ecuador",
  "238" : "Falkland Islands (Malvinas)",
  "254" : "French Guiana",
  "328" : "Guyana",
  "600" : "Paraguay",
  "604" : "Peru",
  "740" : "Suriname",
  "858" : "Uruguay",
  "862" : "Venezuela (Bolivarian Republic of)",
  "084" : "Belize",
  "188" : "Costa Rica",
  "222" : "El Salvador",
  "320" : "Guatemala",
  "340" : "Honduras",
  "484" : "Mexico",
  "558" : "Nicaragua",
  "591" : "Panama",
  "028" : "Antigua and Barbuda",
  "044" : "Bahamas",
  "052" : "Barbados",
  "092" : "British Virgin Islands",
  "136" : "Cayman Islands",
  "192" : "Cuba",
  "212" : "Dominica",
  "214" : "Dominican Republic",
  "308" : "Grenada",
  "312" : "Guadeloupe",
  "332" : "Haiti",
  "388" : "Jamaica",
  "474" : "Martinique",
  "500" : "Montserrat",
  "531" : "Curaçao",
  "533" : "Aruba",
  "534" : "Sint Maarten (Dutch part)",
  "535" : "Bonaire, Sint Eustatius and Saba",
  "630" : "Puerto Rico",
  "659" : "Saint Kitts and Nevis",
  "660" : "Anguilla",
  "662" : "Saint Lucia",
  "670" : "Saint Vincent and the Grenadines",
  "780" : "Trinidad and Tobago",
  "796" : "Turks and Caicos Islands",
  "850" : "United States Virgin Islands"
}

agency   = "UNSD"
database = "DF_UNDATA_WPP"
dataset  = "SP_POP_TOTL"
sexes    = "_T"
t_beg    = "2020-01-01"
t_end    = "2020-01-02"
kind     = "M"

# ------------------------------------------------------------------------
# Functions

def get_data(*countries):
    req = Request(agency)
    key = { "INDICATOR" : dataset,
            "AGE" : list(age_codes.keys()),
            "SEX" : sexes,
            "REF_AREA" : "+".join(countries) }
            # "SCENARIO" : kind }
    times = {"startPeriod" : t_beg, "endPeriod" : t_end}
    req.timeout = 120

    qry = req.data(database, key=key, params=times)

    return qry

def accumulate(table):
    category = { f"{i}-{9+i}" : [f"{i}-{4+i}", f"{5+i}-{9+i}"] for i in range(0, 80, 10) }
    category["80+"] = ["80-84", "85-89", "90-94", "95-99", "100+"]

    def accum(db, key, cat):
        db[key] = 0
        for k in cat:
            db[key] += db.pop(k)

    for country in table.keys():
        for key, vals in category.items():
            accum(table[country], key, vals)

    return table

def to_table(data):
    table = {}
    for elt in data.iteritems():
        key, val = elt
        country  = country_codes[key[5]]
        agegroup = age_codes[key[2]]
        if country not in table:
            table[country] = {}
        table[country][agegroup] = int(1e3 * float(val))

    return accumulate(table)

# ------------------------------------------------------------------------
# Main point of entry

if __name__ == "__main__":
    table = {}
    ids   = list(country_codes.keys())
    bps   = list(range(0, len(country_codes), 10)) + [len(country_codes)]
    for i, bp in enumerate(bps[:-1]):
        d   = get_data(*ids[bp:bps[i+1]])
        tbl = to_table(d.write())
        print(tbl)
        table.update(tbl)

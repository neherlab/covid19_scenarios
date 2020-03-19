# COVID-19 Data
> Curated data of the SARS-COV2 pandemic

All formatted data used by [covid19_scenarios](https://github.com/neherlab/covid19_scenarios).

## Contents

### Country codes

List of countries associated to regions, subregions, and three letter codes supplied by the U.N.

### Population data

List of settings used by the default scenario by COVID-19 epidemic simulation for different regions of interest.

### Case count data
Within the directory ./case-counts is a structured set of tsv files containing aggregated data for select country and subregion/city.
We welcome contributions to keep this data up to date.
The format chosen is:

```
time    cases   deaths   hospitalized    ICU     recovered
2020-03-14 ...
```

We are actively looking for people to supply data to be used for our modeling!

## Contributing and curating data:

### Adding case count data for a new region:
  Steps:

 - Identify a source for case counts data that is updated frequently (at least daily) as outbreak evolves.
    * Write a script that downloads and converts raw data into TSV format
        - Columns: [time, cases, deaths, hospitalized, ICU, recovered]
        - The time column must be a string formatted as "YYYY-MM-DD"
        - Try to keep the same order of columns for hygiene, although it should ultimately matter
        - If data is missing, please leave the entry empty
    * Place the script into the parsers directory
        - The name should correspond to the region name desired in the scenario.
        - There *must* be a function parse() defined that outputs the TSV into the correct directory.
    * Commit the produced TSV file into the correct directory
        - The structure of the directory is Region/Sub-Region/Country/
        - Region and Sub-Region are designated as per the U.N. 
        - U.N. designations are found within country_codes.csv
        - Please use only the U.N. designated name for the country, region, and sub-region.
    * All TSV files will be bundled into a json database into the app on next build
        - The case counts should be displayed as data-points onto the associated scenario
 - Update the *sources.json* file to contain all relevant metadata.
    * The three fields are:
        - primarySource = The URL/path to the raw data
        - dataProvenance = The organization behind the data collection
        - license = The license governing the usage of data

### Updating/editing case count data for the existing region:
  We note that this option is not preferred relative to a script that automatically updates as outlined above.
  However, if there is no accessible data sources, one can manually enter the data. To do so

* Commit a manually entered TSV file into the correct directory
    - The structure of the directory is Region/Sub-Region/Country/
    - Region and Sub-Region are designated as per the U.N. 
    - U.N. designations are found within country_codes.csv
    - Please use only the U.N. designated name for the country, region, and sub-region.

### Adding/editing population data for a country and/or region:
  As of now all data used to initialize scenarios used by our model is found within populationData.tsv
  It has the following form:
    ```
    name    populationServed    ageDistribution hospitalBeds    ICUBeds suspectedCaseMarch1st   importsPerDay
    Switzerland ...
    ```
  - Names: the U.N. designated name found within country_codes.csv
      * For a sub-region/city, please prefix the name with the three letter country code of the containing country. See country_codes.csv for the correct letters.
  - populationServed: a number with the population size
  - ageDistribution: name of the country the region is within. Must be U.N. designated name
  - hospitalBeds: number of hospital beds within the region
  - ICUBeds: number of ICU beds
  - suspectedCaseMarch1st: The number of cases thought to be within the region on March 1st.
  - importsPerDay: number of suspected import cases per day

## License

[MIT License](LICENSE)

Copyright (c) 2020 neherlab

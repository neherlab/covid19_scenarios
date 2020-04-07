<h1 align="center">
  COVID-19 Scenarios Data
</h1>

<blockquote>
  <p align="center">
    Data preprocessing scripts and preprocessed data storage for
    <a href="https://github.com/neherlab/covid19_scenarios">COVID-19 Scenarios</a> project
  </p>
</blockquote>

<h1 align="center" />

<p align="center">
  <a href="https://github.com/neherlab/covid19_scenarios/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-mixed-yellow.svg" alt="License" />
  </a>

  <a href="https://github.com/neherlab/covid19_scenarios/commits">
    <img
      src="https://img.shields.io/github/commit-activity/m/neherlab/covid19_scenarios"
      alt="GitHub commit activity"
    />
  </a>

  <a href="https://github.com/neherlab/covid19_scenarios/graphs/contributors">
    <img
      src="https://img.shields.io/github/contributors/neherlab/covid19_scenarios?logo=github&label=data%20contributors"
      alt="GitHub contributors"
    />
  </a>

  <a href="https://github.com/neherlab/covid19_scenarios/commits">
    <img
      src="https://img.shields.io/github/last-commit/neherlab/covid19_scenarios?logo=github"
      alt="GitHub last commit"
    />
  </a>
</p>

<p align="center">
  <a href="https://twitter.com/richardneher">
    <img src="https://img.shields.io/twitter/follow/richardneher?style=social" alt="Twitter Follow" />
  </a>
</p>

<h2 align="center">
Got questions or suggestions?
</h2>

<h2 align="center">
Discover
</h2>

<p align="center" width="99%">
<table width="100%">

<thead>
<tr>
<th>    </th>
<th>Simulator</th>
<th>Source code repository</th>
<th>Data directory</th>
<th>Updates</th>
<th>    </th>
</tr>
</thead>

<tbody>

<tr>

<td></td>

<td>
<a alt="Link to the app" href="https://neherlab.org/covid19/">
<img
  alt="Image with app logo and text 'Try'"
  src="https://user-images.githubusercontent.com/9403403/77235707-6ae88800-6bb8-11ea-90ff-22db107b6045.png"
/>
</a>
</td>

<td>
<a alt="Link to the main repo" href="https://github.com/neherlab/covid19_scenarios">
<img
  alt="Image with GitHub logo and text 'Get Involved'"
  src="https://user-images.githubusercontent.com/9403403/77235706-6a4ff180-6bb8-11ea-8390-99b100d8035c.png"
/>
</a>
</td>

<td>
<a alt="Link to the data repo" href="https://github.com/neherlab/covid19_scenarios/tree/master/data">
<img
  alt="Image with GitHub logo and text 'Add Data'"
  src="https://user-images.githubusercontent.com/9403403/77235705-69b75b00-6bb8-11ea-8b21-f4aaf0ec60e7.png"
/>
</a>
</td>

<td>
<a alt="Link to Twitter" href="https://twitter.com/richardneher">
<img
  alt="Image with Twitter logo and text 'Follow'"
  src="https://user-images.githubusercontent.com/9403403/77235708-6b811e80-6bb8-11ea-80db-ecbc2185fb8b.png"
/>
</a>
</td>

<td></td>

</tr>

</tbody>

</table>
</p>

## Overview

This directory serves as the source of observational data for [covid19_scenarios](https://neherlab.org/covid19/). It
ingests data from a variety of sources listed in [sources.json](sources.json). For each source there is a parser written
in python in the directory `parsers`. The data is stored as `tsv` files (tab separated values) for each location or
country. These tabular files are mainly meant to enable data curation and storage, while the web application needs json
files as input.

To run the parsers, call

```shell
python generate_data.py --fetch
```

This will update the tables in the directory `case-counts`. For each parser there is a separate directory which contains
individual case counts for each location covered by the parser.

To only run specific parsers, run

```shell
python generate_data.py --fetch --parsers netherlands switzerland
```

To generate jsons for the app, specific the path the location of the target. This can either be done in combination with
updating the `tsv` files or separately depending on whether the command is run with `--fetch` or not.

```shell
python generate_data.py \
        --output-cases path/case-counts.json  \
        --output-population path/population.json
```

To generate the integrated scenario json, run

```shell
python generate_data.py \
        --output-cases path/case-counts.json  \
        --output-scenarios path/scenarios.json
```

## Contents

### Country codes

List of countries associated to regions, subregions, and three letter codes supplied by the U.N.

### Population data

List of settings used by the default scenario by COVID-19 epidemic simulation for different regions of interest.

### Case count data

Within the directory `./case-counts` is a structured set of tsv files containing aggregated data for select country and
subregion/city. We welcome contributions to keep this data up to date. The format chosen is:

```
time    cases   deaths   hospitalized    ICU     recovered
2020-03-14 ...
```

We are actively looking for people to supply data to be used for our modeling!

## Contributing and curating data:

### Adding parser or case count data for a new region:

The steps to follow are:

##### Identify a source for case counts data that is updated frequently (at least daily) as outbreak evolves.

- Write a script that downloads and converts raw data into a dict of lists of lists {'<country>': [['2020-03-20', 1, 0,
  ...], ['2020-03-21', 2, 0, ...]]}
  - Columns: [time, cases, deaths, hospitalized, ICU, recovered]
 - **Important:** cases, deaths, and recovered have to be cumulative counts. The fields hospitalized and ICU should refer to current number of patients.
   - The time column **must** be a string formatted as `YYYY-MM-DD`
  - Try to keep the same order of columns for hygiene, although it should not ultimately matter
  - If data is missing, please leave the entry empty (i.e., ['2020-03-20',1, None, None, ...])
  - Use the store_data() function in utils to store the data into .tsv automatically
- Ensure that the data provided to store_data() is well formatted
  - The keys in the datastructure provided to utils should be
    - For countries: U.N. country names (see country_codes.csv), or
    - For states within countries: <TLC>-<state>, where <TLC> is the three letter code for the country (see country_codes.csv), and <state> is the state name
  - The second parameter is the string identifying your parser (see sources.json entry below)
- Place the script into the parsers directory
  - The name should correspond to the region name desired in the scenario.
  - There **must** be a function parse() defined that calls store_data() from utils

##### Update the _sources.json_ file to contain all relevant metadata.

- The three fields are:
  - primarySource = The URL/path to the raw data
  - dataProvenance = The organization behind the data collection
  - license = The license governing the usage of data

##### Test your parser and create a Pull Request

- Create the appropriate directory in case-counts/
- Test your parser from the directory above (outside your covid19_scenario_data folder) using

```shell
python generate_data.py --fetch --parsers <yourparsername>
```

- Check the resulting output in case-counts/<yourparsername>/, and add the files to your Pull Request together with the
  parser and sources.json

##### Add populations data for the additional regions/states.

Case count data is most useful when tied to data on the population it refers to. To ensure new case counts are correctly
included in the population presets, add a line to the `populationData.tsv` for each new region (see
[Adding/editing population data for a country and/or region](#adding/editing-population-data-for-a-country-and/or-region)
below).

### Updating/editing case count data for the existing region:

We note that this option is not preferred relative to a script that automatically updates as outlined above. However, if
there is no accessible data sources, one can manually enter the data. To do so

##### Commit a manually entered file into the "manuals" directory

- Please use only the U.N. designated name for the country, the file name should be <country>.tsv.

### Adding/editing population data for a country and/or region:

As of now all data used to initialize scenarios used by our model is found within populationData.tsv It has the
following form:

    name    populationServed    ageDistribution hospitalBeds    ICUBeds    hemisphere     srcPopulation    srcHospitalBeds    srcICUBeds
    Switzerland ...

- Names: the U.N. designated name found within country_codes.csv
  - For a sub-region/city, please prefix the name with the three letter country code of the containing country. See
    country_codes.csv for the correct letters.
- populationServed: a number with the population size
- ageDistribution: name of the country the region is within. Must be U.N. designated name
- hospitalBeds: number of hospital beds within the region
- ICUBeds: number of ICU beds
- hemisphere: either 'Northern', 'Southern', or 'Tropical', used to determine parameters for the epidemiology
- srcPopulation: string commenting on the source of population data. Ideally a URL or reference to official source. Alternatively, comment on how data was estimated. Must not be empty
- srcHospitalBeds: string commenting on the source of hospital bed data. Ideally a URL or reference to official source. Alternatively, comment on how data was estimated. Must not be empty
- srcICUBeds: string commenting on the source of ICU bed data. Ideally a URL or reference to official source. Alternatively, comment on how data was estimated. Must not be empty

## Quick Start

#### Run natively

Install the requirements:

- pipenv

Then type in your terminal `pipenv install` This should recreate the required python environment To enter the
environment, type `pipenv shell`

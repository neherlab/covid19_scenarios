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
  <a href="https://github.com/neherlab/covid19_scenarios_data/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-mixed-yellow.svg" alt="License" />
  </a>

  <a href="https://github.com/neherlab/covid19_scenarios_data/commits">
    <img
      src="https://img.shields.io/github/commit-activity/m/neherlab/covid19_scenarios_data"
      alt="GitHub commit activity"
    />
  </a>

  <a href="https://github.com/neherlab/covid19_scenarios_data/graphs/contributors">
    <img
      src="https://img.shields.io/github/contributors/neherlab/covid19_scenarios_data?logo=github&label=data%20contributors"
      alt="GitHub contributors"
    />
  </a>

  <a href="https://github.com/neherlab/covid19_scenarios_data/commits">
    <img
      src="https://img.shields.io/github/last-commit/neherlab/covid19_scenarios_data?logo=github"
      alt="GitHub last commit"
    />
  </a>
</p>

<p align="center">
  <a href="https://spectrum.chat/covid19-scenarios/general/questions-discussions~8d49f461-a890-4beb-84f7-2d6ed0ae503a">
    <img alt="Join the community on Spectrum" src="https://withspectrum.github.io/badge/badge.svg" />
  </a>
  <a href="https://github.com/neherlab/covid19_scenarios_data/issues">
    <img src="https://img.shields.io/badge/contributions-are%20welcome-%234295f5.svg" alt="Contributions: welcome" />
  </a>
  <a href="https://github.com/neherlab/covid19_scenarios/issues/18">
    <img
      src="https://img.shields.io/badge/questions%20and%20discussions-in%20issue%20%2318-%235bd9b1.svg"
      alt="Discuss: in issue 18"
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

<p align="center">
  <a
    alt="Link to join the chat"
    href="https://spectrum.chat/covid19-scenarios/general/questions-discussions~8d49f461-a890-4beb-84f7-2d6ed0ae503a"
  >
    <img
      alt="Image for the link to join the chat"
      src="https://user-images.githubusercontent.com/9403403/77235704-691ec480-6bb8-11ea-985d-82ec87cfdcdf.png"
    />
  </a>
</p>

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
<th>Data repository</th>
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
  alt="Image with GutHub logo and text 'Get Involved'"
  src="https://user-images.githubusercontent.com/9403403/77235706-6a4ff180-6bb8-11ea-8390-99b100d8035c.png" 
/>
</a>
</td>

<td>
<a alt="Link to the data repo" href="https://github.com/neherlab/covid19_scenarios_data">
<img 
  alt="Image with GutHub logo and text 'Add Data'"
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



## Contents

### Country codes

List of countries associated to regions, subregions, and three letter codes supplied by the U.N.

### Population data

List of settings used by the default scenario by COVID-19 epidemic simulation for different regions of interest.

### Case count data
Within the directory `./case-counts` is a structured set of tsv files containing aggregated data for select country and subregion/city.
We welcome contributions to keep this data up to date.
The format chosen is:

```
time    cases   deaths   hospitalized    ICU     recovered
2020-03-14 ...
```

We are actively looking for people to supply data to be used for our modeling!

## Contributing and curating data:

### Adding case count data for a new region:
The steps to follow are:

##### Identify a source for case counts data that is updated frequently (at least daily) as outbreak evolves.
  * Write a script that downloads and converts raw data into TSV format
      - Columns: [time, cases, deaths, hospitalized, ICU, recovered]
      - **Important:** all columns must be cumulative data.
      - The time column **must** be a string formatted as ``YYYY-MM-DD``
      - Try to keep the same order of columns for hygiene, although it should not ultimately matter
      - If data is missing, please leave the entry empty
  * Place the script into the parsers directory
      - The name should correspond to the region name desired in the scenario.
      - There **must** be a function parse() defined that outputs the TSV into the correct directory.
  * Commit the produced ``.tsv`` file into the correct directory
      - The structure of the directory is Region/Sub-Region/Country/
      - Region and Sub-Region are designated as per the U.N.
      - U.N. designations are found within country_codes.csv
      - Please use only the U.N. designated name for the country, region, and sub-region.
  * All TSV files will be bundled into a json database into the app on next build
      - The case counts should be displayed as data-points onto the associated scenario
##### Update the *sources.json* file to contain all relevant metadata.
  * The three fields are:
      - primarySource = The URL/path to the raw data
      - dataProvenance = The organization behind the data collection
      - license = The license governing the usage of data

### Updating/editing case count data for the existing region:
  We note that this option is not preferred relative to a script that automatically updates as outlined above.
  However, if there is no accessible data sources, one can manually enter the data. To do so

##### Commit a manually entered file into the correct directory
 - The structure of the directory is Region/Sub-Region/Country/
 - Region and Sub-Region are designated as per the U.N.
 - U.N. designations are found within country_codes.csv
 - Please use only the U.N. designated name for the country, region, and sub-region.

### Adding/editing population data for a country and/or region:
  As of now all data used to initialize scenarios used by our model is found within populationData.tsv
  It has the following form:

    name    populationServed    ageDistribution hospitalBeds    ICUBeds suspectedCaseMarch1st   importsPerDay
    Switzerland ...

  - Names: the U.N. designated name found within country_codes.csv
      * For a sub-region/city, please prefix the name with the three letter country code of the containing country. See country_codes.csv for the correct letters.
  - populationServed: a number with the population size
  - ageDistribution: name of the country the region is within. Must be U.N. designated name
  - hospitalBeds: number of hospital beds within the region
  - ICUBeds: number of ICU beds
  - suspectedCaseMarch1st: The number of cases thought to be within the region on March 1st.
  - importsPerDay: number of suspected import cases per day

## License

[Mixed](LICENSE)

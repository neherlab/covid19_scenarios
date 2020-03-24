<h1 align="center">
  COVID-19 Scenarios
</h1>


<p align="center">
  <a href="https://neherlab.org/covid19/">
    <img
      width="100%"
      height="auto"
      src="https://user-images.githubusercontent.com/9403403/77125848-710b2700-6a47-11ea-84c3-19016d16e9dd.gif"
      alt="An animated screenshot of the application, showcasing the user interface on main page"
    />
  </a>
</p>

<p align="center">
  <a href="https://neherlab.org/covid19/">
    🌐 neherlab.org/covid19/
  </a>
</p>



<h1 align="center" />

<p align="center">
  <a href="https://github.com/neherlab/covid19_scenarios/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/neherlab/covid19_scenarios" alt="License" />
  </a>

  <a href="https://github.com/neherlab/covid19_scenarios/blob/master/package.json">
    <img
      src="https://img.shields.io/github/package-json/v/neherlab/covid19_scenarios?logo=npm"
      alt="package.json version"
    />
  </a>
  <a href="https://neherlab.org/covid19/">
    <img src="https://img.shields.io/website?url=https%3A%2F%2Fneherlab.org/covid19/&logo=circle&logoColor=white" />
  </a>
</p>

<p align="center">
  <a href="https://david-dm.org/neherlab/covid19_scenarios">
    <img src="https://david-dm.org/neherlab/covid19_scenarios.svg" alt="Dependency Status" />
  </a>

  <a href="https://david-dm.org/neherlab/covid19_scenarios?type=dev">
    <img src="https://david-dm.org/neherlab/covid19_scenarios/dev-status.svg" alt="Dependency Status Dev" />
  </a>

  <a href="https://github.com/neherlab/covid19_scenarios/commits">
    <img
      src="https://img.shields.io/github/last-commit/neherlab/covid19_scenarios?logo=github"
      alt="GitHub last commit"
    />
  </a>

  <a href="https://github.com/neherlab/covid19_scenarios/commits">
    <img
      src="https://img.shields.io/github/commit-activity/m/neherlab/covid19_scenarios"
      alt="GitHub commit activity"
    />
  </a>

  <a href="https://github.com/neherlab/covid19_scenarios/graphs/contributors">
    <img
      src="https://img.shields.io/github/contributors/neherlab/covid19_scenarios?logo=github&label=developers"
      alt="GitHub contributors"
    />
  </a>
</p>

<p align="center">
  <a href="https://spectrum.chat/covid19-scenarios/general/questions-discussions~8d49f461-a890-4beb-84f7-2d6ed0ae503a">
    <img alt="Join the community on Spectrum" src="https://withspectrum.github.io/badge/badge.svg" />
  </a>
  <a href="https://github.com/neherlab/covid19_scenarios/issues">
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
    href="https://spectrum.chat/covid19-scenarios"
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

### Overview

This tool is based on an SIR model (see about page for details) that simulates a COVID19 outbreak. The population is
initially mostly susceptible (other than for initial cases). Individuals that recover from COVID19 are subsequently
immune. Currently, the parameters of the model are _not_ fit to data but are simply defaults. These might fit better for
some localities than others. In particular the initial cases counts are often only rough estimates.

The primary purpose of the tool is to explore the dynamics of COVID19 cases and the associated strain on the health care
system in the near future. The outbreak is influenced by infection control measures such as school closures, lock-down
etc. The effect of such measures can be included in the simulation by adjusting the mitigation parameters. Analogously,
you can explore the effect of isolation on specific age groups in the column "Isolated" in the table on severity
assumptions and age specific isolation.

### Parameters

Parameters fall into three different categories

- population parameters
- epidemiological parameters
- clinical parameters

Most parameters can be adjusted in the tool and for many of them we provide presets.

Input data for the tool and the basic parameters of the populations are collected in a separate repository
[neherlab/covid19_scenarios_data](https://github.com/neherlab/covid19_scenarios_data). Please add data on populations
and parsers of publicly available case count data there.

### User Guide 

The online application provides a friendly user interface with drop downs to choose model parameters, run the model, and export results in CSV format. A detailed process is below. 

#### Population Parameters 

Select the population drop down and select a country/region to auto-populate the model's parameters with respective UN population data. These parameters can be indivdually updated manually if necessary. 

#### Epidemiology Parameters 

The preset epidemiology parameters are a combination of speed and region - specifying growth rate, seasonal variation, and duration of hospital stay. To choose a preset distribution, select one of the options from the epidemiology drop down to auto-populate the model's parameters with the selected parameters. 

#### Mitigation Parameters 

Mitigation parameters represent the reduction of transmission through mitigation measures over time. To select a preset, click on the mitigation dropdown and select one of the options. Otherwise, the points on the graph can be dragged and moved with the mouse. The parameter ranges from one (no infection control) to zero (complete prevention of all transmission).

#### Running the Model

Once the correct parameters are inputted, select the run button located in the Results section of the application. The model output will be displayed in 2 graphs: Cases through time and Distribution across groups and 2 tables: Populations and Totals/Peak.

#### Exporting Results

The model's results can be exported in CSV format by clicking the "export" button in the right hand corner. 


### Development

#### Code Stack

TODO

#### Code Examples

TODO

#### Install requirements

- Node >= 10
- Yarn 1.x

#### Run

This will run the application in development mode (with hot reloading):

```bash
git clone https://github.com/neherlab/covid19_scenarios
cd covid19_scenarios/
cp .env.example .env
yarn install
yarn dev
```

This will trigger the development server and build process. Wait for the build to finish, then navigate to
`http://localhost:3000` in a browser (last 5 version of Chrome or Firefox are supported in dev mode)

Hit Ctrl+C in the terminal to shutdown.

> ℹ️ Hint: type "rs<Enter>" in terminal to restart the build

### Production build

TODO

### Release Build

TODO

### Continuous integration and deployment

TODO

### License

[MIT License](LICENSE)

Copyright (c) 2020 neherlab

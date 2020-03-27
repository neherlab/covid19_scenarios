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

#### Install Requirements 

- Node >= 10
- Yarn 1.x

#### Quick Start 

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
  
#### Architecture

TODO

#### Directory Structure 

As a developer you are most likely interested in the actual source code in src/. The structure of /src is shown below. 

| File or directory |  Contents                                                                          |
| ----------------- | --------------------------------------------------------------------------------- |
| 📁__mocks__/      |                                                     |
| 📁algorithims/    |  Contains the algorithm implementation code |
| ├📁test-data/           |  Contains algorithm test data                                             |
| ├📁test/           |                                                  |
| ├📁utils/           |                                                |
| ├📄model.ts/           | Model implementation                                              |
| ├📄run.ts/           |                                         |
| 📁assets/       |       Contains model data, application image, and text files     |
| 📁components/         |   Application React components           |
| ├📁Form/           |                                                |
| ├📁LanguageSwitcher/           |                                                 |
| ├📁Layout/           |                                               |
| ├📁Links/           |                                                 |
| ├📁Main/           |                                                 |
| ├├📁Compare/           |                                                 |
| ├├📁Containment/           |                                                 |
| ├├📁Results/           |                                                 |
| ├├📁Scenario/           |                                                 |
| ├├📁state/           |                                                |
| ├├📁validation/           |                                                |
| ├├📄Disclaimer.tsx/           |                                               |
| ├├📄Main.scss/           |                                                 |
| ├├📄Main.tsx/           |   Main react component                                              |
| ├📁PageSwitcher/           |                                                 |
| ├📁Router/           |                                                 |
| ├📄App.tsx/           |                                                 |
| 📁helpers/           |                                                             |
| 📁locales/       |                                                         |
| 📁pages/       |         Application website page implementations                                                     |
| 📁server/       |         Server that serves production build artifacts                 |                                
| 📁state/       |                                                              |
| 📁styles/       |         CSS style files                                                      |
| 📁types/       |                                                          |
| 📄i8n.ts         |                            |
| 📄index.ejs   |                                                    |
| 📄index.polyfilled.ts   |  Entry point                          |
| 📄index.tsx     |                                                                    |
| 📄langs.ts     |                                                                        |
| 📄links.ts     |                                                                            |
| 📄routes.ts     |                                                                         |


### Production build

TODO

### Release Build

TODO

### Continuous integration and deployment

TODO


### Getting Started 

For new contributers, follow the guide below to learn how to fork & clone, install required software, and submit changes using a pull request.   

#### 🍴 Forking the Repo 
Click the Fork button on the upper right-hand side of the repository’s page.

#### 👯 Clone Forked Repository 
Clone this repo to your local machine using https://github.com/neherlab/covid19_scenarios.git

#### ✨ Installing Required Software
1. Node.js can be installed using nvm on [Mac/Linux](https://gist.github.com/d2s/372b5943bce17b964a79) and nvm-windows on [Windows](https://docs.microsoft.com/en-us/windows/nodejs/setup-on-windows).
2. Yarn can be globally installed following [these steps](https://classic.yarnpkg.com/en/docs/install/#mac-stable)

#### 🔨 Start coding! 

#### 💻 Updating the Forked Repository
To ensure that the forked code stays updated,  you’ll need to add a Git remote pointing back to the original repository and create a local branch. 

``` 
git remote add upstream https://github.com/openvswitch/openvswitch.github.io.git
```

To create and checkout a branch, 
  1. Create and checkout a branch
  ```
  git checkout -b <new branch name>
  ```
  2. Make changes to the files
  3. Commit your changes to the branch using ```git add``` and then ```git commit```

#### 💪 Submitting changes using a Pull Request 

To submit your code to the repository, you can [submit a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## Acknowledgements

### Initial development

Initially, the development was started in the [Research group of Richard Neher](https://neherlab.org) at the
[Biozentrum, University of Basel](https://www.biozentrum.unibas.ch/home/) (Basel, Switzerland) by Richard Neher
([@rneher](https://github.com/rneher)), Ivan Aksamentov ([@ivan-aksamentov](https://github.com/ivan-aksamentov)) and
Nicholas Noll ([@nnoll](https://github.com/nnoll)).

[Jan Albert](https://ki.se/en/mtc/jan-albert-group) from [Karolinska Institute](https://ki.se/en) (Stockholm, Sweden)
had the initial idea to develop this tool and suggested features and parameters, and
[Robert Dyrdak](https://staff.ki.se/people/robdyr) provided initial parameter estimates.

<table>
<tr>
<td align="center">
<a href="https://neherlab.org/">
<img src="https://avatars3.githubusercontent.com/u/8379168?v=4" width="100px;" alt="" />
<br />
<sub><b>Richard Neher</b></sub>
<br />
<sub><a href="https://github.com/rneher">@rneher</a></sub>
</a>
</td>

<td align="center">
<a href="https://github.com/ivan-aksamentov">
<img src="https://avatars0.githubusercontent.com/u/9403403?v=4" width="100px;" alt="" />
<br />
<sub><b>Ivan Aksamentov</b></sub>
<br />
<sub><a href="https://github.com/ivan-aksamentov">@ivan-aksamentov</a></sub>
</a>
</td>

<td align="center">
<a href="https://neherlab.org/nicholas-noll.html">
<img src="https://avatars3.githubusercontent.com/u/29447707?v=4" width="100px;" alt="" />
<br />
<sub><b>Nicholas Noll</b></sub>
<br />
<sub><a href="https://github.com/nnoll">@nnoll</a></sub>
</a>
</td>

<td align="center">
<a href="https://ki.se/en/mtc/jan-albert-group">
<img src="https://user-images.githubusercontent.com/9403403/77488039-5ca6a000-6e34-11ea-999a-9a1d1783e3da.jpg" width="100px;" alt="" />
<br />
<sub><b>Jan Albert</b></sub>
<br />
<sub><a href=""> </a></sub>
</a>
</td>

<td align="center">
<a href="https://staff.ki.se/people/robdyr">
<img src="https://user-images.githubusercontent.com/9403403/77488041-5dd7cd00-6e34-11ea-996c-1482ee0cc669.jpg" width="100px;" alt="" />
<br />
<sub><b>Robert Dyrdak</b></sub>
<br />
<sub><a href=""> </a></sub>
</a>
</td>

</tr>
</table>

### Contributors ✨

We are thankful to all our contributors, no matter how they contribute: in ideas, science, code, documentation or
otherwise. Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://neherlab.org"><img src="https://avatars3.githubusercontent.com/u/8379168?v=4" width="100px;" alt=""/><br /><sub><b>Richard Neher</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=rneher" title="Code">💻</a> <a href="https://github.com/neherlab/covid19_scenarios/commits?author=rneher" title="Documentation">📖</a> <a href="#data-rneher" title="Data">🔣</a> <a href="#maintenance-rneher" title="Maintenance">🚧</a> <a href="#security-rneher" title="Security">🛡️</a> <a href="https://github.com/neherlab/covid19_scenarios/pulls?q=is%3Apr+reviewed-by%3Arneher" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/ivan-aksamentov"><img src="https://avatars0.githubusercontent.com/u/9403403?v=4" width="100px;" alt=""/><br /><sub><b>Ivan Aksamentov</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=ivan-aksamentov" title="Code">💻</a> <a href="https://github.com/neherlab/covid19_scenarios/commits?author=ivan-aksamentov" title="Documentation">📖</a> <a href="#infra-ivan-aksamentov" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-ivan-aksamentov" title="Maintenance">🚧</a> <a href="#question-ivan-aksamentov" title="Answering Questions">💬</a> <a href="https://github.com/neherlab/covid19_scenarios/pulls?q=is%3Apr+reviewed-by%3Aivan-aksamentov" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/nnoll"><img src="https://avatars3.githubusercontent.com/u/29447707?v=4" width="100px;" alt=""/><br /><sub><b>Nicholas Noll</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=nnoll" title="Code">💻</a> <a href="https://github.com/neherlab/covid19_scenarios/commits?author=nnoll" title="Documentation">📖</a> <a href="#data-nnoll" title="Data">🔣</a> <a href="#maintenance-nnoll" title="Maintenance">🚧</a> <a href="https://github.com/neherlab/covid19_scenarios/pulls?q=is%3Apr+reviewed-by%3Annoll" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/gj262"><img src="https://avatars0.githubusercontent.com/u/6854428?v=4" width="100px;" alt=""/><br /><sub><b>Gavin Jefferies</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=gj262" title="Code">💻</a> <a href="https://github.com/neherlab/covid19_scenarios/commits?author=gj262" title="Documentation">📖</a> <a href="#data-gj262" title="Data">🔣</a> <a href="https://github.com/neherlab/covid19_scenarios/commits?author=gj262" title="Tests">⚠️</a> <a href="https://github.com/neherlab/covid19_scenarios/pulls?q=is%3Apr+reviewed-by%3Agj262" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/abrie"><img src="https://avatars3.githubusercontent.com/u/1462268?v=4" width="100px;" alt=""/><br /><sub><b>abrie</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=abrie" title="Code">💻</a> <a href="https://github.com/neherlab/covid19_scenarios/commits?author=abrie" title="Documentation">📖</a> <a href="https://github.com/neherlab/covid19_scenarios/commits?author=abrie" title="Tests">⚠️</a> <a href="https://github.com/neherlab/covid19_scenarios/pulls?q=is%3Apr+reviewed-by%3Aabrie" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/btoo"><img src="https://avatars3.githubusercontent.com/u/8883465?v=4" width="100px;" alt=""/><br /><sub><b>btoo</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=btoo" title="Code">💻</a> <a href="https://github.com/neherlab/covid19_scenarios/commits?author=btoo" title="Documentation">📖</a> <a href="#maintenance-btoo" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/rcbevans"><img src="https://avatars0.githubusercontent.com/u/2041260?v=4" width="100px;" alt=""/><br /><sub><b>Rich Evans</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=rcbevans" title="Code">💻</a> <a href="https://github.com/neherlab/covid19_scenarios/commits?author=rcbevans" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://jacobsmith.me"><img src="https://avatars3.githubusercontent.com/u/18077531?v=4" width="100px;" alt=""/><br /><sub><b>Jacob Smith</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=jsmith" title="Code">💻</a> <a href="#question-jsmith" title="Answering Questions">💬</a> <a href="https://github.com/neherlab/covid19_scenarios/pulls?q=is%3Apr+reviewed-by%3Ajsmith" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="http://patrikvarga.blogspot.com"><img src="https://avatars0.githubusercontent.com/u/2910243?v=4" width="100px;" alt=""/><br /><sub><b>Patrik Varga</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=patrikvarga" title="Code">💻</a> <a href="#maintenance-patrikvarga" title="Maintenance">🚧</a> <a href="#question-patrikvarga" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://www.xima.de"><img src="https://avatars1.githubusercontent.com/u/7585164?v=4" width="100px;" alt=""/><br /><sub><b>Sebastian Gierth</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=FireLizard" title="Code">💻</a> <a href="#question-FireLizard" title="Answering Questions">💬</a> <a href="https://github.com/neherlab/covid19_scenarios/pulls?q=is%3Apr+reviewed-by%3AFireLizard" title="Reviewed Pull Requests">👀</a> <a href="#translation-FireLizard" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/ax42"><img src="https://avatars0.githubusercontent.com/u/1254869?v=4" width="100px;" alt=""/><br /><sub><b>Alexis Iglauer</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=ax42" title="Code">💻</a> <a href="#data-ax42" title="Data">🔣</a> <a href="#maintenance-ax42" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/Joluma"><img src="https://avatars0.githubusercontent.com/u/6505742?v=4" width="100px;" alt=""/><br /><sub><b>Joël</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=Joluma" title="Code">💻</a> <a href="#question-Joluma" title="Answering Questions">💬</a> <a href="#maintenance-Joluma" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://medium.com/@adostes"><img src="https://avatars1.githubusercontent.com/u/7407917?v=4" width="100px;" alt=""/><br /><sub><b>Arnaud</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=arnaudNYC" title="Code">💻</a> <a href="https://github.com/neherlab/covid19_scenarios/pulls?q=is%3Apr+reviewed-by%3AarnaudNYC" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/hannesgr"><img src="https://avatars2.githubusercontent.com/u/18686736?v=4" width="100px;" alt=""/><br /><sub><b>Hannes Granström</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=hannesgr" title="Code">💻</a> <a href="#question-hannesgr" title="Answering Questions">💬</a> <a href="#translation-hannesgr" title="Translation">🌍</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://ruisaraiva.com"><img src="https://avatars2.githubusercontent.com/u/7356098?v=4" width="100px;" alt=""/><br /><sub><b>Rui Saraiva</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=ruisaraiva19" title="Code">💻</a> <a href="https://github.com/neherlab/covid19_scenarios/commits?author=ruisaraiva19" title="Documentation">📖</a> <a href="#question-ruisaraiva19" title="Answering Questions">💬</a> <a href="#maintenance-ruisaraiva19" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/bharath6365"><img src="https://avatars3.githubusercontent.com/u/12910216?v=4" width="100px;" alt=""/><br /><sub><b>bharath6365</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=bharath6365" title="Code">💻</a> <a href="#question-bharath6365" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://github.com/keevcodes"><img src="https://avatars1.githubusercontent.com/u/17259420?v=4" width="100px;" alt=""/><br /><sub><b>Andrew McKeever</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=keevcodes" title="Code">💻</a> <a href="#question-keevcodes" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://github.com/brunorzn"><img src="https://avatars1.githubusercontent.com/u/18266054?v=4" width="100px;" alt=""/><br /><sub><b>Bruno RZN</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=brunorzn" title="Code">💻</a> <a href="#question-brunorzn" title="Answering Questions">💬</a> <a href="https://github.com/neherlab/covid19_scenarios/pulls?q=is%3Apr+reviewed-by%3Abrunorzn" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="http://dsepler.com"><img src="https://avatars1.githubusercontent.com/u/3710083?v=4" width="100px;" alt=""/><br /><sub><b>Danny Sepler</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=dannysepler" title="Code">💻</a> <a href="#question-dannysepler" title="Answering Questions">💬</a> <a href="https://github.com/neherlab/covid19_scenarios/pulls?q=is%3Apr+reviewed-by%3Adannysepler" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://emmanuel16cr.web.app"><img src="https://avatars3.githubusercontent.com/u/5572221?v=4" width="100px;" alt=""/><br /><sub><b>Emmanuel Murillo Sánchez</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=emmurillo" title="Code">💻</a> <a href="#question-emmurillo" title="Answering Questions">💬</a> <a href="#translation-emmurillo" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/kibertoad"><img src="https://avatars3.githubusercontent.com/u/1847934?v=4" width="100px;" alt=""/><br /><sub><b>Igor Savin</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=kibertoad" title="Code">💻</a> <a href="#question-kibertoad" title="Answering Questions">💬</a> <a href="https://github.com/neherlab/covid19_scenarios/pulls?q=is%3Apr+reviewed-by%3Akibertoad" title="Reviewed Pull Requests">👀</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/ivnnv"><img src="https://avatars0.githubusercontent.com/u/23552631?v=4" width="100px;" alt=""/><br /><sub><b>Iván Yepes</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=ivnnv" title="Code">💻</a> <a href="#question-ivnnv" title="Answering Questions">💬</a></td>
    <td align="center"><a href="http://www.manuel-blechschmidt.de"><img src="https://avatars3.githubusercontent.com/u/457641?v=4" width="100px;" alt=""/><br /><sub><b>Manuel Blechschmidt</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=ManuelB" title="Code">💻</a> <a href="#question-ManuelB" title="Answering Questions">💬</a> <a href="https://github.com/neherlab/covid19_scenarios/commits?author=ManuelB" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/vejmelkam"><img src="https://avatars0.githubusercontent.com/u/1494839?v=4" width="100px;" alt=""/><br /><sub><b>Martin Vejmelka</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=vejmelkam" title="Code">💻</a> <a href="#question-vejmelkam" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://github.com/maktarsis"><img src="https://avatars1.githubusercontent.com/u/21989873?v=4" width="100px;" alt=""/><br /><sub><b>Max Tarsis</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=maktarsis" title="Code">💻</a> <a href="#question-maktarsis" title="Answering Questions">💬</a> <a href="https://github.com/neherlab/covid19_scenarios/commits?author=maktarsis" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://miguel.tech"><img src="https://avatars3.githubusercontent.com/u/5948929?v=4" width="100px;" alt=""/><br /><sub><b>Miguel Serrano</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=mserranom" title="Code">💻</a> <a href="#question-mserranom" title="Answering Questions">💬</a> <a href="https://github.com/neherlab/covid19_scenarios/commits?author=mserranom" title="Documentation">📖</a> <a href="#maintenance-mserranom" title="Maintenance">🚧</a></td>
    <td align="center"><a href="http://www.bacondarwin.com"><img src="https://avatars0.githubusercontent.com/u/15655?v=4" width="100px;" alt=""/><br /><sub><b>Pete Bacon Darwin</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=petebacondarwin" title="Code">💻</a> <a href="#question-petebacondarwin" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://github.com/rsharvill"><img src="https://avatars1.githubusercontent.com/u/26191606?v=4" width="100px;" alt=""/><br /><sub><b>Rachel Harvill</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=rsharvill" title="Code">💻</a> <a href="#question-rsharvill" title="Answering Questions">💬</a> <a href="https://github.com/neherlab/covid19_scenarios/commits?author=rsharvill" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/rebmullin"><img src="https://avatars2.githubusercontent.com/u/1986001?v=4" width="100px;" alt=""/><br /><sub><b>Rebecca Mullin</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=rebmullin" title="Code">💻</a> <a href="#question-rebmullin" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://github.com/lucernae"><img src="https://avatars2.githubusercontent.com/u/831865?v=4" width="100px;" alt=""/><br /><sub><b>Rizky Maulana Nugraha</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=lucernae" title="Code">💻</a> <a href="#maintenance-lucernae" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/rapzo"><img src="https://avatars2.githubusercontent.com/u/147788?v=4" width="100px;" alt=""/><br /><sub><b>Rui Lima</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=rapzo" title="Code">💻</a> <a href="#question-rapzo" title="Answering Questions">💬</a> <a href="#translation-rapzo" title="Translation">🌍</a></td>
    <td align="center"><a href="https://github.com/victor-cordova"><img src="https://avatars0.githubusercontent.com/u/18427801?v=4" width="100px;" alt=""/><br /><sub><b>Victor Cordova</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=victor-cordova" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/aschelch"><img src="https://avatars3.githubusercontent.com/u/2005559?v=4" width="100px;" alt=""/><br /><sub><b>aschelch</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=aschelch" title="Code">💻</a> <a href="#question-aschelch" title="Answering Questions">💬</a> <a href="#translation-aschelch" title="Translation">🌍</a></td>
    <td align="center"><a href="http://joaopn.github.io"><img src="https://avatars1.githubusercontent.com/u/6084685?v=4" width="100px;" alt=""/><br /><sub><b>joaopn</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=joaopn" title="Code">💻</a> <a href="#translation-joaopn" title="Translation">🌍</a></td>
    <td align="center"><a href="https://stocksinplay.com"><img src="https://avatars0.githubusercontent.com/u/2551341?v=4" width="100px;" alt=""/><br /><sub><b>nono</b></sub></a><br /><a href="https://github.com/neherlab/covid19_scenarios/commits?author=nonotest" title="Code">💻</a> <a href="#question-nonotest" title="Answering Questions">💬</a> <a href="#translation-nonotest" title="Translation">🌍</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.
Contributions of any kind welcome!

## License

[MIT License](LICENSE)

Copyright (c) 2020 neherlab

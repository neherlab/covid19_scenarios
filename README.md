<p align="center">
  <a href="https://neherlab.org/covid19/">
    <img
      width="100%"
      height="auto"
      src="https://user-images.githubusercontent.com/9403403/77125848-710b2700-6a47-11ea-84c3-19016d16e9dd.gif"
      alt="neherlab.org/covid19/"
    />
  </a>
</p>

<h1 align="center">
  COVID-19 Scenarios
</h1>

<p align="center">
  <a href="neherlab.org/covid19/">
    🌐 neherlab.org/covid19/
  </a>
</p>

<blockquote>
  <p align="center">
    Tool that models hospital demand during COVID-19 outbreak
  </p>
</blockquote>

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
      src="https://img.shields.io/github/commit-activity/m/neherlab/covid19_scenarios?logo=github"
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


### Parameters
Parameters fall into three different categories

  * population parameters
  * epidemiological parameters
  * clinical parameters

Most parameters can be adjusted in the tool and for many of them we provide presets.

Input data for the tool and the basic parameters of the populations are collected in a separate repository [neherlab/covid19_scenarios_data](https://github.com/neherlab/covid19_scenarios_data). 
Please add data on populations and parsers of publicly available case count data there. 

### Development

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

This will trigger the development server and build process. Wait for the build
to finish, then navigate to `http://localhost:3000` in a browser (last 5 version
of Chrome or Firefox are supported in dev mode)

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

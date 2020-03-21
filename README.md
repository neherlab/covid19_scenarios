# COVID-19 Scenarios

> Tool that models hospital demand during COVID-19 outbreak

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

# Running via the Command Line

You can run the model via the command line. You need to have `yarn` installed. You can then
make use of the `cli` target, for example:
```
yarn cli --scenario=scenario.json --out=output.json
``` 
Both an input scenario file and an output file location are required arguments.
An example of a scenario file:
```json
{
  "data": {
    "epidemiological": {
      "hospitalStayDays": 3,
      "icuStayDays": 14,
      "infectiousPeriodDays": 3,
      "latencyDays": 3,
      "overflowSeverity": 2,
      "peakMonth": 0,
      "r0": {
        "begin": 4.08,
        "end": 4.98
      },
      "seasonalForcing": 0
    },
    "mitigation": {
      "mitigationIntervals": [
        {
          "color": "#cccccc",
          "name": "Intervention 1",
          "timeRange": {
            "begin": "2020-03-24T00:00:00.000Z",
            "end": "2020-09-01T00:00:00.000Z"
          },
          "transmissionReduction": {
            "begin": 73.8,
            "end": 84.2
          }
        }
      ]
    },
    "population": {
      "ageDistributionName": "United States of America",
      "caseCountsName": "United States of America",
      "hospitalBeds": 798288,
      "icuBeds": 49499,
      "importsPerDay": 0.1,
      "initialNumberOfCases": 1,
      "populationServed": 327167434
    },
    "simulation": {
      "numberStochasticRuns": 15,
      "simulationTimeRange": {
        "begin": "2020-02-08T00:00:00.000Z",
        "end": "2020-08-31T00:00:00.000Z"
      }
    }
  },
  "name": "United States of America"
}
```

A usage message is available via `yarn cli --help`.


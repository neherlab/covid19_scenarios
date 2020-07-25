"use strict";
var formats = require("ajv/lib/compile/formats")();
var ucs2length = require("ajv/lib/compile/ucs2length");
var validate = (function () {
  var refVal = [];
  var refVal1 = (function () {
    var refVal = [];
    var refVal1 = (function () {
      var refVal = [];
      var refVal1 = {
        $schema: "http://json-schema.org/draft-07/schema",
        $id: "IntegerNonNegative",
        title: "IntegerNonNegative",
        type: "integer",
        multipleOf: 1,
        minimum: 0,
      };
      refVal[1] = refVal1;
      return function validate(
        data,
        dataPath,
        parentData,
        parentDataProperty,
        rootData
      ) {
        "use strict" /*# sourceURL=ScenarioDatumPopulation */;
        var vErrors = null;
        var errors = 0;
        if (data && typeof data === "object" && !Array.isArray(data)) {
          var errs__0 = errors;
          var valid1 = true;
          for (var key0 in data) {
            var isAdditional0 = !(
              false ||
              key0 == "populationServed" ||
              key0 == "ageDistributionName" ||
              key0 == "caseCountsName" ||
              key0 == "initialNumberOfCases" ||
              key0 == "importsPerDay" ||
              key0 == "hospitalBeds" ||
              key0 == "icuBeds"
            );
            if (isAdditional0) {
              valid1 = false;
              var err = {
                keyword: "additionalProperties",
                dataPath: (dataPath || "") + "",
                schemaPath: "#/additionalProperties",
                params: {
                  additionalProperty: "" + key0 + "",
                },
                message: "should NOT have additional properties",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
          }
          var data1 = data.populationServed;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "populationServed",
              },
              message: "should have required property 'populationServed'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            var errs_2 = errors;
            if (typeof data1 !== "number" || data1 % 1 || data1 !== data1) {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/populationServed",
                schemaPath: "IntegerNonNegative#/type",
                params: {
                  type: "integer",
                },
                message: "should be integer",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            if (typeof data1 === "number") {
              if (data1 < 0 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/populationServed",
                  schemaPath: "IntegerNonNegative#/minimum",
                  params: {
                    comparison: ">=",
                    limit: 0,
                    exclusive: false,
                  },
                  message: "should be >= 0",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var division2;
              if (
                ((division2 = data1 / 1), division2 !== parseInt(division2))
              ) {
                var err = {
                  keyword: "multipleOf",
                  dataPath: (dataPath || "") + "/populationServed",
                  schemaPath: "IntegerNonNegative#/multipleOf",
                  params: {
                    multipleOf: 1,
                  },
                  message: "should be multiple of 1",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            }
            var valid2 = errors === errs_2;
            var valid1 = errors === errs_1;
          }
          var data1 = data.ageDistributionName;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "ageDistributionName",
              },
              message: "should have required property 'ageDistributionName'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            if (typeof data1 === "string") {
              if (ucs2length(data1) < 1) {
                var err = {
                  keyword: "minLength",
                  dataPath: (dataPath || "") + "/ageDistributionName",
                  schemaPath: "#/properties/ageDistributionName/minLength",
                  params: {
                    limit: 1,
                  },
                  message: "should NOT be shorter than 1 characters",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            } else {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/ageDistributionName",
                schemaPath: "#/properties/ageDistributionName/type",
                params: {
                  type: "string",
                },
                message: "should be string",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid1 = errors === errs_1;
          }
          var data1 = data.caseCountsName;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "caseCountsName",
              },
              message: "should have required property 'caseCountsName'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            if (typeof data1 === "string") {
              if (ucs2length(data1) < 1) {
                var err = {
                  keyword: "minLength",
                  dataPath: (dataPath || "") + "/caseCountsName",
                  schemaPath: "#/properties/caseCountsName/minLength",
                  params: {
                    limit: 1,
                  },
                  message: "should NOT be shorter than 1 characters",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            } else {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/caseCountsName",
                schemaPath: "#/properties/caseCountsName/type",
                params: {
                  type: "string",
                },
                message: "should be string",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid1 = errors === errs_1;
          }
          var data1 = data.initialNumberOfCases;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "initialNumberOfCases",
              },
              message: "should have required property 'initialNumberOfCases'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            var errs_2 = errors;
            if (typeof data1 !== "number" || data1 % 1 || data1 !== data1) {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/initialNumberOfCases",
                schemaPath: "IntegerNonNegative#/type",
                params: {
                  type: "integer",
                },
                message: "should be integer",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            if (typeof data1 === "number") {
              if (data1 < 0 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/initialNumberOfCases",
                  schemaPath: "IntegerNonNegative#/minimum",
                  params: {
                    comparison: ">=",
                    limit: 0,
                    exclusive: false,
                  },
                  message: "should be >= 0",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var division2;
              if (
                ((division2 = data1 / 1), division2 !== parseInt(division2))
              ) {
                var err = {
                  keyword: "multipleOf",
                  dataPath: (dataPath || "") + "/initialNumberOfCases",
                  schemaPath: "IntegerNonNegative#/multipleOf",
                  params: {
                    multipleOf: 1,
                  },
                  message: "should be multiple of 1",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            }
            var valid2 = errors === errs_2;
            var valid1 = errors === errs_1;
          }
          var data1 = data.importsPerDay;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "importsPerDay",
              },
              message: "should have required property 'importsPerDay'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            if (typeof data1 === "number") {
              if (data1 < 0 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/importsPerDay",
                  schemaPath: "#/properties/importsPerDay/minimum",
                  params: {
                    comparison: ">=",
                    limit: 0,
                    exclusive: false,
                  },
                  message: "should be >= 0",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            } else {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/importsPerDay",
                schemaPath: "#/properties/importsPerDay/type",
                params: {
                  type: "number",
                },
                message: "should be number",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid1 = errors === errs_1;
          }
          var data1 = data.hospitalBeds;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "hospitalBeds",
              },
              message: "should have required property 'hospitalBeds'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            var errs_2 = errors;
            if (typeof data1 !== "number" || data1 % 1 || data1 !== data1) {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/hospitalBeds",
                schemaPath: "IntegerNonNegative#/type",
                params: {
                  type: "integer",
                },
                message: "should be integer",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            if (typeof data1 === "number") {
              if (data1 < 0 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/hospitalBeds",
                  schemaPath: "IntegerNonNegative#/minimum",
                  params: {
                    comparison: ">=",
                    limit: 0,
                    exclusive: false,
                  },
                  message: "should be >= 0",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var division2;
              if (
                ((division2 = data1 / 1), division2 !== parseInt(division2))
              ) {
                var err = {
                  keyword: "multipleOf",
                  dataPath: (dataPath || "") + "/hospitalBeds",
                  schemaPath: "IntegerNonNegative#/multipleOf",
                  params: {
                    multipleOf: 1,
                  },
                  message: "should be multiple of 1",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            }
            var valid2 = errors === errs_2;
            var valid1 = errors === errs_1;
          }
          var data1 = data.icuBeds;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "icuBeds",
              },
              message: "should have required property 'icuBeds'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            var errs_2 = errors;
            if (typeof data1 !== "number" || data1 % 1 || data1 !== data1) {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/icuBeds",
                schemaPath: "IntegerNonNegative#/type",
                params: {
                  type: "integer",
                },
                message: "should be integer",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            if (typeof data1 === "number") {
              if (data1 < 0 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/icuBeds",
                  schemaPath: "IntegerNonNegative#/minimum",
                  params: {
                    comparison: ">=",
                    limit: 0,
                    exclusive: false,
                  },
                  message: "should be >= 0",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var division2;
              if (
                ((division2 = data1 / 1), division2 !== parseInt(division2))
              ) {
                var err = {
                  keyword: "multipleOf",
                  dataPath: (dataPath || "") + "/icuBeds",
                  schemaPath: "IntegerNonNegative#/multipleOf",
                  params: {
                    multipleOf: 1,
                  },
                  message: "should be multiple of 1",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            }
            var valid2 = errors === errs_2;
            var valid1 = errors === errs_1;
          }
        } else {
          var err = {
            keyword: "type",
            dataPath: (dataPath || "") + "",
            schemaPath: "#/type",
            params: {
              type: "object",
            },
            message: "should be object",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        validate.errors = vErrors;
        return errors === 0;
      };
    })();
    refVal1.schema = {
      $schema: "http://json-schema.org/draft-07/schema",
      $id: "ScenarioDatumPopulation",
      title: "ScenarioDatumPopulation",
      type: "object",
      additionalProperties: false,
      required: [
        "populationServed",
        "ageDistributionName",
        "caseCountsName",
        "initialNumberOfCases",
        "importsPerDay",
        "hospitalBeds",
        "icuBeds",
      ],
      properties: {
        populationServed: {
          $ref: "IntegerNonNegative#",
        },
        ageDistributionName: {
          type: "string",
          minLength: 1,
        },
        caseCountsName: {
          type: "string",
          minLength: 1,
        },
        initialNumberOfCases: {
          $ref: "IntegerNonNegative#",
        },
        importsPerDay: {
          type: "number",
          minimum: 0,
        },
        hospitalBeds: {
          $ref: "IntegerNonNegative#",
        },
        icuBeds: {
          $ref: "IntegerNonNegative#",
        },
      },
    };
    refVal1.errors = null;
    refVal[1] = refVal1;
    var refVal2 = (function () {
      var refVal = [];
      var refVal1 = {
        $schema: "http://json-schema.org/draft-07/schema",
        $id: "NumericRangeNonNegative",
        title: "NumericRangeNonNegative",
        type: "object",
        additionalProperties: false,
        required: ["begin", "end"],
        properties: {
          begin: {
            type: "number",
            minimum: 0,
            maximum: {
              $data: "1/end",
            },
          },
          end: {
            type: "number",
          },
        },
      };
      refVal[1] = refVal1;
      var refVal2 = {
        $schema: "http://json-schema.org/draft-07/schema",
        $id: "IntegerNonNegative",
        title: "IntegerNonNegative",
        type: "integer",
        multipleOf: 1,
        minimum: 0,
      };
      refVal[2] = refVal2;
      return function validate(
        data,
        dataPath,
        parentData,
        parentDataProperty,
        rootData
      ) {
        "use strict" /*# sourceURL=ScenarioDatumEpidemiological */;
        var vErrors = null;
        var errors = 0;
        if (data && typeof data === "object" && !Array.isArray(data)) {
          var errs__0 = errors;
          var valid1 = true;
          for (var key0 in data) {
            var isAdditional0 = !(
              false ||
              key0 == "r0" ||
              key0 == "latencyDays" ||
              key0 == "infectiousPeriodDays" ||
              key0 == "hospitalStayDays" ||
              key0 == "icuStayDays" ||
              key0 == "seasonalForcing" ||
              key0 == "peakMonth" ||
              key0 == "overflowSeverity"
            );
            if (isAdditional0) {
              valid1 = false;
              var err = {
                keyword: "additionalProperties",
                dataPath: (dataPath || "") + "",
                schemaPath: "#/additionalProperties",
                params: {
                  additionalProperty: "" + key0 + "",
                },
                message: "should NOT have additional properties",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
          }
          var data1 = data.r0;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "r0",
              },
              message: "should have required property 'r0'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            var errs_2 = errors;
            if (data1 && typeof data1 === "object" && !Array.isArray(data1)) {
              var errs__2 = errors;
              var valid3 = true;
              for (var key2 in data1) {
                var isAdditional2 = !(
                  false ||
                  key2 == "begin" ||
                  key2 == "end"
                );
                if (isAdditional2) {
                  valid3 = false;
                  var err = {
                    keyword: "additionalProperties",
                    dataPath: (dataPath || "") + "/r0",
                    schemaPath: "NumericRangeNonNegative#/additionalProperties",
                    params: {
                      additionalProperty: "" + key2 + "",
                    },
                    message: "should NOT have additional properties",
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
              }
              var data2 = data1.begin;
              if (data2 === undefined) {
                valid3 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + "/r0",
                  schemaPath: "NumericRangeNonNegative#/required",
                  params: {
                    missingProperty: "begin",
                  },
                  message: "should have required property 'begin'",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_3 = errors;
                if (typeof data2 === "number") {
                  var schema3 = data1 && data1.end;
                  if (
                    (schema3 !== undefined && typeof schema3 != "number") ||
                    data2 > schema3 ||
                    data2 !== data2
                  ) {
                    var err = {
                      keyword: "maximum",
                      dataPath: (dataPath || "") + "/r0/begin",
                      schemaPath:
                        "NumericRangeNonNegative#/properties/begin/maximum",
                      params: {
                        comparison: "<=",
                        limit: schema3,
                        exclusive: false,
                      },
                      message: "should be <= " + schema3,
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  if (data2 < 0 || data2 !== data2) {
                    var err = {
                      keyword: "minimum",
                      dataPath: (dataPath || "") + "/r0/begin",
                      schemaPath:
                        "NumericRangeNonNegative#/properties/begin/minimum",
                      params: {
                        comparison: ">=",
                        limit: 0,
                        exclusive: false,
                      },
                      message: "should be >= 0",
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                } else {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + "/r0/begin",
                    schemaPath:
                      "NumericRangeNonNegative#/properties/begin/type",
                    params: {
                      type: "number",
                    },
                    message: "should be number",
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid3 = errors === errs_3;
              }
              if (data1.end === undefined) {
                valid3 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + "/r0",
                  schemaPath: "NumericRangeNonNegative#/required",
                  params: {
                    missingProperty: "end",
                  },
                  message: "should have required property 'end'",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_3 = errors;
                if (typeof data1.end !== "number") {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + "/r0/end",
                    schemaPath: "NumericRangeNonNegative#/properties/end/type",
                    params: {
                      type: "number",
                    },
                    message: "should be number",
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid3 = errors === errs_3;
              }
            } else {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/r0",
                schemaPath: "NumericRangeNonNegative#/type",
                params: {
                  type: "object",
                },
                message: "should be object",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
            var valid1 = errors === errs_1;
          }
          var data1 = data.latencyDays;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "latencyDays",
              },
              message: "should have required property 'latencyDays'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            if (typeof data1 === "number") {
              if (data1 < 1 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/latencyDays",
                  schemaPath: "#/properties/latencyDays/minimum",
                  params: {
                    comparison: ">=",
                    limit: 1,
                    exclusive: false,
                  },
                  message: "should be >= 1",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            } else {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/latencyDays",
                schemaPath: "#/properties/latencyDays/type",
                params: {
                  type: "number",
                },
                message: "should be number",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid1 = errors === errs_1;
          }
          var data1 = data.infectiousPeriodDays;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "infectiousPeriodDays",
              },
              message: "should have required property 'infectiousPeriodDays'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            if (typeof data1 === "number") {
              if (data1 < 1 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/infectiousPeriodDays",
                  schemaPath: "#/properties/infectiousPeriodDays/minimum",
                  params: {
                    comparison: ">=",
                    limit: 1,
                    exclusive: false,
                  },
                  message: "should be >= 1",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            } else {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/infectiousPeriodDays",
                schemaPath: "#/properties/infectiousPeriodDays/type",
                params: {
                  type: "number",
                },
                message: "should be number",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid1 = errors === errs_1;
          }
          var data1 = data.hospitalStayDays;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "hospitalStayDays",
              },
              message: "should have required property 'hospitalStayDays'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            if (typeof data1 === "number") {
              if (data1 < 1 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/hospitalStayDays",
                  schemaPath: "#/properties/hospitalStayDays/minimum",
                  params: {
                    comparison: ">=",
                    limit: 1,
                    exclusive: false,
                  },
                  message: "should be >= 1",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            } else {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/hospitalStayDays",
                schemaPath: "#/properties/hospitalStayDays/type",
                params: {
                  type: "number",
                },
                message: "should be number",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid1 = errors === errs_1;
          }
          var data1 = data.icuStayDays;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "icuStayDays",
              },
              message: "should have required property 'icuStayDays'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            if (typeof data1 === "number") {
              if (data1 < 1 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/icuStayDays",
                  schemaPath: "#/properties/icuStayDays/minimum",
                  params: {
                    comparison: ">=",
                    limit: 1,
                    exclusive: false,
                  },
                  message: "should be >= 1",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            } else {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/icuStayDays",
                schemaPath: "#/properties/icuStayDays/type",
                params: {
                  type: "number",
                },
                message: "should be number",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid1 = errors === errs_1;
          }
          var data1 = data.seasonalForcing;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "seasonalForcing",
              },
              message: "should have required property 'seasonalForcing'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            if (typeof data1 === "number") {
              if (data1 < 0 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/seasonalForcing",
                  schemaPath: "#/properties/seasonalForcing/minimum",
                  params: {
                    comparison: ">=",
                    limit: 0,
                    exclusive: false,
                  },
                  message: "should be >= 0",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            } else {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/seasonalForcing",
                schemaPath: "#/properties/seasonalForcing/type",
                params: {
                  type: "number",
                },
                message: "should be number",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid1 = errors === errs_1;
          }
          var data1 = data.peakMonth;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "peakMonth",
              },
              message: "should have required property 'peakMonth'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            var errs_2 = errors;
            var errs_3 = errors;
            if (typeof data1 !== "number" || data1 % 1 || data1 !== data1) {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/peakMonth",
                schemaPath: "IntegerNonNegative#/type",
                params: {
                  type: "integer",
                },
                message: "should be integer",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            if (typeof data1 === "number") {
              if (data1 < 0 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/peakMonth",
                  schemaPath: "IntegerNonNegative#/minimum",
                  params: {
                    comparison: ">=",
                    limit: 0,
                    exclusive: false,
                  },
                  message: "should be >= 0",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var division3;
              if (
                ((division3 = data1 / 1), division3 !== parseInt(division3))
              ) {
                var err = {
                  keyword: "multipleOf",
                  dataPath: (dataPath || "") + "/peakMonth",
                  schemaPath: "IntegerNonNegative#/multipleOf",
                  params: {
                    multipleOf: 1,
                  },
                  message: "should be multiple of 1",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            }
            var valid3 = errors === errs_3;
            var valid2 = errors === errs_2;
            var errs_2 = errors;
            if (typeof data1 === "number") {
              if (data1 > 11 || data1 !== data1) {
                var err = {
                  keyword: "maximum",
                  dataPath: (dataPath || "") + "/peakMonth",
                  schemaPath: "#/properties/peakMonth/allOf/1/maximum",
                  params: {
                    comparison: "<=",
                    limit: 11,
                    exclusive: false,
                  },
                  message: "should be <= 11",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            }
            var valid2 = errors === errs_2;
            var valid1 = errors === errs_1;
          }
          var data1 = data.overflowSeverity;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "overflowSeverity",
              },
              message: "should have required property 'overflowSeverity'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            if (typeof data1 === "number") {
              if (data1 < 0 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/overflowSeverity",
                  schemaPath: "#/properties/overflowSeverity/minimum",
                  params: {
                    comparison: ">=",
                    limit: 0,
                    exclusive: false,
                  },
                  message: "should be >= 0",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            } else {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/overflowSeverity",
                schemaPath: "#/properties/overflowSeverity/type",
                params: {
                  type: "number",
                },
                message: "should be number",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid1 = errors === errs_1;
          }
        } else {
          var err = {
            keyword: "type",
            dataPath: (dataPath || "") + "",
            schemaPath: "#/type",
            params: {
              type: "object",
            },
            message: "should be object",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        validate.errors = vErrors;
        return errors === 0;
      };
    })();
    refVal2.schema = {
      $schema: "http://json-schema.org/draft-07/schema",
      $id: "ScenarioDatumEpidemiological",
      title: "ScenarioDatumEpidemiological",
      type: "object",
      additionalProperties: false,
      required: [
        "r0",
        "latencyDays",
        "infectiousPeriodDays",
        "hospitalStayDays",
        "icuStayDays",
        "seasonalForcing",
        "peakMonth",
        "overflowSeverity",
      ],
      properties: {
        r0: {
          $ref: "NumericRangeNonNegative#",
        },
        latencyDays: {
          type: "number",
          minimum: 1,
        },
        infectiousPeriodDays: {
          type: "number",
          minimum: 1,
        },
        hospitalStayDays: {
          type: "number",
          minimum: 1,
        },
        icuStayDays: {
          type: "number",
          minimum: 1,
        },
        seasonalForcing: {
          type: "number",
          minimum: 0,
        },
        peakMonth: {
          allOf: [
            {
              $ref: "IntegerNonNegative#",
            },
            {
              maximum: 11,
            },
          ],
        },
        overflowSeverity: {
          type: "number",
          minimum: 0,
        },
      },
    };
    refVal2.errors = null;
    refVal[2] = refVal2;
    var refVal3 = (function () {
      var refVal = [];
      var refVal1 = {
        $schema: "http://json-schema.org/draft-07/schema",
        $id: "DateRange",
        title: "DateRange",
        type: "object",
        additionalProperties: false,
        required: ["begin", "end"],
        properties: {
          begin: {
            oneOf: [
              {
                type: "string",
                format: "date",
              },
              {
                type: "string",
                format: "date-time",
              },
            ],
            formatMaximum: {
              $data: "1/end",
            },
          },
          end: {
            oneOf: [
              {
                type: "string",
                format: "date",
              },
              {
                type: "string",
                format: "date-time",
              },
            ],
          },
        },
      };
      refVal[1] = refVal1;
      var refVal2 = {
        $schema: "http://json-schema.org/draft-07/schema",
        $id: "Integer",
        title: "Integer",
        type: "integer",
        multipleOf: 1,
      };
      refVal[2] = refVal2;
      return function validate(
        data,
        dataPath,
        parentData,
        parentDataProperty,
        rootData
      ) {
        "use strict" /*# sourceURL=ScenarioDatumSimulation */;
        var vErrors = null;
        var errors = 0;
        if (data && typeof data === "object" && !Array.isArray(data)) {
          var errs__0 = errors;
          var valid1 = true;
          for (var key0 in data) {
            var isAdditional0 = !(
              false ||
              key0 == "simulationTimeRange" ||
              key0 == "numberStochasticRuns"
            );
            if (isAdditional0) {
              valid1 = false;
              var err = {
                keyword: "additionalProperties",
                dataPath: (dataPath || "") + "",
                schemaPath: "#/additionalProperties",
                params: {
                  additionalProperty: "" + key0 + "",
                },
                message: "should NOT have additional properties",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
          }
          var data1 = data.simulationTimeRange;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "simulationTimeRange",
              },
              message: "should have required property 'simulationTimeRange'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            var errs_2 = errors;
            if (data1 && typeof data1 === "object" && !Array.isArray(data1)) {
              var errs__2 = errors;
              var valid3 = true;
              for (var key2 in data1) {
                var isAdditional2 = !(
                  false ||
                  key2 == "begin" ||
                  key2 == "end"
                );
                if (isAdditional2) {
                  valid3 = false;
                  var err = {
                    keyword: "additionalProperties",
                    dataPath: (dataPath || "") + "/simulationTimeRange",
                    schemaPath: "DateRange#/additionalProperties",
                    params: {
                      additionalProperty: "" + key2 + "",
                    },
                    message: "should NOT have additional properties",
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
              }
              var data2 = data1.begin;
              if (data2 === undefined) {
                valid3 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + "/simulationTimeRange",
                  schemaPath: "DateRange#/required",
                  params: {
                    missingProperty: "begin",
                  },
                  message: "should have required property 'begin'",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_3 = errors;
                var errs__3 = errors,
                  prevValid3 = false,
                  valid3 = false,
                  passingSchemas3 = null;
                var errs_4 = errors;
                if (typeof data2 === "string") {
                  if (!formats.date.test(data2)) {
                    var err = {
                      keyword: "format",
                      dataPath: (dataPath || "") + "/simulationTimeRange/begin",
                      schemaPath: "DateRange#/properties/begin/oneOf/0/format",
                      params: {
                        format: "date",
                      },
                      message: 'should match format "date"',
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                } else {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + "/simulationTimeRange/begin",
                    schemaPath: "DateRange#/properties/begin/oneOf/0/type",
                    params: {
                      type: "string",
                    },
                    message: "should be string",
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid4 = errors === errs_4;
                if (valid4) {
                  valid3 = prevValid3 = true;
                  passingSchemas3 = 0;
                }
                var errs_4 = errors;
                if (typeof data2 === "string") {
                  if (!formats["date-time"].test(data2)) {
                    var err = {
                      keyword: "format",
                      dataPath: (dataPath || "") + "/simulationTimeRange/begin",
                      schemaPath: "DateRange#/properties/begin/oneOf/1/format",
                      params: {
                        format: "date-time",
                      },
                      message: 'should match format "date-time"',
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                } else {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + "/simulationTimeRange/begin",
                    schemaPath: "DateRange#/properties/begin/oneOf/1/type",
                    params: {
                      type: "string",
                    },
                    message: "should be string",
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid4 = errors === errs_4;
                if (valid4 && prevValid3) {
                  valid3 = false;
                  passingSchemas3 = [passingSchemas3, 1];
                } else {
                  if (valid4) {
                    valid3 = prevValid3 = true;
                    passingSchemas3 = 1;
                  }
                }
                if (!valid3) {
                  var err = {
                    keyword: "oneOf",
                    dataPath: (dataPath || "") + "/simulationTimeRange/begin",
                    schemaPath: "DateRange#/properties/begin/oneOf",
                    params: {
                      passingSchemas: passingSchemas3,
                    },
                    message: "should match exactly one schema in oneOf",
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                } else {
                  errors = errs__3;
                  if (vErrors !== null) {
                    if (errs__3) vErrors.length = errs__3;
                    else vErrors = null;
                  }
                }
                var valid3 = errors === errs_3;
              }
              var data2 = data1.end;
              if (data2 === undefined) {
                valid3 = false;
                var err = {
                  keyword: "required",
                  dataPath: (dataPath || "") + "/simulationTimeRange",
                  schemaPath: "DateRange#/required",
                  params: {
                    missingProperty: "end",
                  },
                  message: "should have required property 'end'",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              } else {
                var errs_3 = errors;
                var errs__3 = errors,
                  prevValid3 = false,
                  valid3 = false,
                  passingSchemas3 = null;
                var errs_4 = errors;
                if (typeof data2 === "string") {
                  if (!formats.date.test(data2)) {
                    var err = {
                      keyword: "format",
                      dataPath: (dataPath || "") + "/simulationTimeRange/end",
                      schemaPath: "DateRange#/properties/end/oneOf/0/format",
                      params: {
                        format: "date",
                      },
                      message: 'should match format "date"',
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                } else {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + "/simulationTimeRange/end",
                    schemaPath: "DateRange#/properties/end/oneOf/0/type",
                    params: {
                      type: "string",
                    },
                    message: "should be string",
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid4 = errors === errs_4;
                if (valid4) {
                  valid3 = prevValid3 = true;
                  passingSchemas3 = 0;
                }
                var errs_4 = errors;
                if (typeof data2 === "string") {
                  if (!formats["date-time"].test(data2)) {
                    var err = {
                      keyword: "format",
                      dataPath: (dataPath || "") + "/simulationTimeRange/end",
                      schemaPath: "DateRange#/properties/end/oneOf/1/format",
                      params: {
                        format: "date-time",
                      },
                      message: 'should match format "date-time"',
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                } else {
                  var err = {
                    keyword: "type",
                    dataPath: (dataPath || "") + "/simulationTimeRange/end",
                    schemaPath: "DateRange#/properties/end/oneOf/1/type",
                    params: {
                      type: "string",
                    },
                    message: "should be string",
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
                var valid4 = errors === errs_4;
                if (valid4 && prevValid3) {
                  valid3 = false;
                  passingSchemas3 = [passingSchemas3, 1];
                } else {
                  if (valid4) {
                    valid3 = prevValid3 = true;
                    passingSchemas3 = 1;
                  }
                }
                if (!valid3) {
                  var err = {
                    keyword: "oneOf",
                    dataPath: (dataPath || "") + "/simulationTimeRange/end",
                    schemaPath: "DateRange#/properties/end/oneOf",
                    params: {
                      passingSchemas: passingSchemas3,
                    },
                    message: "should match exactly one schema in oneOf",
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                } else {
                  errors = errs__3;
                  if (vErrors !== null) {
                    if (errs__3) vErrors.length = errs__3;
                    else vErrors = null;
                  }
                }
                var valid3 = errors === errs_3;
              }
            } else {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/simulationTimeRange",
                schemaPath: "DateRange#/type",
                params: {
                  type: "object",
                },
                message: "should be object",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
            var valid1 = errors === errs_1;
          }
          var data1 = data.numberStochasticRuns;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "numberStochasticRuns",
              },
              message: "should have required property 'numberStochasticRuns'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            var errs_2 = errors;
            var errs_3 = errors;
            if (typeof data1 !== "number" || data1 % 1 || data1 !== data1) {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/numberStochasticRuns",
                schemaPath: "Integer#/type",
                params: {
                  type: "integer",
                },
                message: "should be integer",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            if (typeof data1 === "number") {
              var division3;
              if (
                ((division3 = data1 / 1), division3 !== parseInt(division3))
              ) {
                var err = {
                  keyword: "multipleOf",
                  dataPath: (dataPath || "") + "/numberStochasticRuns",
                  schemaPath: "Integer#/multipleOf",
                  params: {
                    multipleOf: 1,
                  },
                  message: "should be multiple of 1",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            }
            var valid3 = errors === errs_3;
            var valid2 = errors === errs_2;
            var errs_2 = errors;
            if (typeof data1 === "number") {
              if (data1 > 100 || data1 !== data1) {
                var err = {
                  keyword: "maximum",
                  dataPath: (dataPath || "") + "/numberStochasticRuns",
                  schemaPath:
                    "#/properties/numberStochasticRuns/allOf/1/maximum",
                  params: {
                    comparison: "<=",
                    limit: 100,
                    exclusive: false,
                  },
                  message: "should be <= 100",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              if (data1 < 10 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/numberStochasticRuns",
                  schemaPath:
                    "#/properties/numberStochasticRuns/allOf/1/minimum",
                  params: {
                    comparison: ">=",
                    limit: 10,
                    exclusive: false,
                  },
                  message: "should be >= 10",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            }
            var valid2 = errors === errs_2;
            var valid1 = errors === errs_1;
          }
        } else {
          var err = {
            keyword: "type",
            dataPath: (dataPath || "") + "",
            schemaPath: "#/type",
            params: {
              type: "object",
            },
            message: "should be object",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        validate.errors = vErrors;
        return errors === 0;
      };
    })();
    refVal3.schema = {
      $schema: "http://json-schema.org/draft-07/schema",
      $id: "ScenarioDatumSimulation",
      title: "ScenarioDatumSimulation",
      type: "object",
      additionalProperties: false,
      required: ["simulationTimeRange", "numberStochasticRuns"],
      properties: {
        simulationTimeRange: {
          $ref: "DateRange#",
        },
        numberStochasticRuns: {
          allOf: [
            {
              $ref: "Integer#",
            },
            {
              minimum: 10,
              maximum: 100,
            },
          ],
        },
      },
    };
    refVal3.errors = null;
    refVal[3] = refVal3;
    var refVal4 = (function () {
      var refVal = [];
      var refVal1 = (function () {
        var pattern0 = new RegExp("^#(?:[0-9a-fA-F]{3}){1,2}$");
        var refVal = [];
        var refVal1 = {
          $schema: "http://json-schema.org/draft-07/schema",
          $id: "ColorHex",
          title: "ColorHex",
          type: "string",
          pattern: "^#(?:[0-9a-fA-F]{3}){1,2}$",
        };
        refVal[1] = refVal1;
        var refVal2 = {
          $schema: "http://json-schema.org/draft-07/schema",
          $id: "DateRange",
          title: "DateRange",
          type: "object",
          additionalProperties: false,
          required: ["begin", "end"],
          properties: {
            begin: {
              oneOf: [
                {
                  type: "string",
                  format: "date",
                },
                {
                  type: "string",
                  format: "date-time",
                },
              ],
              formatMaximum: {
                $data: "1/end",
              },
            },
            end: {
              oneOf: [
                {
                  type: "string",
                  format: "date",
                },
                {
                  type: "string",
                  format: "date-time",
                },
              ],
            },
          },
        };
        refVal[2] = refVal2;
        var refVal3 = {
          $schema: "http://json-schema.org/draft-07/schema",
          $id: "PercentageRange",
          title: "PercentageRange",
          type: "object",
          additionalProperties: false,
          required: ["begin", "end"],
          properties: {
            begin: {
              type: "number",
              minimum: 0,
              maximum: {
                $data: "1/end",
              },
            },
            end: {
              type: "number",
              maximum: 100,
            },
          },
        };
        refVal[3] = refVal3;
        return function validate(
          data,
          dataPath,
          parentData,
          parentDataProperty,
          rootData
        ) {
          "use strict" /*# sourceURL=MitigationInterval */;
          var vErrors = null;
          var errors = 0;
          if (data && typeof data === "object" && !Array.isArray(data)) {
            var errs__0 = errors;
            var valid1 = true;
            for (var key0 in data) {
              var isAdditional0 = !(
                false ||
                key0 == "name" ||
                key0 == "color" ||
                key0 == "timeRange" ||
                key0 == "transmissionReduction"
              );
              if (isAdditional0) {
                valid1 = false;
                var err = {
                  keyword: "additionalProperties",
                  dataPath: (dataPath || "") + "",
                  schemaPath: "#/additionalProperties",
                  params: {
                    additionalProperty: "" + key0 + "",
                  },
                  message: "should NOT have additional properties",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
            }
            var data1 = data.name;
            if (data1 === undefined) {
              valid1 = false;
              var err = {
                keyword: "required",
                dataPath: (dataPath || "") + "",
                schemaPath: "#/required",
                params: {
                  missingProperty: "name",
                },
                message: "should have required property 'name'",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            } else {
              var errs_1 = errors;
              if (typeof data1 === "string") {
                if (ucs2length(data1) < 1) {
                  var err = {
                    keyword: "minLength",
                    dataPath: (dataPath || "") + "/name",
                    schemaPath: "#/properties/name/minLength",
                    params: {
                      limit: 1,
                    },
                    message: "should NOT be shorter than 1 characters",
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
              } else {
                var err = {
                  keyword: "type",
                  dataPath: (dataPath || "") + "/name",
                  schemaPath: "#/properties/name/type",
                  params: {
                    type: "string",
                  },
                  message: "should be string",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var valid1 = errors === errs_1;
            }
            var data1 = data.color;
            if (data1 === undefined) {
              valid1 = false;
              var err = {
                keyword: "required",
                dataPath: (dataPath || "") + "",
                schemaPath: "#/required",
                params: {
                  missingProperty: "color",
                },
                message: "should have required property 'color'",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            } else {
              var errs_1 = errors;
              var errs_2 = errors;
              if (typeof data1 === "string") {
                if (!pattern0.test(data1)) {
                  var err = {
                    keyword: "pattern",
                    dataPath: (dataPath || "") + "/color",
                    schemaPath: "ColorHex#/pattern",
                    params: {
                      pattern: "^#(?:[0-9a-fA-F]{3}){1,2}$",
                    },
                    message:
                      'should match pattern "^#(?:[0-9a-fA-F]{3}){1,2}$"',
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                }
              } else {
                var err = {
                  keyword: "type",
                  dataPath: (dataPath || "") + "/color",
                  schemaPath: "ColorHex#/type",
                  params: {
                    type: "string",
                  },
                  message: "should be string",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var valid2 = errors === errs_2;
              var valid1 = errors === errs_1;
            }
            var data1 = data.timeRange;
            if (data1 === undefined) {
              valid1 = false;
              var err = {
                keyword: "required",
                dataPath: (dataPath || "") + "",
                schemaPath: "#/required",
                params: {
                  missingProperty: "timeRange",
                },
                message: "should have required property 'timeRange'",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            } else {
              var errs_1 = errors;
              var errs_2 = errors;
              if (data1 && typeof data1 === "object" && !Array.isArray(data1)) {
                var errs__2 = errors;
                var valid3 = true;
                for (var key2 in data1) {
                  var isAdditional2 = !(
                    false ||
                    key2 == "begin" ||
                    key2 == "end"
                  );
                  if (isAdditional2) {
                    valid3 = false;
                    var err = {
                      keyword: "additionalProperties",
                      dataPath: (dataPath || "") + "/timeRange",
                      schemaPath: "DateRange#/additionalProperties",
                      params: {
                        additionalProperty: "" + key2 + "",
                      },
                      message: "should NOT have additional properties",
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                }
                var data2 = data1.begin;
                if (data2 === undefined) {
                  valid3 = false;
                  var err = {
                    keyword: "required",
                    dataPath: (dataPath || "") + "/timeRange",
                    schemaPath: "DateRange#/required",
                    params: {
                      missingProperty: "begin",
                    },
                    message: "should have required property 'begin'",
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                } else {
                  var errs_3 = errors;
                  var errs__3 = errors,
                    prevValid3 = false,
                    valid3 = false,
                    passingSchemas3 = null;
                  var errs_4 = errors;
                  if (typeof data2 === "string") {
                    if (!formats.date.test(data2)) {
                      var err = {
                        keyword: "format",
                        dataPath: (dataPath || "") + "/timeRange/begin",
                        schemaPath:
                          "DateRange#/properties/begin/oneOf/0/format",
                        params: {
                          format: "date",
                        },
                        message: 'should match format "date"',
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                  } else {
                    var err = {
                      keyword: "type",
                      dataPath: (dataPath || "") + "/timeRange/begin",
                      schemaPath: "DateRange#/properties/begin/oneOf/0/type",
                      params: {
                        type: "string",
                      },
                      message: "should be string",
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid4 = errors === errs_4;
                  if (valid4) {
                    valid3 = prevValid3 = true;
                    passingSchemas3 = 0;
                  }
                  var errs_4 = errors;
                  if (typeof data2 === "string") {
                    if (!formats["date-time"].test(data2)) {
                      var err = {
                        keyword: "format",
                        dataPath: (dataPath || "") + "/timeRange/begin",
                        schemaPath:
                          "DateRange#/properties/begin/oneOf/1/format",
                        params: {
                          format: "date-time",
                        },
                        message: 'should match format "date-time"',
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                  } else {
                    var err = {
                      keyword: "type",
                      dataPath: (dataPath || "") + "/timeRange/begin",
                      schemaPath: "DateRange#/properties/begin/oneOf/1/type",
                      params: {
                        type: "string",
                      },
                      message: "should be string",
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid4 = errors === errs_4;
                  if (valid4 && prevValid3) {
                    valid3 = false;
                    passingSchemas3 = [passingSchemas3, 1];
                  } else {
                    if (valid4) {
                      valid3 = prevValid3 = true;
                      passingSchemas3 = 1;
                    }
                  }
                  if (!valid3) {
                    var err = {
                      keyword: "oneOf",
                      dataPath: (dataPath || "") + "/timeRange/begin",
                      schemaPath: "DateRange#/properties/begin/oneOf",
                      params: {
                        passingSchemas: passingSchemas3,
                      },
                      message: "should match exactly one schema in oneOf",
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  } else {
                    errors = errs__3;
                    if (vErrors !== null) {
                      if (errs__3) vErrors.length = errs__3;
                      else vErrors = null;
                    }
                  }
                  var valid3 = errors === errs_3;
                }
                var data2 = data1.end;
                if (data2 === undefined) {
                  valid3 = false;
                  var err = {
                    keyword: "required",
                    dataPath: (dataPath || "") + "/timeRange",
                    schemaPath: "DateRange#/required",
                    params: {
                      missingProperty: "end",
                    },
                    message: "should have required property 'end'",
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                } else {
                  var errs_3 = errors;
                  var errs__3 = errors,
                    prevValid3 = false,
                    valid3 = false,
                    passingSchemas3 = null;
                  var errs_4 = errors;
                  if (typeof data2 === "string") {
                    if (!formats.date.test(data2)) {
                      var err = {
                        keyword: "format",
                        dataPath: (dataPath || "") + "/timeRange/end",
                        schemaPath: "DateRange#/properties/end/oneOf/0/format",
                        params: {
                          format: "date",
                        },
                        message: 'should match format "date"',
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                  } else {
                    var err = {
                      keyword: "type",
                      dataPath: (dataPath || "") + "/timeRange/end",
                      schemaPath: "DateRange#/properties/end/oneOf/0/type",
                      params: {
                        type: "string",
                      },
                      message: "should be string",
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid4 = errors === errs_4;
                  if (valid4) {
                    valid3 = prevValid3 = true;
                    passingSchemas3 = 0;
                  }
                  var errs_4 = errors;
                  if (typeof data2 === "string") {
                    if (!formats["date-time"].test(data2)) {
                      var err = {
                        keyword: "format",
                        dataPath: (dataPath || "") + "/timeRange/end",
                        schemaPath: "DateRange#/properties/end/oneOf/1/format",
                        params: {
                          format: "date-time",
                        },
                        message: 'should match format "date-time"',
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                  } else {
                    var err = {
                      keyword: "type",
                      dataPath: (dataPath || "") + "/timeRange/end",
                      schemaPath: "DateRange#/properties/end/oneOf/1/type",
                      params: {
                        type: "string",
                      },
                      message: "should be string",
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid4 = errors === errs_4;
                  if (valid4 && prevValid3) {
                    valid3 = false;
                    passingSchemas3 = [passingSchemas3, 1];
                  } else {
                    if (valid4) {
                      valid3 = prevValid3 = true;
                      passingSchemas3 = 1;
                    }
                  }
                  if (!valid3) {
                    var err = {
                      keyword: "oneOf",
                      dataPath: (dataPath || "") + "/timeRange/end",
                      schemaPath: "DateRange#/properties/end/oneOf",
                      params: {
                        passingSchemas: passingSchemas3,
                      },
                      message: "should match exactly one schema in oneOf",
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  } else {
                    errors = errs__3;
                    if (vErrors !== null) {
                      if (errs__3) vErrors.length = errs__3;
                      else vErrors = null;
                    }
                  }
                  var valid3 = errors === errs_3;
                }
              } else {
                var err = {
                  keyword: "type",
                  dataPath: (dataPath || "") + "/timeRange",
                  schemaPath: "DateRange#/type",
                  params: {
                    type: "object",
                  },
                  message: "should be object",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var valid2 = errors === errs_2;
              var valid1 = errors === errs_1;
            }
            var data1 = data.transmissionReduction;
            if (data1 === undefined) {
              valid1 = false;
              var err = {
                keyword: "required",
                dataPath: (dataPath || "") + "",
                schemaPath: "#/required",
                params: {
                  missingProperty: "transmissionReduction",
                },
                message:
                  "should have required property 'transmissionReduction'",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            } else {
              var errs_1 = errors;
              var errs_2 = errors;
              if (data1 && typeof data1 === "object" && !Array.isArray(data1)) {
                var errs__2 = errors;
                var valid3 = true;
                for (var key2 in data1) {
                  var isAdditional2 = !(
                    false ||
                    key2 == "begin" ||
                    key2 == "end"
                  );
                  if (isAdditional2) {
                    valid3 = false;
                    var err = {
                      keyword: "additionalProperties",
                      dataPath: (dataPath || "") + "/transmissionReduction",
                      schemaPath: "PercentageRange#/additionalProperties",
                      params: {
                        additionalProperty: "" + key2 + "",
                      },
                      message: "should NOT have additional properties",
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                }
                var data2 = data1.begin;
                if (data2 === undefined) {
                  valid3 = false;
                  var err = {
                    keyword: "required",
                    dataPath: (dataPath || "") + "/transmissionReduction",
                    schemaPath: "PercentageRange#/required",
                    params: {
                      missingProperty: "begin",
                    },
                    message: "should have required property 'begin'",
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                } else {
                  var errs_3 = errors;
                  if (typeof data2 === "number") {
                    var schema3 = data1 && data1.end;
                    if (
                      (schema3 !== undefined && typeof schema3 != "number") ||
                      data2 > schema3 ||
                      data2 !== data2
                    ) {
                      var err = {
                        keyword: "maximum",
                        dataPath:
                          (dataPath || "") + "/transmissionReduction/begin",
                        schemaPath: "PercentageRange#/properties/begin/maximum",
                        params: {
                          comparison: "<=",
                          limit: schema3,
                          exclusive: false,
                        },
                        message: "should be <= " + schema3,
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                    if (data2 < 0 || data2 !== data2) {
                      var err = {
                        keyword: "minimum",
                        dataPath:
                          (dataPath || "") + "/transmissionReduction/begin",
                        schemaPath: "PercentageRange#/properties/begin/minimum",
                        params: {
                          comparison: ">=",
                          limit: 0,
                          exclusive: false,
                        },
                        message: "should be >= 0",
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                  } else {
                    var err = {
                      keyword: "type",
                      dataPath:
                        (dataPath || "") + "/transmissionReduction/begin",
                      schemaPath: "PercentageRange#/properties/begin/type",
                      params: {
                        type: "number",
                      },
                      message: "should be number",
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid3 = errors === errs_3;
                }
                var data2 = data1.end;
                if (data2 === undefined) {
                  valid3 = false;
                  var err = {
                    keyword: "required",
                    dataPath: (dataPath || "") + "/transmissionReduction",
                    schemaPath: "PercentageRange#/required",
                    params: {
                      missingProperty: "end",
                    },
                    message: "should have required property 'end'",
                  };
                  if (vErrors === null) vErrors = [err];
                  else vErrors.push(err);
                  errors++;
                } else {
                  var errs_3 = errors;
                  if (typeof data2 === "number") {
                    if (data2 > 100 || data2 !== data2) {
                      var err = {
                        keyword: "maximum",
                        dataPath:
                          (dataPath || "") + "/transmissionReduction/end",
                        schemaPath: "PercentageRange#/properties/end/maximum",
                        params: {
                          comparison: "<=",
                          limit: 100,
                          exclusive: false,
                        },
                        message: "should be <= 100",
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                  } else {
                    var err = {
                      keyword: "type",
                      dataPath: (dataPath || "") + "/transmissionReduction/end",
                      schemaPath: "PercentageRange#/properties/end/type",
                      params: {
                        type: "number",
                      },
                      message: "should be number",
                    };
                    if (vErrors === null) vErrors = [err];
                    else vErrors.push(err);
                    errors++;
                  }
                  var valid3 = errors === errs_3;
                }
              } else {
                var err = {
                  keyword: "type",
                  dataPath: (dataPath || "") + "/transmissionReduction",
                  schemaPath: "PercentageRange#/type",
                  params: {
                    type: "object",
                  },
                  message: "should be object",
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              var valid2 = errors === errs_2;
              var valid1 = errors === errs_1;
            }
          } else {
            var err = {
              keyword: "type",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/type",
              params: {
                type: "object",
              },
              message: "should be object",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          validate.errors = vErrors;
          return errors === 0;
        };
      })();
      refVal1.schema = {
        $schema: "http://json-schema.org/draft-07/schema",
        $id: "MitigationInterval",
        title: "MitigationInterval",
        type: "object",
        additionalProperties: false,
        required: ["name", "color", "timeRange", "transmissionReduction"],
        properties: {
          name: {
            type: "string",
            minLength: 1,
          },
          color: {
            $ref: "ColorHex#",
          },
          timeRange: {
            $ref: "DateRange#",
          },
          transmissionReduction: {
            $ref: "PercentageRange#",
          },
        },
      };
      refVal1.errors = null;
      refVal[1] = refVal1;
      return function validate(
        data,
        dataPath,
        parentData,
        parentDataProperty,
        rootData
      ) {
        "use strict" /*# sourceURL=ScenarioDatumMitigation */;
        var vErrors = null;
        var errors = 0;
        if (rootData === undefined) rootData = data;
        if (data && typeof data === "object" && !Array.isArray(data)) {
          var errs__0 = errors;
          var valid1 = true;
          for (var key0 in data) {
            var isAdditional0 = !(false || key0 == "mitigationIntervals");
            if (isAdditional0) {
              valid1 = false;
              var err = {
                keyword: "additionalProperties",
                dataPath: (dataPath || "") + "",
                schemaPath: "#/additionalProperties",
                params: {
                  additionalProperty: "" + key0 + "",
                },
                message: "should NOT have additional properties",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
          }
          var data1 = data.mitigationIntervals;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "mitigationIntervals",
              },
              message: "should have required property 'mitigationIntervals'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            if (Array.isArray(data1)) {
              var errs__1 = errors;
              var valid1;
              for (var i1 = 0; i1 < data1.length; i1++) {
                var errs_2 = errors;
                if (
                  !refVal1(
                    data1[i1],
                    (dataPath || "") + "/mitigationIntervals/" + i1,
                    data1,
                    i1,
                    rootData
                  )
                ) {
                  if (vErrors === null) vErrors = refVal1.errors;
                  else vErrors = vErrors.concat(refVal1.errors);
                  errors = vErrors.length;
                }
                var valid2 = errors === errs_2;
              }
            } else {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/mitigationIntervals",
                schemaPath: "#/properties/mitigationIntervals/type",
                params: {
                  type: "array",
                },
                message: "should be array",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid1 = errors === errs_1;
          }
        } else {
          var err = {
            keyword: "type",
            dataPath: (dataPath || "") + "",
            schemaPath: "#/type",
            params: {
              type: "object",
            },
            message: "should be object",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        validate.errors = vErrors;
        return errors === 0;
      };
    })();
    refVal4.schema = {
      $schema: "http://json-schema.org/draft-07/schema",
      $id: "ScenarioDatumMitigation",
      title: "ScenarioDatumMitigation",
      type: "object",
      additionalProperties: false,
      required: ["mitigationIntervals"],
      properties: {
        mitigationIntervals: {
          type: "array",
          items: {
            $ref: "MitigationInterval#",
          },
        },
      },
    };
    refVal4.errors = null;
    refVal[4] = refVal4;
    return function validate(
      data,
      dataPath,
      parentData,
      parentDataProperty,
      rootData
    ) {
      "use strict" /*# sourceURL=ScenarioDatum */;
      var vErrors = null;
      var errors = 0;
      if (rootData === undefined) rootData = data;
      if (data && typeof data === "object" && !Array.isArray(data)) {
        var errs__0 = errors;
        var valid1 = true;
        for (var key0 in data) {
          var isAdditional0 = !(
            false ||
            key0 == "population" ||
            key0 == "epidemiological" ||
            key0 == "simulation" ||
            key0 == "mitigation"
          );
          if (isAdditional0) {
            valid1 = false;
            var err = {
              keyword: "additionalProperties",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/additionalProperties",
              params: {
                additionalProperty: "" + key0 + "",
              },
              message: "should NOT have additional properties",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
        }
        if (data.population === undefined) {
          valid1 = false;
          var err = {
            keyword: "required",
            dataPath: (dataPath || "") + "",
            schemaPath: "#/required",
            params: {
              missingProperty: "population",
            },
            message: "should have required property 'population'",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        } else {
          var errs_1 = errors;
          if (
            !refVal1(
              data.population,
              (dataPath || "") + "/population",
              data,
              "population",
              rootData
            )
          ) {
            if (vErrors === null) vErrors = refVal1.errors;
            else vErrors = vErrors.concat(refVal1.errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.epidemiological === undefined) {
          valid1 = false;
          var err = {
            keyword: "required",
            dataPath: (dataPath || "") + "",
            schemaPath: "#/required",
            params: {
              missingProperty: "epidemiological",
            },
            message: "should have required property 'epidemiological'",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        } else {
          var errs_1 = errors;
          if (
            !refVal2(
              data.epidemiological,
              (dataPath || "") + "/epidemiological",
              data,
              "epidemiological",
              rootData
            )
          ) {
            if (vErrors === null) vErrors = refVal2.errors;
            else vErrors = vErrors.concat(refVal2.errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.simulation === undefined) {
          valid1 = false;
          var err = {
            keyword: "required",
            dataPath: (dataPath || "") + "",
            schemaPath: "#/required",
            params: {
              missingProperty: "simulation",
            },
            message: "should have required property 'simulation'",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        } else {
          var errs_1 = errors;
          if (
            !refVal3(
              data.simulation,
              (dataPath || "") + "/simulation",
              data,
              "simulation",
              rootData
            )
          ) {
            if (vErrors === null) vErrors = refVal3.errors;
            else vErrors = vErrors.concat(refVal3.errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.mitigation === undefined) {
          valid1 = false;
          var err = {
            keyword: "required",
            dataPath: (dataPath || "") + "",
            schemaPath: "#/required",
            params: {
              missingProperty: "mitigation",
            },
            message: "should have required property 'mitigation'",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        } else {
          var errs_1 = errors;
          if (
            !refVal4(
              data.mitigation,
              (dataPath || "") + "/mitigation",
              data,
              "mitigation",
              rootData
            )
          ) {
            if (vErrors === null) vErrors = refVal4.errors;
            else vErrors = vErrors.concat(refVal4.errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
      } else {
        var err = {
          keyword: "type",
          dataPath: (dataPath || "") + "",
          schemaPath: "#/type",
          params: {
            type: "object",
          },
          message: "should be object",
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      }
      validate.errors = vErrors;
      return errors === 0;
    };
  })();
  refVal1.schema = {
    $schema: "http://json-schema.org/draft-07/schema",
    $id: "ScenarioDatum",
    title: "ScenarioDatum",
    type: "object",
    additionalProperties: false,
    required: ["population", "epidemiological", "simulation", "mitigation"],
    properties: {
      population: {
        $ref: "ScenarioDatumPopulation#",
      },
      epidemiological: {
        $ref: "ScenarioDatumEpidemiological#",
      },
      simulation: {
        $ref: "ScenarioDatumSimulation#",
      },
      mitigation: {
        $ref: "ScenarioDatumMitigation#",
      },
    },
  };
  refVal1.errors = null;
  refVal[1] = refVal1;
  return function validate(
    data,
    dataPath,
    parentData,
    parentDataProperty,
    rootData
  ) {
    "use strict" /*# sourceURL=ScenarioData */;
    var vErrors = null;
    var errors = 0;
    if (rootData === undefined) rootData = data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      var errs__0 = errors;
      var valid1 = true;
      for (var key0 in data) {
        var isAdditional0 = !(false || key0 == "name" || key0 == "data");
        if (isAdditional0) {
          valid1 = false;
          var err = {
            keyword: "additionalProperties",
            dataPath: (dataPath || "") + "",
            schemaPath: "#/additionalProperties",
            params: {
              additionalProperty: "" + key0 + "",
            },
            message: "should NOT have additional properties",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
      }
      var data1 = data.name;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: "required",
          dataPath: (dataPath || "") + "",
          schemaPath: "#/required",
          params: {
            missingProperty: "name",
          },
          message: "should have required property 'name'",
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if (typeof data1 === "string") {
          if (ucs2length(data1) < 1) {
            var err = {
              keyword: "minLength",
              dataPath: (dataPath || "") + "/name",
              schemaPath: "#/properties/name/minLength",
              params: {
                limit: 1,
              },
              message: "should NOT be shorter than 1 characters",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
        } else {
          var err = {
            keyword: "type",
            dataPath: (dataPath || "") + "/name",
            schemaPath: "#/properties/name/type",
            params: {
              type: "string",
            },
            message: "should be string",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid1 = errors === errs_1;
      }
      if (data.data === undefined) {
        valid1 = false;
        var err = {
          keyword: "required",
          dataPath: (dataPath || "") + "",
          schemaPath: "#/required",
          params: {
            missingProperty: "data",
          },
          message: "should have required property 'data'",
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if (
          !refVal1(
            data.data,
            (dataPath || "") + "/data",
            data,
            "data",
            rootData
          )
        ) {
          if (vErrors === null) vErrors = refVal1.errors;
          else vErrors = vErrors.concat(refVal1.errors);
          errors = vErrors.length;
        }
        var valid1 = errors === errs_1;
      }
    } else {
      var err = {
        keyword: "type",
        dataPath: (dataPath || "") + "",
        schemaPath: "#/type",
        params: {
          type: "object",
        },
        message: "should be object",
      };
      if (vErrors === null) vErrors = [err];
      else vErrors.push(err);
      errors++;
    }
    validate.errors = vErrors;
    return errors === 0;
  };
})();
validate.schema = {
  $schema: "http://json-schema.org/draft-07/schema",
  $id: "ScenarioData",
  title: "ScenarioData",
  type: "object",
  additionalProperties: false,
  required: ["name", "data"],
  properties: {
    name: {
      type: "string",
      minLength: 1,
    },
    data: {
      $ref: "ScenarioDatum#",
    },
  },
};
validate.errors = null;
module.exports = validate;

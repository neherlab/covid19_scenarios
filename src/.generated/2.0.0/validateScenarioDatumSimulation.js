"use strict";
var formats = require("ajv/lib/compile/formats")();
var validate = (function () {
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
            var isAdditional2 = !(false || key2 == "begin" || key2 == "end");
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
          if (((division3 = data1 / 1), division3 !== parseInt(division3))) {
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
              schemaPath: "#/properties/numberStochasticRuns/allOf/1/maximum",
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
              schemaPath: "#/properties/numberStochasticRuns/allOf/1/minimum",
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
validate.schema = {
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
validate.errors = null;
module.exports = validate;

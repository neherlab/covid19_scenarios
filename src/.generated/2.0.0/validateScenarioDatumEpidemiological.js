"use strict";
var validate = (function () {
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
            var isAdditional2 = !(false || key2 == "begin" || key2 == "end");
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
                schemaPath: "NumericRangeNonNegative#/properties/begin/type",
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
          if (((division3 = data1 / 1), division3 !== parseInt(division3))) {
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
validate.schema = {
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
validate.errors = null;
module.exports = validate;

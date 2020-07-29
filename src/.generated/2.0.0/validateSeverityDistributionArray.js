"use strict";
var ucs2length = require("ajv/lib/compile/ucs2length");
var equal = require("ajv/lib/compile/equal");
var validate = (function () {
  var refVal = [];
  var refVal1 = (function () {
    var refVal = [];
    var refVal1 = (function () {
      var refVal = [];
      var refVal1 = {
        $schema: "http://json-schema.org/draft-07/schema",
        $id: "AgeGroup",
        title: "AgeGroup",
        type: "string",
        enum: [
          "0-9",
          "10-19",
          "20-29",
          "30-39",
          "40-49",
          "50-59",
          "60-69",
          "70-79",
          "80+",
        ],
      };
      refVal[1] = refVal1;
      var refVal2 = {
        $schema: "http://json-schema.org/draft-07/schema",
        $id: "Percentage",
        title: "Percentage",
        type: "number",
        minimum: 0,
        maximum: 100,
      };
      refVal[2] = refVal2;
      return function validate(
        data,
        dataPath,
        parentData,
        parentDataProperty,
        rootData
      ) {
        "use strict" /*# sourceURL=SeverityDistributionDatum */;
        var vErrors = null;
        var errors = 0;
        if (data && typeof data === "object" && !Array.isArray(data)) {
          var errs__0 = errors;
          var valid1 = true;
          for (var key0 in data) {
            var isAdditional0 = !(
              false ||
              key0 == "ageGroup" ||
              key0 == "isolated" ||
              key0 == "confirmed" ||
              key0 == "severe" ||
              key0 == "critical" ||
              key0 == "fatal"
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
          var data1 = data.ageGroup;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "ageGroup",
              },
              message: "should have required property 'ageGroup'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            var errs_2 = errors;
            if (typeof data1 !== "string") {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/ageGroup",
                schemaPath: "AgeGroup#/type",
                params: {
                  type: "string",
                },
                message: "should be string",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var schema2 = refVal1.enum;
            var valid2;
            valid2 = false;
            for (var i2 = 0; i2 < schema2.length; i2++)
              if (equal(data1, schema2[i2])) {
                valid2 = true;
                break;
              }
            if (!valid2) {
              var err = {
                keyword: "enum",
                dataPath: (dataPath || "") + "/ageGroup",
                schemaPath: "AgeGroup#/enum",
                params: {
                  allowedValues: schema2,
                },
                message: "should be equal to one of the allowed values",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
            var valid1 = errors === errs_1;
          }
          var data1 = data.isolated;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "isolated",
              },
              message: "should have required property 'isolated'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            var errs_2 = errors;
            if (typeof data1 === "number") {
              if (data1 > 100 || data1 !== data1) {
                var err = {
                  keyword: "maximum",
                  dataPath: (dataPath || "") + "/isolated",
                  schemaPath: "Percentage#/maximum",
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
              if (data1 < 0 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/isolated",
                  schemaPath: "Percentage#/minimum",
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
                dataPath: (dataPath || "") + "/isolated",
                schemaPath: "Percentage#/type",
                params: {
                  type: "number",
                },
                message: "should be number",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
            var valid1 = errors === errs_1;
          }
          var data1 = data.confirmed;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "confirmed",
              },
              message: "should have required property 'confirmed'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            var errs_2 = errors;
            if (typeof data1 === "number") {
              if (data1 > 100 || data1 !== data1) {
                var err = {
                  keyword: "maximum",
                  dataPath: (dataPath || "") + "/confirmed",
                  schemaPath: "Percentage#/maximum",
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
              if (data1 < 0 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/confirmed",
                  schemaPath: "Percentage#/minimum",
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
                dataPath: (dataPath || "") + "/confirmed",
                schemaPath: "Percentage#/type",
                params: {
                  type: "number",
                },
                message: "should be number",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
            var valid1 = errors === errs_1;
          }
          var data1 = data.severe;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "severe",
              },
              message: "should have required property 'severe'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            var errs_2 = errors;
            if (typeof data1 === "number") {
              if (data1 > 100 || data1 !== data1) {
                var err = {
                  keyword: "maximum",
                  dataPath: (dataPath || "") + "/severe",
                  schemaPath: "Percentage#/maximum",
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
              if (data1 < 0 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/severe",
                  schemaPath: "Percentage#/minimum",
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
                dataPath: (dataPath || "") + "/severe",
                schemaPath: "Percentage#/type",
                params: {
                  type: "number",
                },
                message: "should be number",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
            var valid1 = errors === errs_1;
          }
          var data1 = data.critical;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "critical",
              },
              message: "should have required property 'critical'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            var errs_2 = errors;
            if (typeof data1 === "number") {
              if (data1 > 100 || data1 !== data1) {
                var err = {
                  keyword: "maximum",
                  dataPath: (dataPath || "") + "/critical",
                  schemaPath: "Percentage#/maximum",
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
              if (data1 < 0 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/critical",
                  schemaPath: "Percentage#/minimum",
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
                dataPath: (dataPath || "") + "/critical",
                schemaPath: "Percentage#/type",
                params: {
                  type: "number",
                },
                message: "should be number",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
            var valid1 = errors === errs_1;
          }
          var data1 = data.fatal;
          if (data1 === undefined) {
            valid1 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "",
              schemaPath: "#/required",
              params: {
                missingProperty: "fatal",
              },
              message: "should have required property 'fatal'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_1 = errors;
            var errs_2 = errors;
            if (typeof data1 === "number") {
              if (data1 > 100 || data1 !== data1) {
                var err = {
                  keyword: "maximum",
                  dataPath: (dataPath || "") + "/fatal",
                  schemaPath: "Percentage#/maximum",
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
              if (data1 < 0 || data1 !== data1) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/fatal",
                  schemaPath: "Percentage#/minimum",
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
                dataPath: (dataPath || "") + "/fatal",
                schemaPath: "Percentage#/type",
                params: {
                  type: "number",
                },
                message: "should be number",
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
      $id: "SeverityDistributionDatum",
      title: "SeverityDistributionDatum",
      additionalProperties: false,
      type: "object",
      required: [
        "ageGroup",
        "isolated",
        "confirmed",
        "severe",
        "critical",
        "fatal",
      ],
      properties: {
        ageGroup: {
          $ref: "AgeGroup#",
        },
        isolated: {
          $ref: "Percentage#",
        },
        confirmed: {
          $ref: "Percentage#",
        },
        severe: {
          $ref: "Percentage#",
        },
        critical: {
          $ref: "Percentage#",
        },
        fatal: {
          $ref: "Percentage#",
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
      "use strict" /*# sourceURL=SeverityDistributionData */;
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
        var data1 = data.data;
        if (data1 === undefined) {
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
          if (Array.isArray(data1)) {
            var errs__1 = errors;
            var valid1;
            for (var i1 = 0; i1 < data1.length; i1++) {
              var errs_2 = errors;
              if (
                !refVal1(
                  data1[i1],
                  (dataPath || "") + "/data/" + i1,
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
              dataPath: (dataPath || "") + "/data",
              schemaPath: "#/properties/data/type",
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
  refVal1.schema = {
    $schema: "http://json-schema.org/draft-07/schema",
    $id: "SeverityDistributionData",
    title: "SeverityDistributionData",
    type: "object",
    additionalProperties: false,
    required: ["name", "data"],
    properties: {
      name: {
        type: "string",
        minLength: 1,
      },
      data: {
        type: "array",
        items: {
          $ref: "SeverityDistributionDatum#",
        },
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
    "use strict" /*# sourceURL=SeverityDistributionArray */;
    var vErrors = null;
    var errors = 0;
    if (rootData === undefined) rootData = data;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      var errs__0 = errors;
      var valid1 = true;
      for (var key0 in data) {
        var isAdditional0 = !(false || key0 == "all");
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
      var data1 = data.all;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: "required",
          dataPath: (dataPath || "") + "",
          schemaPath: "#/required",
          params: {
            missingProperty: "all",
          },
          message: "should have required property 'all'",
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
                (dataPath || "") + "/all/" + i1,
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
            dataPath: (dataPath || "") + "/all",
            schemaPath: "#/properties/all/type",
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
validate.schema = {
  $schema: "http://json-schema.org/draft-07/schema",
  $id: "SeverityDistributionArray",
  title: "SeverityDistributionArray",
  type: "object",
  additionalProperties: false,
  required: ["all"],
  properties: {
    all: {
      type: "array",
      items: {
        $ref: "SeverityDistributionData#",
      },
    },
  },
};
validate.errors = null;
module.exports = validate;

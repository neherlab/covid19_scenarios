"use strict";
var formats = require("ajv/lib/compile/formats")();
var ucs2length = require("ajv/lib/compile/ucs2length");
var validate = (function () {
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
      "use strict" /*# sourceURL=CaseCountsDatum */;
      var vErrors = null;
      var errors = 0;
      if (data && typeof data === "object" && !Array.isArray(data)) {
        var errs__0 = errors;
        var valid1 = true;
        for (var key0 in data) {
          var isAdditional0 = !(
            false ||
            key0 == "time" ||
            key0 == "cases" ||
            key0 == "deaths" ||
            key0 == "hospitalized" ||
            key0 == "icu" ||
            key0 == "recovered"
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
        var data1 = data.time;
        if (data1 === undefined) {
          valid1 = false;
          var err = {
            keyword: "required",
            dataPath: (dataPath || "") + "",
            schemaPath: "#/required",
            params: {
              missingProperty: "time",
            },
            message: "should have required property 'time'",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        } else {
          var errs_1 = errors;
          if (typeof data1 === "string") {
            if (!formats.date.test(data1)) {
              var err = {
                keyword: "format",
                dataPath: (dataPath || "") + "/time",
                schemaPath: "#/properties/time/format",
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
              dataPath: (dataPath || "") + "/time",
              schemaPath: "#/properties/time/type",
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
        var data1 = data.cases;
        if (data1 === undefined) {
          valid1 = false;
          var err = {
            keyword: "required",
            dataPath: (dataPath || "") + "",
            schemaPath: "#/required",
            params: {
              missingProperty: "cases",
            },
            message: "should have required property 'cases'",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        } else {
          var errs_1 = errors;
          var errs__1 = errors;
          var valid1 = false;
          var errs_2 = errors;
          var errs_3 = errors;
          if (typeof data1 !== "number" || data1 % 1 || data1 !== data1) {
            var err = {
              keyword: "type",
              dataPath: (dataPath || "") + "/cases",
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
                dataPath: (dataPath || "") + "/cases",
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
                dataPath: (dataPath || "") + "/cases",
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
          valid1 = valid1 || valid2;
          if (!valid1) {
            var errs_2 = errors;
            if (data1 !== null) {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/cases",
                schemaPath: "#/properties/cases/anyOf/1/type",
                params: {
                  type: "null",
                },
                message: "should be null",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
            valid1 = valid1 || valid2;
          }
          if (!valid1) {
            var err = {
              keyword: "anyOf",
              dataPath: (dataPath || "") + "/cases",
              schemaPath: "#/properties/cases/anyOf",
              params: {},
              message: "should match some schema in anyOf",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            errors = errs__1;
            if (vErrors !== null) {
              if (errs__1) vErrors.length = errs__1;
              else vErrors = null;
            }
          }
          var valid1 = errors === errs_1;
        }
        var data1 = data.deaths;
        if (data1 !== undefined) {
          var errs_1 = errors;
          var errs__1 = errors;
          var valid1 = false;
          var errs_2 = errors;
          var errs_3 = errors;
          if (typeof data1 !== "number" || data1 % 1 || data1 !== data1) {
            var err = {
              keyword: "type",
              dataPath: (dataPath || "") + "/deaths",
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
                dataPath: (dataPath || "") + "/deaths",
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
                dataPath: (dataPath || "") + "/deaths",
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
          valid1 = valid1 || valid2;
          if (!valid1) {
            var errs_2 = errors;
            if (data1 !== null) {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/deaths",
                schemaPath: "#/properties/deaths/anyOf/1/type",
                params: {
                  type: "null",
                },
                message: "should be null",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
            valid1 = valid1 || valid2;
          }
          if (!valid1) {
            var err = {
              keyword: "anyOf",
              dataPath: (dataPath || "") + "/deaths",
              schemaPath: "#/properties/deaths/anyOf",
              params: {},
              message: "should match some schema in anyOf",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            errors = errs__1;
            if (vErrors !== null) {
              if (errs__1) vErrors.length = errs__1;
              else vErrors = null;
            }
          }
          var valid1 = errors === errs_1;
        }
        var data1 = data.hospitalized;
        if (data1 !== undefined) {
          var errs_1 = errors;
          var errs__1 = errors;
          var valid1 = false;
          var errs_2 = errors;
          var errs_3 = errors;
          if (typeof data1 !== "number" || data1 % 1 || data1 !== data1) {
            var err = {
              keyword: "type",
              dataPath: (dataPath || "") + "/hospitalized",
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
                dataPath: (dataPath || "") + "/hospitalized",
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
                dataPath: (dataPath || "") + "/hospitalized",
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
          valid1 = valid1 || valid2;
          if (!valid1) {
            var errs_2 = errors;
            if (data1 !== null) {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/hospitalized",
                schemaPath: "#/properties/hospitalized/anyOf/1/type",
                params: {
                  type: "null",
                },
                message: "should be null",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
            valid1 = valid1 || valid2;
          }
          if (!valid1) {
            var err = {
              keyword: "anyOf",
              dataPath: (dataPath || "") + "/hospitalized",
              schemaPath: "#/properties/hospitalized/anyOf",
              params: {},
              message: "should match some schema in anyOf",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            errors = errs__1;
            if (vErrors !== null) {
              if (errs__1) vErrors.length = errs__1;
              else vErrors = null;
            }
          }
          var valid1 = errors === errs_1;
        }
        var data1 = data.icu;
        if (data1 !== undefined) {
          var errs_1 = errors;
          var errs__1 = errors;
          var valid1 = false;
          var errs_2 = errors;
          var errs_3 = errors;
          if (typeof data1 !== "number" || data1 % 1 || data1 !== data1) {
            var err = {
              keyword: "type",
              dataPath: (dataPath || "") + "/icu",
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
                dataPath: (dataPath || "") + "/icu",
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
                dataPath: (dataPath || "") + "/icu",
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
          valid1 = valid1 || valid2;
          if (!valid1) {
            var errs_2 = errors;
            if (data1 !== null) {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/icu",
                schemaPath: "#/properties/icu/anyOf/1/type",
                params: {
                  type: "null",
                },
                message: "should be null",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
            valid1 = valid1 || valid2;
          }
          if (!valid1) {
            var err = {
              keyword: "anyOf",
              dataPath: (dataPath || "") + "/icu",
              schemaPath: "#/properties/icu/anyOf",
              params: {},
              message: "should match some schema in anyOf",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            errors = errs__1;
            if (vErrors !== null) {
              if (errs__1) vErrors.length = errs__1;
              else vErrors = null;
            }
          }
          var valid1 = errors === errs_1;
        }
        var data1 = data.recovered;
        if (data1 !== undefined) {
          var errs_1 = errors;
          var errs__1 = errors;
          var valid1 = false;
          var errs_2 = errors;
          var errs_3 = errors;
          if (typeof data1 !== "number" || data1 % 1 || data1 !== data1) {
            var err = {
              keyword: "type",
              dataPath: (dataPath || "") + "/recovered",
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
                dataPath: (dataPath || "") + "/recovered",
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
                dataPath: (dataPath || "") + "/recovered",
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
          valid1 = valid1 || valid2;
          if (!valid1) {
            var errs_2 = errors;
            if (data1 !== null) {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/recovered",
                schemaPath: "#/properties/recovered/anyOf/1/type",
                params: {
                  type: "null",
                },
                message: "should be null",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
            valid1 = valid1 || valid2;
          }
          if (!valid1) {
            var err = {
              keyword: "anyOf",
              dataPath: (dataPath || "") + "/recovered",
              schemaPath: "#/properties/recovered/anyOf",
              params: {},
              message: "should match some schema in anyOf",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            errors = errs__1;
            if (vErrors !== null) {
              if (errs__1) vErrors.length = errs__1;
              else vErrors = null;
            }
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
    $id: "CaseCountsDatum",
    title: "CaseCountsDatum",
    type: "object",
    additionalProperties: false,
    required: ["time", "cases"],
    properties: {
      time: {
        type: "string",
        format: "date",
      },
      cases: {
        anyOf: [
          {
            $ref: "IntegerNonNegative#",
          },
          {
            type: "null",
          },
        ],
      },
      deaths: {
        anyOf: [
          {
            $ref: "IntegerNonNegative#",
          },
          {
            type: "null",
          },
        ],
      },
      hospitalized: {
        anyOf: [
          {
            $ref: "IntegerNonNegative#",
          },
          {
            type: "null",
          },
        ],
      },
      icu: {
        anyOf: [
          {
            $ref: "IntegerNonNegative#",
          },
          {
            type: "null",
          },
        ],
      },
      recovered: {
        anyOf: [
          {
            $ref: "IntegerNonNegative#",
          },
          {
            type: "null",
          },
        ],
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
    "use strict" /*# sourceURL=CaseCountsData */;
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
validate.schema = {
  $schema: "http://json-schema.org/draft-07/schema",
  $id: "CaseCountsData",
  title: "CaseCountsData",
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
        $ref: "CaseCountsDatum#",
      },
    },
  },
};
validate.errors = null;
module.exports = validate;

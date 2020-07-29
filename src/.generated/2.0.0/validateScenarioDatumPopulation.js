"use strict";
var ucs2length = require("ajv/lib/compile/ucs2length");
var validate = (function () {
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
          if (((division2 = data1 / 1), division2 !== parseInt(division2))) {
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
          if (((division2 = data1 / 1), division2 !== parseInt(division2))) {
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
          if (((division2 = data1 / 1), division2 !== parseInt(division2))) {
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
          if (((division2 = data1 / 1), division2 !== parseInt(division2))) {
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
validate.schema = {
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
validate.errors = null;
module.exports = validate;

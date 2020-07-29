"use strict";
var equal = require("ajv/lib/compile/equal");
var validate = (function () {
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
    "use strict" /*# sourceURL=AgeDistributionDatum */;
    var vErrors = null;
    var errors = 0;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      var errs__0 = errors;
      var valid1 = true;
      for (var key0 in data) {
        var isAdditional0 = !(
          false ||
          key0 == "ageGroup" ||
          key0 == "population"
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
      var data1 = data.population;
      if (data1 === undefined) {
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
        var errs_2 = errors;
        if (typeof data1 !== "number" || data1 % 1 || data1 !== data1) {
          var err = {
            keyword: "type",
            dataPath: (dataPath || "") + "/population",
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
              dataPath: (dataPath || "") + "/population",
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
              dataPath: (dataPath || "") + "/population",
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
  $id: "AgeDistributionDatum",
  title: "AgeDistributionDatum",
  type: "object",
  additionalProperties: false,
  required: ["ageGroup", "population"],
  properties: {
    ageGroup: {
      $ref: "AgeGroup#",
    },
    population: {
      $ref: "IntegerNonNegative#",
    },
  },
};
validate.errors = null;
module.exports = validate;

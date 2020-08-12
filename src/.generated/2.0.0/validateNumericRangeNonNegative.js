"use strict";
var validate = (function () {
  var refVal = [];
  return function validate(
    data,
    dataPath,
    parentData,
    parentDataProperty,
    rootData
  ) {
    "use strict" /*# sourceURL=NumericRangeNonNegative */;
    var vErrors = null;
    var errors = 0;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      var errs__0 = errors;
      var valid1 = true;
      for (var key0 in data) {
        var isAdditional0 = !(false || key0 == "begin" || key0 == "end");
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
      var data1 = data.begin;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: "required",
          dataPath: (dataPath || "") + "",
          schemaPath: "#/required",
          params: {
            missingProperty: "begin",
          },
          message: "should have required property 'begin'",
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if (typeof data1 === "number") {
          var schema1 = data && data.end;
          if (
            (schema1 !== undefined && typeof schema1 != "number") ||
            data1 > schema1 ||
            data1 !== data1
          ) {
            var err = {
              keyword: "maximum",
              dataPath: (dataPath || "") + "/begin",
              schemaPath: "#/properties/begin/maximum",
              params: {
                comparison: "<=",
                limit: schema1,
                exclusive: false,
              },
              message: "should be <= " + schema1,
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          if (data1 < 0 || data1 !== data1) {
            var err = {
              keyword: "minimum",
              dataPath: (dataPath || "") + "/begin",
              schemaPath: "#/properties/begin/minimum",
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
            dataPath: (dataPath || "") + "/begin",
            schemaPath: "#/properties/begin/type",
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
      if (data.end === undefined) {
        valid1 = false;
        var err = {
          keyword: "required",
          dataPath: (dataPath || "") + "",
          schemaPath: "#/required",
          params: {
            missingProperty: "end",
          },
          message: "should have required property 'end'",
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        if (typeof data.end !== "number") {
          var err = {
            keyword: "type",
            dataPath: (dataPath || "") + "/end",
            schemaPath: "#/properties/end/type",
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
validate.errors = null;
module.exports = validate;

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
    "use strict" /*# sourceURL=IntegerNonNegative */;
    var vErrors = null;
    var errors = 0;
    if (typeof data !== "number" || data % 1 || data !== data) {
      var err = {
        keyword: "type",
        dataPath: (dataPath || "") + "",
        schemaPath: "#/type",
        params: {
          type: "integer",
        },
        message: "should be integer",
      };
      if (vErrors === null) vErrors = [err];
      else vErrors.push(err);
      errors++;
    }
    if (typeof data === "number") {
      if (data < 0 || data !== data) {
        var err = {
          keyword: "minimum",
          dataPath: (dataPath || "") + "",
          schemaPath: "#/minimum",
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
      var division0;
      if (((division0 = data / 1), division0 !== parseInt(division0))) {
        var err = {
          keyword: "multipleOf",
          dataPath: (dataPath || "") + "",
          schemaPath: "#/multipleOf",
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
    validate.errors = vErrors;
    return errors === 0;
  };
})();
validate.schema = {
  $schema: "http://json-schema.org/draft-07/schema",
  $id: "IntegerNonNegative",
  title: "IntegerNonNegative",
  type: "integer",
  multipleOf: 1,
  minimum: 0,
};
validate.errors = null;
module.exports = validate;

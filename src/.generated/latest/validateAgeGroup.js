"use strict";
var equal = require("ajv/lib/compile/equal");
var validate = (function () {
  var refVal = [];
  return function validate(
    data,
    dataPath,
    parentData,
    parentDataProperty,
    rootData
  ) {
    "use strict" /*# sourceURL=AgeGroup */;
    var vErrors = null;
    var errors = 0;
    if (typeof data !== "string") {
      var err = {
        keyword: "type",
        dataPath: (dataPath || "") + "",
        schemaPath: "#/type",
        params: {
          type: "string",
        },
        message: "should be string",
      };
      if (vErrors === null) vErrors = [err];
      else vErrors.push(err);
      errors++;
    }
    var schema0 = validate.schema.enum;
    var valid0;
    valid0 = false;
    for (var i0 = 0; i0 < schema0.length; i0++)
      if (equal(data, schema0[i0])) {
        valid0 = true;
        break;
      }
    if (!valid0) {
      var err = {
        keyword: "enum",
        dataPath: (dataPath || "") + "",
        schemaPath: "#/enum",
        params: {
          allowedValues: schema0,
        },
        message: "should be equal to one of the allowed values",
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
validate.errors = null;
module.exports = validate;

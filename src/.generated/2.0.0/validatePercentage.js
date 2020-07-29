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
    "use strict" /*# sourceURL=Percentage */;
    var vErrors = null;
    var errors = 0;
    if (typeof data === "number") {
      if (data > 100 || data !== data) {
        var err = {
          keyword: "maximum",
          dataPath: (dataPath || "") + "",
          schemaPath: "#/maximum",
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
    } else {
      var err = {
        keyword: "type",
        dataPath: (dataPath || "") + "",
        schemaPath: "#/type",
        params: {
          type: "number",
        },
        message: "should be number",
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
  $id: "Percentage",
  title: "Percentage",
  type: "number",
  minimum: 0,
  maximum: 100,
};
validate.errors = null;
module.exports = validate;

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
    "use strict" /*# sourceURL=_SchemaVer */;
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
    var schema0 = validate.schema.const;
    var valid0 = equal(data, schema0);
    if (!valid0) {
      var err = {
        keyword: "const",
        dataPath: (dataPath || "") + "",
        schemaPath: "#/const",
        params: {
          allowedValue: schema0,
        },
        message: "should be equal to constant",
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
  $id: "_SchemaVer",
  title: "_SchemaVer",
  type: "string",
  const: "2.0.0",
};
validate.errors = null;
module.exports = validate;

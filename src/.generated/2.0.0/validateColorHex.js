"use strict";
var validate = (function () {
  var pattern0 = new RegExp("^#(?:[0-9a-fA-F]{3}){1,2}$");
  var refVal = [];
  return function validate(
    data,
    dataPath,
    parentData,
    parentDataProperty,
    rootData
  ) {
    "use strict" /*# sourceURL=ColorHex */;
    var vErrors = null;
    var errors = 0;
    if (typeof data === "string") {
      if (!pattern0.test(data)) {
        var err = {
          keyword: "pattern",
          dataPath: (dataPath || "") + "",
          schemaPath: "#/pattern",
          params: {
            pattern: "^#(?:[0-9a-fA-F]{3}){1,2}$",
          },
          message: 'should match pattern "^#(?:[0-9a-fA-F]{3}){1,2}$"',
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
          type: "string",
        },
        message: "should be string",
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
  $id: "ColorHex",
  title: "ColorHex",
  type: "string",
  pattern: "^#(?:[0-9a-fA-F]{3}){1,2}$",
};
validate.errors = null;
module.exports = validate;

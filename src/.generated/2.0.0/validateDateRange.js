"use strict";
var formats = require("ajv/lib/compile/formats")();
var validate = (function () {
  var refVal = [];
  return function validate(
    data,
    dataPath,
    parentData,
    parentDataProperty,
    rootData
  ) {
    "use strict" /*# sourceURL=DateRange */;
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
        var errs__1 = errors,
          prevValid1 = false,
          valid1 = false,
          passingSchemas1 = null;
        var errs_2 = errors;
        if (typeof data1 === "string") {
          if (!formats.date.test(data1)) {
            var err = {
              keyword: "format",
              dataPath: (dataPath || "") + "/begin",
              schemaPath: "#/properties/begin/oneOf/0/format",
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
            dataPath: (dataPath || "") + "/begin",
            schemaPath: "#/properties/begin/oneOf/0/type",
            params: {
              type: "string",
            },
            message: "should be string",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid2 = errors === errs_2;
        if (valid2) {
          valid1 = prevValid1 = true;
          passingSchemas1 = 0;
        }
        var errs_2 = errors;
        if (typeof data1 === "string") {
          if (!formats["date-time"].test(data1)) {
            var err = {
              keyword: "format",
              dataPath: (dataPath || "") + "/begin",
              schemaPath: "#/properties/begin/oneOf/1/format",
              params: {
                format: "date-time",
              },
              message: 'should match format "date-time"',
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
        } else {
          var err = {
            keyword: "type",
            dataPath: (dataPath || "") + "/begin",
            schemaPath: "#/properties/begin/oneOf/1/type",
            params: {
              type: "string",
            },
            message: "should be string",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid2 = errors === errs_2;
        if (valid2 && prevValid1) {
          valid1 = false;
          passingSchemas1 = [passingSchemas1, 1];
        } else {
          if (valid2) {
            valid1 = prevValid1 = true;
            passingSchemas1 = 1;
          }
        }
        if (!valid1) {
          var err = {
            keyword: "oneOf",
            dataPath: (dataPath || "") + "/begin",
            schemaPath: "#/properties/begin/oneOf",
            params: {
              passingSchemas: passingSchemas1,
            },
            message: "should match exactly one schema in oneOf",
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
      var data1 = data.end;
      if (data1 === undefined) {
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
        var errs__1 = errors,
          prevValid1 = false,
          valid1 = false,
          passingSchemas1 = null;
        var errs_2 = errors;
        if (typeof data1 === "string") {
          if (!formats.date.test(data1)) {
            var err = {
              keyword: "format",
              dataPath: (dataPath || "") + "/end",
              schemaPath: "#/properties/end/oneOf/0/format",
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
            dataPath: (dataPath || "") + "/end",
            schemaPath: "#/properties/end/oneOf/0/type",
            params: {
              type: "string",
            },
            message: "should be string",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid2 = errors === errs_2;
        if (valid2) {
          valid1 = prevValid1 = true;
          passingSchemas1 = 0;
        }
        var errs_2 = errors;
        if (typeof data1 === "string") {
          if (!formats["date-time"].test(data1)) {
            var err = {
              keyword: "format",
              dataPath: (dataPath || "") + "/end",
              schemaPath: "#/properties/end/oneOf/1/format",
              params: {
                format: "date-time",
              },
              message: 'should match format "date-time"',
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
        } else {
          var err = {
            keyword: "type",
            dataPath: (dataPath || "") + "/end",
            schemaPath: "#/properties/end/oneOf/1/type",
            params: {
              type: "string",
            },
            message: "should be string",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid2 = errors === errs_2;
        if (valid2 && prevValid1) {
          valid1 = false;
          passingSchemas1 = [passingSchemas1, 1];
        } else {
          if (valid2) {
            valid1 = prevValid1 = true;
            passingSchemas1 = 1;
          }
        }
        if (!valid1) {
          var err = {
            keyword: "oneOf",
            dataPath: (dataPath || "") + "/end",
            schemaPath: "#/properties/end/oneOf",
            params: {
              passingSchemas: passingSchemas1,
            },
            message: "should match exactly one schema in oneOf",
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
validate.schema = {
  $schema: "http://json-schema.org/draft-07/schema",
  $id: "DateRange",
  title: "DateRange",
  type: "object",
  additionalProperties: false,
  required: ["begin", "end"],
  properties: {
    begin: {
      oneOf: [
        {
          type: "string",
          format: "date",
        },
        {
          type: "string",
          format: "date-time",
        },
      ],
      formatMaximum: {
        $data: "1/end",
      },
    },
    end: {
      oneOf: [
        {
          type: "string",
          format: "date",
        },
        {
          type: "string",
          format: "date-time",
        },
      ],
    },
  },
};
validate.errors = null;
module.exports = validate;

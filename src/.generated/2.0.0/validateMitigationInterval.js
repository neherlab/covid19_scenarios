"use strict";
var formats = require("ajv/lib/compile/formats")();
var ucs2length = require("ajv/lib/compile/ucs2length");
var validate = (function () {
  var pattern0 = new RegExp("^#(?:[0-9a-fA-F]{3}){1,2}$");
  var refVal = [];
  var refVal1 = {
    $schema: "http://json-schema.org/draft-07/schema",
    $id: "ColorHex",
    title: "ColorHex",
    type: "string",
    pattern: "^#(?:[0-9a-fA-F]{3}){1,2}$",
  };
  refVal[1] = refVal1;
  var refVal2 = {
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
  refVal[2] = refVal2;
  var refVal3 = {
    $schema: "http://json-schema.org/draft-07/schema",
    $id: "PercentageRange",
    title: "PercentageRange",
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
        maximum: 100,
      },
    },
  };
  refVal[3] = refVal3;
  return function validate(
    data,
    dataPath,
    parentData,
    parentDataProperty,
    rootData
  ) {
    "use strict" /*# sourceURL=MitigationInterval */;
    var vErrors = null;
    var errors = 0;
    if (data && typeof data === "object" && !Array.isArray(data)) {
      var errs__0 = errors;
      var valid1 = true;
      for (var key0 in data) {
        var isAdditional0 = !(
          false ||
          key0 == "name" ||
          key0 == "color" ||
          key0 == "timeRange" ||
          key0 == "transmissionReduction"
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
      var data1 = data.color;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: "required",
          dataPath: (dataPath || "") + "",
          schemaPath: "#/required",
          params: {
            missingProperty: "color",
          },
          message: "should have required property 'color'",
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        var errs_2 = errors;
        if (typeof data1 === "string") {
          if (!pattern0.test(data1)) {
            var err = {
              keyword: "pattern",
              dataPath: (dataPath || "") + "/color",
              schemaPath: "ColorHex#/pattern",
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
            dataPath: (dataPath || "") + "/color",
            schemaPath: "ColorHex#/type",
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
        var valid1 = errors === errs_1;
      }
      var data1 = data.timeRange;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: "required",
          dataPath: (dataPath || "") + "",
          schemaPath: "#/required",
          params: {
            missingProperty: "timeRange",
          },
          message: "should have required property 'timeRange'",
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        var errs_2 = errors;
        if (data1 && typeof data1 === "object" && !Array.isArray(data1)) {
          var errs__2 = errors;
          var valid3 = true;
          for (var key2 in data1) {
            var isAdditional2 = !(false || key2 == "begin" || key2 == "end");
            if (isAdditional2) {
              valid3 = false;
              var err = {
                keyword: "additionalProperties",
                dataPath: (dataPath || "") + "/timeRange",
                schemaPath: "DateRange#/additionalProperties",
                params: {
                  additionalProperty: "" + key2 + "",
                },
                message: "should NOT have additional properties",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
          }
          var data2 = data1.begin;
          if (data2 === undefined) {
            valid3 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "/timeRange",
              schemaPath: "DateRange#/required",
              params: {
                missingProperty: "begin",
              },
              message: "should have required property 'begin'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_3 = errors;
            var errs__3 = errors,
              prevValid3 = false,
              valid3 = false,
              passingSchemas3 = null;
            var errs_4 = errors;
            if (typeof data2 === "string") {
              if (!formats.date.test(data2)) {
                var err = {
                  keyword: "format",
                  dataPath: (dataPath || "") + "/timeRange/begin",
                  schemaPath: "DateRange#/properties/begin/oneOf/0/format",
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
                dataPath: (dataPath || "") + "/timeRange/begin",
                schemaPath: "DateRange#/properties/begin/oneOf/0/type",
                params: {
                  type: "string",
                },
                message: "should be string",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid4 = errors === errs_4;
            if (valid4) {
              valid3 = prevValid3 = true;
              passingSchemas3 = 0;
            }
            var errs_4 = errors;
            if (typeof data2 === "string") {
              if (!formats["date-time"].test(data2)) {
                var err = {
                  keyword: "format",
                  dataPath: (dataPath || "") + "/timeRange/begin",
                  schemaPath: "DateRange#/properties/begin/oneOf/1/format",
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
                dataPath: (dataPath || "") + "/timeRange/begin",
                schemaPath: "DateRange#/properties/begin/oneOf/1/type",
                params: {
                  type: "string",
                },
                message: "should be string",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid4 = errors === errs_4;
            if (valid4 && prevValid3) {
              valid3 = false;
              passingSchemas3 = [passingSchemas3, 1];
            } else {
              if (valid4) {
                valid3 = prevValid3 = true;
                passingSchemas3 = 1;
              }
            }
            if (!valid3) {
              var err = {
                keyword: "oneOf",
                dataPath: (dataPath || "") + "/timeRange/begin",
                schemaPath: "DateRange#/properties/begin/oneOf",
                params: {
                  passingSchemas: passingSchemas3,
                },
                message: "should match exactly one schema in oneOf",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            } else {
              errors = errs__3;
              if (vErrors !== null) {
                if (errs__3) vErrors.length = errs__3;
                else vErrors = null;
              }
            }
            var valid3 = errors === errs_3;
          }
          var data2 = data1.end;
          if (data2 === undefined) {
            valid3 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "/timeRange",
              schemaPath: "DateRange#/required",
              params: {
                missingProperty: "end",
              },
              message: "should have required property 'end'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_3 = errors;
            var errs__3 = errors,
              prevValid3 = false,
              valid3 = false,
              passingSchemas3 = null;
            var errs_4 = errors;
            if (typeof data2 === "string") {
              if (!formats.date.test(data2)) {
                var err = {
                  keyword: "format",
                  dataPath: (dataPath || "") + "/timeRange/end",
                  schemaPath: "DateRange#/properties/end/oneOf/0/format",
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
                dataPath: (dataPath || "") + "/timeRange/end",
                schemaPath: "DateRange#/properties/end/oneOf/0/type",
                params: {
                  type: "string",
                },
                message: "should be string",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid4 = errors === errs_4;
            if (valid4) {
              valid3 = prevValid3 = true;
              passingSchemas3 = 0;
            }
            var errs_4 = errors;
            if (typeof data2 === "string") {
              if (!formats["date-time"].test(data2)) {
                var err = {
                  keyword: "format",
                  dataPath: (dataPath || "") + "/timeRange/end",
                  schemaPath: "DateRange#/properties/end/oneOf/1/format",
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
                dataPath: (dataPath || "") + "/timeRange/end",
                schemaPath: "DateRange#/properties/end/oneOf/1/type",
                params: {
                  type: "string",
                },
                message: "should be string",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid4 = errors === errs_4;
            if (valid4 && prevValid3) {
              valid3 = false;
              passingSchemas3 = [passingSchemas3, 1];
            } else {
              if (valid4) {
                valid3 = prevValid3 = true;
                passingSchemas3 = 1;
              }
            }
            if (!valid3) {
              var err = {
                keyword: "oneOf",
                dataPath: (dataPath || "") + "/timeRange/end",
                schemaPath: "DateRange#/properties/end/oneOf",
                params: {
                  passingSchemas: passingSchemas3,
                },
                message: "should match exactly one schema in oneOf",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            } else {
              errors = errs__3;
              if (vErrors !== null) {
                if (errs__3) vErrors.length = errs__3;
                else vErrors = null;
              }
            }
            var valid3 = errors === errs_3;
          }
        } else {
          var err = {
            keyword: "type",
            dataPath: (dataPath || "") + "/timeRange",
            schemaPath: "DateRange#/type",
            params: {
              type: "object",
            },
            message: "should be object",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
        var valid2 = errors === errs_2;
        var valid1 = errors === errs_1;
      }
      var data1 = data.transmissionReduction;
      if (data1 === undefined) {
        valid1 = false;
        var err = {
          keyword: "required",
          dataPath: (dataPath || "") + "",
          schemaPath: "#/required",
          params: {
            missingProperty: "transmissionReduction",
          },
          message: "should have required property 'transmissionReduction'",
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      } else {
        var errs_1 = errors;
        var errs_2 = errors;
        if (data1 && typeof data1 === "object" && !Array.isArray(data1)) {
          var errs__2 = errors;
          var valid3 = true;
          for (var key2 in data1) {
            var isAdditional2 = !(false || key2 == "begin" || key2 == "end");
            if (isAdditional2) {
              valid3 = false;
              var err = {
                keyword: "additionalProperties",
                dataPath: (dataPath || "") + "/transmissionReduction",
                schemaPath: "PercentageRange#/additionalProperties",
                params: {
                  additionalProperty: "" + key2 + "",
                },
                message: "should NOT have additional properties",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
          }
          var data2 = data1.begin;
          if (data2 === undefined) {
            valid3 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "/transmissionReduction",
              schemaPath: "PercentageRange#/required",
              params: {
                missingProperty: "begin",
              },
              message: "should have required property 'begin'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_3 = errors;
            if (typeof data2 === "number") {
              var schema3 = data1 && data1.end;
              if (
                (schema3 !== undefined && typeof schema3 != "number") ||
                data2 > schema3 ||
                data2 !== data2
              ) {
                var err = {
                  keyword: "maximum",
                  dataPath: (dataPath || "") + "/transmissionReduction/begin",
                  schemaPath: "PercentageRange#/properties/begin/maximum",
                  params: {
                    comparison: "<=",
                    limit: schema3,
                    exclusive: false,
                  },
                  message: "should be <= " + schema3,
                };
                if (vErrors === null) vErrors = [err];
                else vErrors.push(err);
                errors++;
              }
              if (data2 < 0 || data2 !== data2) {
                var err = {
                  keyword: "minimum",
                  dataPath: (dataPath || "") + "/transmissionReduction/begin",
                  schemaPath: "PercentageRange#/properties/begin/minimum",
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
                dataPath: (dataPath || "") + "/transmissionReduction/begin",
                schemaPath: "PercentageRange#/properties/begin/type",
                params: {
                  type: "number",
                },
                message: "should be number",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid3 = errors === errs_3;
          }
          var data2 = data1.end;
          if (data2 === undefined) {
            valid3 = false;
            var err = {
              keyword: "required",
              dataPath: (dataPath || "") + "/transmissionReduction",
              schemaPath: "PercentageRange#/required",
              params: {
                missingProperty: "end",
              },
              message: "should have required property 'end'",
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            var errs_3 = errors;
            if (typeof data2 === "number") {
              if (data2 > 100 || data2 !== data2) {
                var err = {
                  keyword: "maximum",
                  dataPath: (dataPath || "") + "/transmissionReduction/end",
                  schemaPath: "PercentageRange#/properties/end/maximum",
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
            } else {
              var err = {
                keyword: "type",
                dataPath: (dataPath || "") + "/transmissionReduction/end",
                schemaPath: "PercentageRange#/properties/end/type",
                params: {
                  type: "number",
                },
                message: "should be number",
              };
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid3 = errors === errs_3;
          }
        } else {
          var err = {
            keyword: "type",
            dataPath: (dataPath || "") + "/transmissionReduction",
            schemaPath: "PercentageRange#/type",
            params: {
              type: "object",
            },
            message: "should be object",
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
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
  $id: "MitigationInterval",
  title: "MitigationInterval",
  type: "object",
  additionalProperties: false,
  required: ["name", "color", "timeRange", "transmissionReduction"],
  properties: {
    name: {
      type: "string",
      minLength: 1,
    },
    color: {
      $ref: "ColorHex#",
    },
    timeRange: {
      $ref: "DateRange#",
    },
    transmissionReduction: {
      $ref: "PercentageRange#",
    },
  },
};
validate.errors = null;
module.exports = validate;

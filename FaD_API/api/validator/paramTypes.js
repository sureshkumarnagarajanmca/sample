/* */
function param(ptype, name, description, type, required, allowableValuesEnum, defaultValue) {
  var p = {
    "name": name,
    "description": description,
    "type": type,
    "required": required,
    "defaultValue": defaultValue,
    "default": defaultValue,
    "paramType": ptype
  };
  if (allowableValuesEnum) {
    p.enum = allowableValuesEnum;
  }
  return p;
}
exports.query = exports.q = function(name, description, type, required, allowableValuesEnum, defaultValue) {
  return param("query", name, description, type, required, allowableValuesEnum, defaultValue);
};

exports.path = function(name, description, type, required, allowableValuesEnum, defaultValue) {
  return param("path", name, description, type, required, allowableValuesEnum, defaultValue);
};

exports.body = function(name, description, type, required, defaultValue) {
  return param("body", name, description, type, required, null, defaultValue);
};

exports.form = function(name, description, type, required, allowableValuesEnum, defaultValue) {
  return param("form", name, description, type, required, allowableValuesEnum, defaultValue);
};

exports.header = function(name, description, type, required) {
  var p = param("header", name, description, type, required);
  p.allowMultiple = false;
  return p;
};
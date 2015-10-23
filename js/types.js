/*** 
 types.js
 ***/

define(function(  ) {
  var exports = {};


  exports.regex = {
    'float' : /^[-+]?[0-9]*\.?[0-9]+$/g,
    'integer' : /^[-+]?[0-9]+$/g,
    'image' : /\.(jpeg|jpg|tiff|gif|png|webp|svg)$/g,
    'link' : /^https?\:\/\//g
  };

  exports.separators = {
    "COMMA":/\s*\,\s*/g,
    "SEMICOLON":/\s*\;\s*/g,
    "TAB":/\t/g
  };

	return exports;
});
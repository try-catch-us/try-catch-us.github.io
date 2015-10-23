/*** 
 csv.js
 ***/

define(['types'], function( types ) {
  var exports = {};
  var data = [];


      // recognize integers and floats. Other strings are returned as they are
      function typedValue( value ){
        var typedValue;

        if (!value || !value.match) typedValue = value; // just to avoid bugs
        else if (value.match( types.regex.integer )) typedValue = parseInt(value,10);
        else if (value.match( types.regex.float )) typedValue = parseFloat(value);
        else typedValue = value;

        return typedValue;
      }

      // read csv text
      // Fill the data Array[] of read data{}.
      // The data.schema property gives the schema
      exports.fetch = function ( csvData, separator ){
        var lines = csvData.split("\n");
        var schema = [];
        

        /* build schema from first line */
        var fields = lines[0].split( types.separators[separator] );
        $(fields).each(
          function(index,value){
            schema.push( {name:value} );
        });

        /* build data from the other lines*/
        data=[];
        $(lines.slice(1)).each(
          function(index,line){
            var dataObj = {};

            $(line.split(types.separators[separator])).each(
              function(index,value){
                dataObj[ fields[index] ] = typedValue(value);
              } );
            data.push( dataObj );
          });

        data.schema = schema; // attach schema to data
        data.specificColumns = {};
      }

      exports.data = function(){return data;}
      exports.clear = function(){data=[];}

	return exports;
});
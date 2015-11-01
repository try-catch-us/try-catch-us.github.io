/*** 
 csv.js
 ***/

define(['types'], function( types ) {
  var exports = {};
  var data = [];


      // recognize integers and floats. Other strings are returned as they are
      function typedValue( value ){
        var result;

        if (!value || !value.match) {result = value;} // just to avoid bugs
        else if (value.match( types.regex.integer )) {result = parseInt(value,10);}
        else if (value.match( types.regex.float )) {result = parseFloat(value);}
        else {result = value;}

        return result;
      }

        // returns a HTMLTableCellElement from the data value (accepts rich content)
      exports.tableCell = function(content){
        var $td = $("<td></td>");

        if (content.match && content.match(types.regex.image)) { //image
          $td.append( $("<img class='img-thumbnail img-responsive' src='"+content+"'/>")
                    .css({maxWidth:'200px'})
                    );
        }
        else if (content.match && content.match(types.regex.link)) { //link
          $td.append( $("<a href='"+content+"' target='_blank'>visit</a>"));
        }
        else $td.text( content );
        return $td;
      };
      
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
      };

      // returns fetched data
      exports.data = function(){return data;};

      // define a fieldname as a specific column : longitude, latitude,label or description
      exports.specificColumn = function( type, fieldname ){ 
               data.specificColumns[type] = fieldname;
             };

      // returns thhe list of specific columns
      exports.specificColumns = function(  ){
               return data.specificColumns;
             };

      // clear all data
      exports.clear = function(){data=[];};

	return exports;
});
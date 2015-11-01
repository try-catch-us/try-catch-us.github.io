/*** 
 bootable.js
  is a table component created with bootstrap

	features : 
	 - table is build from data array and schema
	 - data may countain : integers, floats, text, url, images,...
	 - table is full width and responsive
	 - sort by any column
	 - select/unselect any row
	 - you can choose a column a label, description, longitude and latitude 
 ***/

define(['types','csv'], function( types, csv ) {

    // $table is a HTMLTableElement
    //  Fill the table with the data and adds all controls
	function constructor( $table, data ){
        var $body = $table.find("tbody").html("");
        var $header = $("<tr></tr>");

        if (!$table.data("bootable-initialized")) {initialize( $table );}
        // build table header and dropdowns
        $table.find("thead").html("").append($header);
        $header.append( $("<th title='Show/hide markers'><input type='checkbox' checked data-role='selectAll' /></th>") );
        $(data.schema).each(
           function(index,element){
            var $th=$("<th class='dropdown'></th>").data("name",element.name);
            $th.prepend( $("<ul class='dropdown-menu'>"+
                "<li><a href='javascript:void(0);' data-role='setLongitude'>Set as Longitude</a></li>"+
                "<li><a href='javascript:void(0);' data-role='setLatitude'>Set as Latitude</a></li>"+
                "<li><a href='javascript:void(0);' data-role='setDescription'>Set as Description</a></li>"+
                "<li><a href='javascript:void(0);' data-role='setLabel'>Set as Marker Label</a></li>"+
                "<li><a href='javascript:void(0);' data-role='sortAsc'>Sort ascending <i class='fa fa-long-arrow-up'></i></a></li>"+
                "<li><a href='javascript:void(0);' data-role='sortDesc'>Sort descending <i class='fa fa-long-arrow-down'></i></a></li>"+
                "</ul>") );
            $th.prepend( $("<a href='javascript:void(0);' data-toggle='dropdown' data-name='"+element.name+"' class='dropdown-toggle'></a>").text(element.name).append("<span class='caret'></span>") );
            $header.append( $th );
           }); 

        //last dropdown aligned right to avoid modal overflow
        $header.find("th:last ul.dropdown-menu").addClass("dropdown-menu-right");

        // fill data
        $(data).each(
          function(id,record){
              var $tr;

              $body.append( $tr = $("<tr class='text-muted'></tr>").data("data",record) );
              $tr.append( selectionCell( id ) );
              $(data.schema).each(
                 function(index,field){
                  $tr.append( csv.tableCell( record[field.name] ) );
                 });
          });
        return {
        	selectedData:function(){return $.map( $table.find("tbody [data-role='selectRow']:checked").parents("tr") , function(e){return $(e).data("data");});},
        	columns: function(){return data.specificColumns; },
        	clear: function(){$table.find("tbody,thead").html(""); }
        };


	      	// create the necessary delegated events for the table.
	      	// This is done once, Even if the table is refield with data.
	      function initialize( $table ){
	        $table
	          .on("click","a[data-role='setLongitude']", function(){csv.specificColumn('longitude', $(this).parents("th").data("name"));} )
	          .on("click","a[data-role='setLatitude']", function(){csv.specificColumn('latitude', $(this).parents("th").data("name"));} )
	          .on("click","a[data-role='setLabel']", function(){csv.specificColumn('label', $(this).parents("th").data("name"));} )
	          .on("click","a[data-role='setDescription']", function(){csv.specificColumn('description',$(this).parents("th").data("name"));} )
	          .on("click","a[data-role='sortAsc']", function(){sortTable($table,$(this).parents("th").data("name"), +1 );} )
	          .on("click","a[data-role='sortDesc']", function(){sortTable($table,$(this).parents("th").data("name"), -1 );} )
	          .on("click","[data-role='selectRow']", function(){
	                                                  if ($(this).prop("checked")) {$(this).parents('tr').removeClass('warning');}
	                                                  else {$(this).parents('tr').addClass('warning');}
	                                                })
	          .on("click","[data-role='selectAll']", function(){SelectTableRows($(this).parents('table'),$(this).prop("checked"));})
	          .data("bootable-initialized", true );
	      }


      }

      function selectionCell(id){
        var $td = $("<td></td>");
        $td.append( $("<input type='checkbox' checked data-role='selectRow'/>").data("id",id) );

        return $td;
      }

      // sort a table element ASC againt a data field
      // dir is +1 for ascending and -1 for descending
      function sortTable( $srcElement, fieldName, dir ){
        var $body = $srcElement.find("tbody");

        // collect data
        var data = $body.find("tr").toArray();

        //sort data
        data.sort( function(a,b){
          return (dir>0) ? ($(a).data("data")[fieldName] > $(b).data("data")[fieldName]) : ($(a).data("data")[fieldName] < $(b).data("data")[fieldName]);
        });

        // rearrange table
        $(data).each( 
            function(index,$element){
              $body.append( $element );
            });

        return;
      }

      // select all table rows if checked=true
      // unselect all table rows if checked=false
      function SelectTableRows($srcElement, checked){
        $srcElement.find("tbody tr").each(
          function(){
            if (checked){
              $(this).removeClass("warning").find("td:first input").prop("checked",true);
            }
            else{
              $(this).addClass("warning").find("td:first input").prop("checked",false);
            }
          });
      }

	return constructor;
});
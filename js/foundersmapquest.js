(function(){

    var defaultLocation = {lat:36.776171,lng:3.058329}; // Place Emir Abdelkader, Alger
    var map;
    var markers=[];
    var infoWindows=[];
    var data =[];

    /* regular expressions */
    var separatorRegexp = {"COMMA":/\s*\,\s*/g, "SEMICOLON":/\s*\;\s*/g,"TAB":/\t/g};
    var floatRegexp = /^[-+]?[0-9]*\.?[0-9]+$/g;
    var integerRegexp = /^[-+]?[0-9]+$/g;
    var imageRegexp = /\.(jpeg|jpg|tiff|gif|png|webp|svg)$/g;
    var linkRegexp = /^https?\:\/\//g;


    // All HTML initialization /events configuration of the page
    function navInitialization(){
        // sidebar menu
        $("#menu-toggle,#menu-close").click(function(e) {
            e.preventDefault();
            $("#sidebar-wrapper").toggleClass("active");
        });

         // Scrolls to menu item 
            $('a[href*=#]:not([href=#])').click(function() {
                if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {

                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    if (target.length) {
                        $('html,body').animate({
                            scrollTop: target.offset().top
                        }, 1000);
                        return false;
                    }
                }
            });

        $("[data-toggle='tooltip']").tooltip();
        $("#fetchDataBtn").click( openFetchDataModal );
        $("#visualizeDataBtn").click( openVisualizeDataModal );
        $("#removeDataBtn").click( removeData );
        $("#showDataOnMap").click( function(){showDataOnMap($("#dataVisualizationTable"));} );
        $("#fetchDataOKBtn").click( function(){
            $("#fetchDataOKBtn").button('processing');
            data = fetchData($("#fetchDataModalElement"), $("#separator").val());
            buildDataVisualization( $("#dataVisualizationTable") );
            $("#fetchDataOKBtn").button("reset");
            $("#fetchDataModal").modal("hide");
            $("#visualizeDataBtn").removeClass('disabled');
            $("#visualizeDataModal").modal("show");       
          } );
        $("#dataVisualizationTable")
          .on("click","a[data-role='setLongitude']", function(){data.specificColumns.longitude=$(this).parents("th").data("name");} )
          .on("click","a[data-role='setLatitude']", function(){data.specificColumns.latitude=$(this).parents("th").data("name");} )
          .on("click","a[data-role='setLabel']", function(){data.specificColumns.label=$(this).parents("th").data("name");} )
          .on("click","a[data-role='setDescription']", function(){data.specificColumns.description=$(this).parents("th").data("name");} )
          .on("click","a[data-role='sortAsc']", function(){sortTable($("#dataVisualizationTable"),$(this).parents("th").data("name"), +1 );} )
          .on("click","a[data-role='sortDesc']", function(){sortTable($("#dataVisualizationTable"),$(this).parents("th").data("name"), -1 );} )
          .on("click","[data-role='selectRow']", function(){
                                                  if ($(this).prop("checked")) $(this).parents('tr').removeClass('warning');
                                                  else $(this).parents('tr').addClass('warning');
                                                })
          .on("click","[data-role='selectAll']", function(){
                                                  SelectTableRows($(this).parents('table'),$(this).prop("checked"));
                                                })


        $("#fetchDataModal").on("shown.bs.modal",function(){
          $(this).find("textarea").val("").focus();
          $("#separator").val("COMMA");
          $("#fetchDataOKBtn").button('reset');
        });
    }


      /** We overwrite confirm function for a non blocking modal confirmation */ 
      var confirmInitialized = false;
      function confirm(message){
        var yes = function(){}, no = function(){};

        if (!confirmInitialized) {
          $("#confirmCancelBtn").click( function(){ closed=true; $("#confirmModal").modal("hide"); no(); } );
          $("#confirmOKBtn").click( function(){ closed=true; $("#confirmModal").modal("hide"); yes(); }) ;
          confirmInitialized = true;
        }
        $("#confirmModal .modal-body").html(message || "");
        $("#confirmModal").modal("show");
        return {
          yes:function(e){yes=e; return this;},
          no:function(e){no=e; return this;}
        }

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

      // recognize integers and floats. Other strings are returned as they are
      function typedValue( value ){
        var typedValue;

        if (!value || !value.match) typedValue = value; // just to avoid bugs
        else if (value.match( integerRegexp )) typedValue = parseInt(value,10);
        else if (value.match( floatRegexp )) typedValue = parseFloat(value);
        else typedValue = value;

        return typedValue;
      }

      function addMapControls(map,$ctrls){
        $ctrls.each(
            function(){
                map.controls[ $(this).data("position") || google.maps.ControlPosition.TOP_LEFT].push( $(this).get(0));
            });
      }

      function openFetchDataModal(){
        if(data.length) {
          confirm("Data available. Would you remove current data?")
            .yes(function(){removeData();$("#fetchDataModal").modal("show");})
            .no(openVisualizeDataModal); // show current data
        }
        else $("#fetchDataModal").modal("show");
      }

      function fetchData( $srcElement, separator ){
        var lines = $srcElement.val().trim().split("\n");
        var schema = [];
        var data=[];

        /* build schema */
        var fields = lines[0].split( separatorRegexp[separator] );
        $(fields).each(
          function(index,value){
            schema.push( {name:value} );
        });

        /* build data */
        $(lines.slice(1)).each(
          function(index,line){
            var dataObj = {};

            $(line.split(separatorRegexp[separator])).each(
              function(index,value){
                dataObj[ fields[index] ] = typedValue(value);
              } );
            data.push( dataObj );
          });

        data.schema = schema; // attach schema to data
        data.specificColumns = {};
        return data;
      }

      function buildDataVisualization( $destElement ){
        var $body = $destElement.find("tbody").html("");
        var $header = $("<tr></tr>");

        // build table header and dropdowns
        $destElement.find("thead").html("").append($header);
        $header.append( $("<th title='Show/hide markers'><input type='checkbox' checked data-role='selectAll' /></th>") );
        $(data.schema).each(
           function(index,element){
            var $th=$("<th class='dropdown'></th>").data("name",element.name);
            $th.prepend( $("<ul class='dropdown-menu'>"
                +"<li><a href='javascript:void(0);' data-role='setLongitude'>Set as Longitude</a></li>"
                +"<li><a href='javascript:void(0);' data-role='setLatitude'>Set as Latitude</a></li>"
                +"<li><a href='javascript:void(0);' data-role='setDescription'>Set as Description</a></li>"
                +"<li><a href='javascript:void(0);' data-role='setLabel'>Set as Marker Label</a></li>"
                +"<li><a href='javascript:void(0);' data-role='sortAsc'>Sort ascending <i class='fa fa-long-arrow-up'></i></a></li>"
                +"<li><a href='javascript:void(0);' data-role='sortDesc'>Sort descending <i class='fa fa-long-arrow-down'></i></a></li>"
                +"</ul>") )
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
              $tr.append( buildSelectionCell( id ) );
              $(data.schema).each(
                 function(index,field){
                  $tr.append( buildTableCell( record[field.name] ) );
                 });
              ;
          });
      }

      function buildTableCell(data){
        var $td = $("<td></td>")

        if (data.match && data.match(imageRegexp)) { //image
          $td.append( $("<img class='img-thumbnail img-responsive' src='"+data+"'/>"));
        }
        else if (data.match && data.match(linkRegexp)) { //link
          $td.append( $("<a href='"+data+"' target='_blank'>visit</a>"));
        }
        else $td.text( data );
        return $td;
      }

      function buildSelectionCell(id){
        var $td = $("<td></td>")
        $td.append( $("<input type='checkbox' checked data-role='selectRow'/>").data("id",id) );

        return $td;
      }

      function showDataOnMap( $srcElement ){
        var bounds = new google.maps.LatLngBounds();
        var $rows = $srcElement.find("tbody [data-role='selectRow']:checked").parents("tr");

        if (!$rows.length) {
          alert("No data to display.");
          return;
        }

        if (!data.specificColumns.longitude || !data.specificColumns.latitude) {
          alert("You should specify Longitude and Latitude columns.");
          return;
        }

        $("#visualizeDataModal").modal("hide");        
        clearMarkers();
        
        $rows.each(
          function(){
            var dataTR = $(this).data("data");
            var description = dataTR[ data.specificColumns.description ];
            var label = dataTR[ data.specificColumns.label ];
            var icon = label ?  new google.maps.MarkerImage(
        "http://chart.googleapis.com/chart?chst=d_bubble_text_small_withshadow&chld=bb|" + encodeURIComponent(label) + "|3377BB|FFFFFF",
        null, null, new google.maps.Point(0, 42)) : null;
            var position = new google.maps.LatLng(dataTR[ data.specificColumns.latitude ],dataTR[ data.specificColumns.longitude ]);
            var marker = new google.maps.Marker({
              position:position,
              icon: icon,
              map: map
            });
            var infoWindow = description ? new google.maps.InfoWindow({content:description}) : null;

            bounds.extend(position);

            marker.setVisible(true);
            if (infoWindow) {
              marker.addListener('click', function() {infoWindow.open(map, marker);});
              infoWindow.open(map,marker);
              infoWindows.push( infoWindow ); // All infoWindows initialy opened
            }
            markers.push( marker );
          });
        map.fitBounds(bounds);
      }

      function clearMarkers(){
        $.each( infoWindows,
          function(index,infoWindow){
            infoWindow.close();
          });
        infoWindows = [];

        $.each(markers,
          function(index,marker){
            marker.setVisible(false);
            marker.setMap(null);
          });
        markers=[];
      }

      function openVisualizeDataModal(){
        if (data.length) $("#visualizeDataModal").modal("show");
      }

      function removeData(){
        data =[];
        $("#visualizeDataBtn").addClass('disabled');
        clearMarkers();
      }

      /**** Initialization ****/
      $(function(){
        navInitialization();
        map = new google.maps.Map($("#map").get(0), {
                    center: defaultLocation,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: true,
                    zoom: 13,
                    draggable: true,
                    noClear: true
                 });
        addMapControls(map, $("[data-role='map-ctrl']"));
      });

})();
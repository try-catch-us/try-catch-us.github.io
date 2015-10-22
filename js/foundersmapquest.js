(function(){

    var defaultLocation = {lat:36.776171,lng:3.058329}; // Place Emir Abdelkader, Alger
    var map;
    var markers=[];
    var schema = [];
    var data =[];
    var separatorRegexp = {"COMMA":/\s*\,\s*/g, "SEMICOLON":/\s*\;\s*/g,"TAB":/\t/g}
        // sidebar menu
        $("#menu-toggle,#menu-close").click(function(e) {
            e.preventDefault();
            $("#sidebar-wrapper").toggleClass("active");
        });

        $(function() { // Scrolls to menu item 
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
        });


      /** We overwrite confirm function for a non blocking modal confirmation */ 
      var confirmInitialised = false;
      function confirm(message){
        var yes = function(){}, no = function(){};

        if (!confirmInitialised) {
          $("#confirmCancelBtn").click( function(){ closed=true; $("#confirmModal").modal("hide"); no(); } );
          $("#confirmOKBtn").click( function(){ closed=true; $("#confirmModal").modal("hide"); yes(); }) ;
          confirmInitialised = true;
        }
        $("#confirmModal .modal-body").html(message || "");
        $("#confirmModal").modal("show");
        return {
          yes:function(e){yes=e; return this;},
          no:function(e){no=e; return this;}
        }

      }

      function position2Latlng(position){
        return {lat:position.coords.latitude,lng:position.coords.longitude};
      }

      function addMapControls(map,$ctrls){
        $ctrls.each(
            function(){
                map.controls[ $(this).data("position") || google.maps.ControlPosition.TOP_LEFT].push( $(this).get(0));
            });
      }

      function openFetchDataModal(){
        if(data.length) {
          confirm("Clear current data?").yes(function(){removeData();$("#fetchDataModal").modal("show");});
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

            $(line.split(",")).each( function(index,value){ dataObj[ fields[index] ] = value;} );
            data.push( dataObj );
          });

        data.schema = schema; // attach schema to data
        return data;
      }

      function buildDataVisualization( $destElement ){
        var $body = $destElement.find("tbody").html("");
        var $header = $("<tr></tr>");

        $destElement.find("thead").html("").append($header);
        $(data.schema).each(
           function(index,element){
            var $th=$("<th></th>");
            $th.append( $("<a href='javascript:void(0);' data-toggle='dropdown' class='dropdown-toggle'></a>").text(element.name))
            $th.append( $("<ul class='dropdown-menu'><li><a href='#'>Inbox</a></li><li><a href='#'>Drafts</a></li></ul>") )
            $header.append( $th );
           });

        $(data).each(
          function(id,record){
              var $tr;

              $body.append( $tr = $("<tr></tr>") );
              $(data.schema).each(
                 function(index,field){
                  $tr.append( buildTableCell( record[field.name] ) );
                 });
              ;
          });
      }

      function buildTableCell(data){
        var $td = $("<td></td>")
        if (data.match(/\.(jpeg|jpg|tiff|gif|png|webp|svg)$/g)) { //image
          $td.append( $("<img class='img-thumbnail img-responsive' src='"+data+"'/>"));
        }
        else if (data.match(/^https?\:\/\//g)) { //link
          $td.append( $("<a href='"+data+"' target='_blank'>visit</a>"));
        }
        else $td.text( data );
        return $td;
      }

      function visualizeData(){
        if (data.length) $("#visualizeDataModal").modal("show");
      }

      function removeData(){
        markers=[];
        schema = [];
        data =[];
        $("#visualizeDataBtn").addClass('disabled');
      }

      /**** Initialization ****/
      $(function(){
        map = new google.maps.Map($("#map").get(0), {
                    center: defaultLocation,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: true,
                    zoom: 13,
                    draggable: true,
                    noClear: true
                 });
        addMapControls(map, $("[data-role='map-ctrl']"));
        $("[data-toggle='tooltip']").tooltip();
        $("#fetchDataBtn").click( openFetchDataModal );
        $("#visualizeDataBtn").click( visualizeData );
        $("#removeDataBtn").click( removeData );

        $("#fetchDataOKBtn").click( function(){
            $("#fetchDataOKBtn").button('processing');
            data = fetchData($("#fetchDataModalElement"), $("#separator").val());
            buildDataVisualization( $("#dataVisualizationTable") );
            $("#fetchDataOKBtn").button("reset");
            $("#fetchDataModal").modal("hide");
            $("#visualizeDataBtn").removeClass('disabled');
            $("#visualizeDataModal").modal("show");       
          } );

        $("#fetchDataModal").on("shown.bs.modal",function(){
          $(this).find("textarea").val("").focus();
          $("#separator").val("COMMA");
          $("#fetchDataOKBtn").button('reset');
        });
      })
})();
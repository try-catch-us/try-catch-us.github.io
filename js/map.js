/*** 
 map.js
 ***/

define(['csv'], function( csv ) {
  var exports = {};

  var map;
  var markers=[];
  var infoWindows = [];

  var defaultLocation = {lat:48.569094,lng:7.777214}; // This is my home

  function showAlert( text, timeout ) {
    var $element = $("#visualizationAlert");

    $element.removeClass('hide').find("[data-role='content']").html( text );
    if (timeout) setTimeout( function(){$element.addClass('hide');}, timeout );
  }

  exports.build = function($element, $controls){
    // create the map centred on a default position
    map = new google.maps.Map($element.get(0), {
                center: defaultLocation,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: true,
                zoom: 13,
                draggable: true,
                noClear: true
             });

    // add map controls
    $controls.each(
        function(){
            map.controls[ $(this).data("position") || google.maps.ControlPosition.TOP_LEFT].push( $(this).get(0));
        });

  }

  exports.showData = function(){
        var bounds = new google.maps.LatLngBounds();
        var data = csv.data();

        if (!data.length) {
          showAlert("No data to display.", 5000);
          return;
        }

        if (!csv.specificColumn('longitude') || !csv.specificColumn('latitude')) {
          showAlert("You should specify Longitude and Latitude columns.", 5000);
          return;
        }

        $("#visualizeDataModal").modal("hide");        
        clearMarkers();
        
        $.each( data,
          function( index, row ){
            var description = row[ csv.specificColumn('description') ];
            var label = row[ csv.specificColumn('label') ];
            var icon = label ?  new google.maps.MarkerImage(
        "http://chart.googleapis.com/chart?chst=d_bubble_text_small_withshadow&chld=bb|" + encodeURIComponent(label) + "|3377BB|FFFFFF",
        null, null, new google.maps.Point(0, 42)) : null;
            var position = new google.maps.LatLng(row[ csv.specificColumn('latitude') ],row[ csv.specificColumn('longitude') ]);
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
  exports.clearMarkers = clearMarkers;


	return exports;
});
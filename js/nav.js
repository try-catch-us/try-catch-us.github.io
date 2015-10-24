/*** 
 nav.js
 ***/

define(['domReady','csv','bootable','map','modals' ],function( domeady, csv, bootable, map, modals ) {
  var myTable;

  function openVisualizeDataModal(){
    if (csv.data().length) $("#visualizeDataModal").modal("show");
  }

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

  function openFetchDataModal(){
    if(csv.data().length) {
      modals.confirm("Data available. Would you delete current data?")
        .yes(function(){removeData();$("#fetchDataModal").modal("show");})
        .no(openVisualizeDataModal); // show current data
    }
    else $("#fetchDataModal").modal("show");
  }


          // toolTips initialization
      $("[data-toggle='tooltip']").tooltip();

          // Map controls
      $("#fetchDataBtn").click( openFetchDataModal );
      $("#visualizeDataBtn").click( openVisualizeDataModal );
      $("#removeDataBtn").click( removeData );


          // Modal initialization
      $("#showDataOnMap").click( function(){map.showData( myTable.selectedData(), csv.specificColumns() );} );
      $("#fetchDataOKBtn").click( function(){
          $("#fetchDataOKBtn").button('processing');
          csv.fetch($("#fetchDataModalElement").val(), $("#separator").val());
          myTable = bootable($("#dataVisualizationTable"),csv.data() );
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
  }


  function removeData(){
    csv.clear();
    myTable.clear();
    map.clearMarkers();
    $("#visualizeDataBtn").addClass('disabled');
  }

  function init(){
    navInitialization();
    map.build( $("#map"), $("[data-role='map-ctrl']") );
  } 


  domeady(init);
});
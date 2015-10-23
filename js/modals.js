/*** 
 modal.js: non blocking modal confirmation popups
 ***/
define(function(  ) {

	var exports = {};
	var confirmInitialized = false;

	exports.confirm = function(message) {
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

  return exports;

});
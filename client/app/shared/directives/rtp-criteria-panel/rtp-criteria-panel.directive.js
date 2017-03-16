( function () {
  'use strict';
  angular.module('app.directives', [])
  .directive('rtpCriteriaPanel', [
    '$rootScope', 'TripFactory', '$ionicModal',
    function($rootScope, TripFactory, $ionicModal) {
    return {
      templateUrl: 'app/shared/directives/rtp-criteria-panel/rtp-criteria-panel.html',
      link: link
    };

    function link(scope, elem, attrs) {
        TripFactory.getAll();

        $ionicModal.fromTemplateUrl('app/shared/directives/rtp-criteria-panel/poi-modal.html', {
           scope: scope,
           animation: 'slide-in-up'
         }).then(function(modal) {
           scope.PoiModal = modal;
         });

         scope.openPoi= function(event, poiId, poiIndex) {
           scope.selectedPoi = scope.TripPois[poiIndex];
           $rootScope.map.showInfoWindow(event, poiId);
          //  scope.PoiModal.show();
         };
         scope.closePoi = function() {
          //  scope.PoiModal.hide();
         };

        scope.selectTrip = function (tripIndex) {
          TripFactory.notifyTripFocusChange(tripIndex);
        };

        scope.deleteTrip = function (tripIndex) {
          TripFactory.deleteOne(TripFactory.data.trips[tripIndex].id);
        };

        TripFactory.onListChange(scope, function() {
          scope.TripPois = [];
          scope.tripList = TripFactory.data.trips;
        });
        TripFactory.onTripFocusChange(scope, function(event, focusedTrip) {
          scope.TripPois = TripFactory.data.trips[focusedTrip.index].pois;
        });


    }
  }]);
})();

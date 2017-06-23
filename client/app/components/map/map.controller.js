( function () {
  'use strict';
  angular.module('app.map', [])
  .controller('mapController', [
    '$rootScope', '$scope', '$stateParams', '$ionicModal', '$ionicPopup', 'TripFactory', 'NgMap', 'PoiFactory',
    function($rootScope, $scope, $stateParams,$ionicModal, $ionicPopup, TripFactory, NgMap, PoiFactory) {
    var vm = this;

    vm.title = 'Magic School Bus';

    vm.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=' + 'AIzaSyB4rABfee6qTa6-4ELeCJ763m4V-DuTlLk';
    vm.map = {
        markers : {},
        events: {
        }
    };
    PoiFactory.onPoiChange($scope, function (event, poiObj) {
      vm.poiInfo = vm.map.markers['poi_' + poiObj.poiId];
      $rootScope.map.showInfoWindow('poiInfo', poiObj.poiId);
    });
    vm.openPoi = function (event, poiId) {
      PoiFactory.notifyPoiChange(poiId);
    };

    $scope.$on('$stateChangeSuccess', function() {
      NgMap.getMap().then(function(map) {
         $rootScope.map = map;
      });
    });
    TripFactory.onListChange($scope, function() {
      delete vm.map.markers;
    });
    TripFactory.onTripFocusChange($scope, function (event, focusedTrip) {
      vm.map.markers = {};
      var selectedTrip = TripFactory.data.trips[focusedTrip.index]; 

      vm.map.markers.start = {
        lat: selectedTrip.start.lat,
        lng: selectedTrip.start.lng
      };
      vm.map.markers.end = {
        lat: selectedTrip.end.lat,
        lng: selectedTrip.end.lng
      };
      selectedTrip.pois.forEach(function (poi) {
        var markerName = 'poi_' + poi.id;
        vm.map.markers[markerName] = poi;
        vm.map.markers[markerName].location = [vm.map.markers[markerName].location.lat, vm.map.markers[markerName].location.lng];
      });
    });
    return vm;
  }]);
})();

( function () {
  'use strict';
  angular.module('app.mainMap', [])
  .controller('mainMapController', [ '$rootScope', '$scope', '$stateParams', '$ionicModal', '$ionicPopup', 'TripFactory', 'NgMap',
    function($rootScope, $scope, $stateParams,$ionicModal, $ionicPopup, TripFactory, NgMap) {
    var vm = this;

    vm.title = 'Magic School Bus';
    vm.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=' + 'AIzaSyB4rABfee6qTa6-4ELeCJ763m4V-DuTlLk';

    $scope.$on('$stateChangeSuccess', function() {
      NgMap.getMap().then(function(map) {
         $rootScope.map = map;
      });
      vm.map = {
        defaults: {
            tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
            zoomControlPosition: 'bottomleft',
            scrollWheelZoom: true
          },
          center: {
            lat: 45.41170736599208,
            lng: -75.66936492919922,
            zoom: 12
          },
          markers : {},
          events: {
          }
      };

    });
    TripFactory.onListChange($scope, function() {
      vm.map.markers = {};
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
        var markerName = 'po_' + poi.id;
        vm.map.markers[markerName] = poi;
        vm.map.markers[markerName].location = [vm.map.markers[markerName].location.lat, vm.map.markers[markerName].location.lng];
      });
    });

    /**
    * Detect user long-pressing on map to add new location
    */
    $scope.$on('leafletDirectiveMap.contextmenu', function(event, locationEvent){
      vm.newLocation = {
        lat: locationEvent.leafletEvent.latlng.lat,
        lng: locationEvent.leafletEvent.latlng.lng
      };
      console.log(vm.newLocation);
    });
  }]);
})();

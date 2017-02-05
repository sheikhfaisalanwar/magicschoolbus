( function () {
  'use strict';
  angular.module('app.mainMap', [])
  .controller('mainMapController', [ '$scope', '$stateParams', '$ionicModal', '$ionicPopup', 'TripFactory',
    function($scope, $stateParams,$ionicModal, $ionicPopup, TripFactory) {
    var vm = this;

    vm.title = '<h1 class="text-white"><i class="ion-android-bus"> Magic School Bus</h1>';


    $scope.$on('$stateChangeSuccess', function() {
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
    TripFactory.onTripFocusChange($scope, function (event, message) {
      console.log('vm.map.markers', vm.map.markers);
      console.log('TripFactory.data.trips', TripFactory.data.trips);
      vm.map.markers.start = {
        lat: TripFactory.data.trips[message.index].start.lat,
        lng: TripFactory.data.trips[message.index].start.lon
      };
      vm.map.markers.end = {
        lat: TripFactory.data.trips[message.index].end.lat,
        lng: TripFactory.data.trips[message.index].end.lon
      };
      TripFactory.data.trips[message.index].pois.forEach(function (poi) {
        vm.map.markers[poi.name] = poi;
        vm.map.markers[poi.name].lng = vm.map.markers[poi.name].lon;
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

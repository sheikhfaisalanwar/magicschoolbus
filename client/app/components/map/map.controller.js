( function () {
  'use strict';
  angular.module('app.mainMap', [])
  .controller('mainMapController', [ '$scope', '$stateParams', '$ionicModal', '$ionicPopup', 'TripFactory',
    function($scope, $stateParams,$ionicModal, $ionicPopup, TripFactory) {
    var vm = this;

    vm.title = 'Magic School Bus';


    $scope.$on('$stateChangeSuccess', function() {
      vm.map = {
        defaults: {
            // tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
          },
          layers: {
            baselayers: {
              osm: {
                name: 'OpenStreetMap',
                url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                type: 'xyz'
              },
              cloudmade: {
                name: 'Cloudmade Tourist',
                type: 'xyz',
                url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
                layerParams: {
                  key: '007b9471b4c74da4a6ec7ff43552b16f',
                  styleId: 7
                }
              }
            }
          }
      };

    });
    TripFactory.onTripFocusChange($scope, function (event, message) {
      vm.map.markers = {};
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
        vm.map.markers[poi.name].lng = vm.map.markers[poi.name].location.lng;
        vm.map.markers[poi.name].lat = vm.map.markers[poi.name].location.lat;
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

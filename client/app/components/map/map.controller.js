( function () {
  'use strict';
  angular.module('app.mainMap', [])
  .controller('mainMapController', [ '$scope', '$stateParams', '$ionicModal', '$ionicPopup',
    function($scope, $stateParams,$ionicModal, $ionicPopup) {
    var vm = this;

    vm.title = '<h1 class="text-white"><i class="ion-android-bus"> Magic School Bus</h1>';


    $scope.$on("$stateChangeSuccess", function() {
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
           map: {
           }
          }
      };

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

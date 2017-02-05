( function () {
  'use strict';
  angular.module('app.menu', [])
  .controller('menuController', function($scope, $ionicModal, $timeout, LoginService, TripFactory) {
    var vm = this;
    $scope.autoCompleteOpts = {
      country: 'ca'
    };
    $ionicModal.fromTemplateUrl('app/components/menu/createTripModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.tripModal = modal;
    });
    vm.createNewTrip = function() {
      vm.tripModal.show();
    };
    $scope.closeModal = function() {
      vm.tripModal.hide();
    };

    $scope.logout = function () {
      console.log("Hit logout")
      LoginService.logout();
    };

    $scope.createTrip = function (tripInput) {
      TripFactory.convertAddressToCoordinates(tripInput.source).then(function (sourceCoords) {
        TripFactory.convertAddressToCoordinates(tripInput.dest).then(function (destCoords) {
          TripFactory.createTripfromParams(sourceCoords, destCoords, tripInput.range).then(function () {
            console.log('yay!');
            $scope.closeModal();
            //Trip.factory
          });
        });
      });
    };
  });
})();

( function () {
  'use strict';
  angular.module('app.menu', [])
  .controller('menuController', [
    '$scope', '$ionicModal', '$timeout', 'LoginService', 'TripFactory',
    function($scope, $ionicModal, $timeout, LoginService, TripFactory) {

    var vm = this;
    $scope.autoCompleteOpts = {
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
      LoginService.logout();
    };

    $scope.createTrip = function (tripInput) {
      TripFactory.convertAddressToCoordinates(tripInput.source).then(function (sourceCoords) {
        TripFactory.convertAddressToCoordinates(tripInput.dest).then(function (destCoords) {
          TripFactory.createOne(tripInput.name, sourceCoords, destCoords, tripInput.range).then(function () {
            $scope.closeModal();
            TripFactory.getAll();
          });
        });
      });
    };
  }]);
})();

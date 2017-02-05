angular.module('app.menu', [])

.controller('menuController', function($scope, $ionicModal, $timeout, LoginService) {

  var vm = this;
  vm.title = 'Farrar';
  vm.menuItems = [];

  $ionicModal.fromTemplateUrl('app/shared/views/modal.html', {
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
});

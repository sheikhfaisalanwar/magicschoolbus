angular.module('app.menu', [])

.controller('menuController', function($scope, $ionicModal, $timeout) {

  var vm = this;
  vm.title = 'Farrar';
  vm.menuItems = [];

  $ionicModal.fromTemplateUrl('app/shared/views/modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    vm.tripModal = modal;
  });
  vm.createNewTip = function() {
    vm.tripModal.show();
  };
  vm.closeModal = function() {
    vm.tripModal.hide();
  };
});

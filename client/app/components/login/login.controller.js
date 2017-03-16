( function () {
  'use strict';
  angular.module('login', [])
  .controller('loginController', ['$scope', 'LoginService', '$ionicPopup', '$state', '$ionicModal',
  function($scope, LoginService, $ionicPopup, $state, $ionicModal) {
    $scope.data = {};
    console.log('ctrl');

    $scope.login = function() {
        LoginService.login($scope.data.username, $scope.data.password).then(function(data) {
            return $state.go('app.mainMap');
        },function(data) {
            return $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    };



    $ionicModal.fromTemplateUrl('app/components/login/signup.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.userModal = modal;
    });
    $scope.showSignUpModal = function() {
      $scope.userModal.show();
    };
    $scope.createNewUser = function(uname, pw) {
      LoginService.signUp(uname, pw)
        .then(function(data) {
            $scope.userModal.hide();
        },function(data) {
          var alertPopup = $ionicPopup.alert({
              title: 'Signup failed!',
              template: 'Please try again!'
          });
      });
    };
    $scope.closeSignUpModal = function() {
      $scope.userModal.hide();
    };
  }]);
})();

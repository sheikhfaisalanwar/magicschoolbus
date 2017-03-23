( function () {
  'use strict';
  angular.module('login', [])
  .controller('loginController', ['$scope', 'LoginService', '$ionicPopup', '$location', '$ionicModal',
  function($scope, LoginService, $ionicPopup, $location, $ionicModal) {
    $scope.data = {};

    $ionicModal.fromTemplateUrl('app/components/login/signup.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.signUpModal = modal;
    });


    $scope.login = function() {
      return LoginService.login($scope.data.email, $scope.data.password).then(function(data) {
          return $location.path('/map');
      },function(data) {
          return $ionicPopup.alert({
              title: 'Login failed!',
              template: 'Please check your credentials!'
          });
      });
    };

    $scope.showSignUpModal = function() {
      return $scope.userModal.show();
    };
    $scope.createNewUser = function() {
      if ($scope.data.signUpPw !== $scope.data.signUpPwConfirm) {
        return $ionicPopup.alert({
            title: 'Passwords Do Not Match',
            template: 'Please check your credentials!'
        });
      }
      return LoginService.signUp($scope.data.signUpEmail, $scope.data.signUpPw)
        .then(function(data) {
            return $scope.userModal.hide();
        },function(data) {
          return $ionicPopup.alert({
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

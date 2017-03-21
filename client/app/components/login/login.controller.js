( function () {
  'use strict';
  angular.module('login', [])
  .controller('loginController', ['$scope', 'LoginService', '$ionicPopup', '$state', '$ionicModal',
  function($scope, LoginService, $ionicPopup, $state, $ionicModal) {
    $scope.data = {};
    console.log('ctrl');

    $ionicModal.fromTemplateUrl('app/components/login/signup.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.userModal = modal;
    });


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

    $scope.showSignUpModal = function() {
      return $scope.userModal.show();
    };
    $scope.createNewUser = function() {
      if ($scope.userModal.signUpPw !== $scope.userModal.signUpPwConfirm) {
        return $ionicPopup.alert({
            title: 'Passwords Do Not Match',
            template: 'Please check your credentials!'
        });
      }
      return LoginService.signUp($scope.userModal.signUpEmail, $scope.userModal.signUpPw)
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

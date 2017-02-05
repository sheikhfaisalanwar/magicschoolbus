( function () {
  'use strict';
  angular.module('login', [])
.controller('loginController', ['$scope', 'LoginService', '$ionicPopup', '$state', '$ionicModal', function($scope, LoginService, $ionicPopup, $state, $ionicModal) {
    $scope.data = {};
    console.log('ctrl');

    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).then(function(data) {
            $state.go('app.mainMap');
        },function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }



    $ionicModal.fromTemplateUrl('app/components/login/signup.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      console.log('Modal set')
      $scope.userModal = modal;
    });
    $scope.showSignUpModal = function() {
      $scope.userModal.show();
    };
    $scope.createNewUser = function(uname, pw) {
      LoginService.signup(uname, pw)
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

( function () {
  'use strict';
  angular.module('app.factories', [])
  .service('LoginService', ['$http','$q','$ionicPopup', '$window', '$state', 'localStorageService', 'API_ENDPOINT',
    function($http,$q, $ionicPopup, $window, $state, localStorageService, API_ENDPOINT) {
    var deferred = $q.defer(),
      userData = {};
    userData.accessToken = localStorageService.get('loginKey');
    return {
      userData: userData,
      login: login,
      signUp: signUp,
      logout: logout
    };
    function login(name, pw) {
      var promise = deferred.promise;
      $http.post(API_ENDPOINT + '/Users/login', {
        'email': name,
        'password': pw
      }).then(function (successResponse) {
          console.log(successResponse);
          $window.loginstatus=1;
		      userData.accessToken = successResponse.data.id;
          localStorageService.set('loginKey', userData.accessToken);
          deferred.resolve(null);
        },function (errorResponse) {
          deferred.reject(errorResponse);
          console.log(errorResponse);
          delete $window.token;
        });
        return promise;
    }

    function signUp(name, pw) {
      var promise = deferred.promise;
      $http.post(API_ENDPOINT + '/Users', {
        'email':name,
        'password':pw
      }).then(function (successResponse) {
        console.log(successResponse);
        if(successResponse.data.email === name) {
          var alertPopup = $ionicPopup.alert({
            title: 'Registration Successful',
            template: 'You will be redirected to the Login Page'
          });
          deferred.resolve(null);
        }
        },function (errorResponse) {
        deferred.reject(errorResponse);
        });
        return promise;
    }

    function logout() {
      var promise = deferred.promise;
      $http.post(API_ENDPOINT + '/Users/logout',{},{
        params: {
          'access_token': userData.accessToken || localStorageService.get('loginKey')
        }
      }).then(function (successResponse) {
          delete userData.accessToken;
          localStorageService.remove('loginKey');
          $state.go('login');
        },function (errorResponse) {
        deferred.reject(errorResponse);
        });
      return promise;
    }
  }]);
})();

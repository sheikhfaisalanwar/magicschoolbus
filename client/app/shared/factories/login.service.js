( function () {
  'use strict';
  angular.module('app.factories', [])
  .service('LoginService', ['$http','$q','$ionicPopup', '$window', '$state', 'localStorageService', 'API_ENDPOINT',
    function($http,$q, $ionicPopup, $window, $state, localStorageService, API_ENDPOINT) {
    var services = {};
    var deferred = $q.defer(),
      userObject = {};
    return {
      userData: userObject,
      loginUser: function(name, pw) {
        var promise = deferred.promise;
        $http.post(API_ENDPOINT + '/Users/login', {
          'email': name,
          'password': pw
        }).then(function (successResponse) {
            console.log(successResponse);
            $window.loginstatus=1;
  		      userObject.accessToken = successResponse.data.id;
            localStorageService.set('loginKey', userObject.accessToken);
            deferred.resolve(null);
          },function (errorResponse) {
            deferred.reject(errorResponse);
            console.log(errorResponse);
            delete $window.token;
          });
          return promise;
      },

      signup: function(name, pw) {
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
      },

      logout: function () {
        var promise = deferred.promise;
        $http.post(API_ENDPOINT + '/Users/logout',{},{
          params: {
            'access_token': userObject.accessToken || localStorageService.get('loginKey')
          }
        }).then(function (successResponse) {
            delete userObject.accessToken;
            localStorageService.remove('loginKey');
            $state.go('login');
          },function (errorResponse) {
          deferred.reject(errorResponse);
          });
        return promise;
      }
    };
  }]);
})();

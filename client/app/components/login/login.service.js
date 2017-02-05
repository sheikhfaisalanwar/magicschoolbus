( function () {
  'use strict';
  angular.module('login')
.service('LoginService', ['$http','$q','$ionicPopup', '$window',function($http,$q, $ionicPopup, $window) {
  var services = {};
  console.log('serve');

    var deferred = $q.defer();
    return {
        loginUser: function(name, pw) {
          var promise = deferred.promise;
          $http.post("http://localhost:3000/api/Users/login/",{
            "email":name,
            "password":pw
          }).then(function (successResponse) {
              console.log(successResponse);
              $window.loginstatus=1;
    		      $window.token = successResponse.data.id;
              deferred.resolve(null);
            },function (errorResponse) {
              deferred.reject(errorResponse);
              console.log(errorResponse);
              delete $window.token;
            });
            return promise;
        },

        signup: function(name, pw){
          //console.log(name,pw);
          var promise = deferred.promise;
          $http.post("http://localhost:3000/api/Users",{
            "email":name,
            "password":pw
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
    }
  }]);
})();

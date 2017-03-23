( function () {
  'use strict';
  angular.module('app', [
    'ionic',
    // 'leaflet-directive',
    'ngMap',
    'ng-mfb',
    'ngAutocomplete',
    'LocalStorageModule',
    'app.directives',
    'app.factories',
    'login',
    'app.map',
    'app.menu'
  ])
  .run(['$ionicPlatform', '$rootScope', '$state', function($ionicPlatform, $rootScope, $location) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      $rootScope._ = window._;
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        window.StatusBar.styleDefault();
      }
    });
  }]);
})();

( function () {
   'use strict';
  angular.module('app')
  .constant('_', window._)
  .constant('API_ENDPOINT', 'http://magicschoolbus.heroku.com/api')
  .config(['$stateProvider', '$urlRouterProvider', '$logProvider' , '$httpProvider',
    function($stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {
    $stateProvider
      .state('app', {
      url: '/',
      abstract: true,
      templateUrl: 'app/components/menu/menu.view.html',
      controller: 'menuController',
      controllerAs: 'menuCtrl'
    });
    $logProvider.debugEnabled(false);
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }]);
})();

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

( function () {
  'use strict';
  angular.module('app')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'app/components/login/login.view.html',
      controller: 'loginController'
    });
  }]);
})();

( function () {
  'use strict';
  angular.module('app.map', [])
  .controller('mapController', [
    '$rootScope', '$scope', '$stateParams', '$ionicModal', '$ionicPopup', 'TripFactory', 'NgMap', 'PoiFactory',
    function($rootScope, $scope, $stateParams,$ionicModal, $ionicPopup, TripFactory, NgMap, PoiFactory) {
    var vm = this;

    vm.title = 'Magic School Bus';
    vm.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=' + 'AIzaSyB4rABfee6qTa6-4ELeCJ763m4V-DuTlLk';
    vm.map = {
        markers : {},
        events: {
        }
    };
    PoiFactory.onPoiChange($scope, function (event, poiObj) {
      vm.poiInfo = vm.map.markers['poi_' + poiObj.poiId];
      $rootScope.map.showInfoWindow('poiInfo', poiObj.poiId);
    });
    vm.openPoi = function (event, poiId) {
      PoiFactory.notifyPoiChange(poiId);
    };

    $scope.$on('$stateChangeSuccess', function() {
      NgMap.getMap().then(function(map) {
         $rootScope.map = map;
      });
    });
    TripFactory.onListChange($scope, function() {
      delete vm.map.markers;
    });
    TripFactory.onTripFocusChange($scope, function (event, focusedTrip) {
      vm.map.markers = {};
      var selectedTrip = TripFactory.data.trips[focusedTrip.index];
      vm.map.markers.start = {
        lat: selectedTrip.start.lat,
        lng: selectedTrip.start.lng
      };
      vm.map.markers.end = {
        lat: selectedTrip.end.lat,
        lng: selectedTrip.end.lng
      };
      selectedTrip.pois.forEach(function (poi) {
        var markerName = 'poi_' + poi.id;
        vm.map.markers[markerName] = poi;
        vm.map.markers[markerName].location = [vm.map.markers[markerName].location.lat, vm.map.markers[markerName].location.lng];
      });
    });
    return vm;
  }]);
})();

( function () {
  'use strict';
  angular.module('app')
  .config(['$stateProvider', '_', function($stateProvider, _) {
    $stateProvider.state('app.map', {
      url: 'map',
      views: {
        'menuContent': {
          templateUrl: 'app/components/map/map.view.html',
          controller: 'mapController',
          controllerAs: 'mapCtrl'
        }
      },
      resolve: {
        authentication: ['LoginService', '$location', 'localStorageService', function (LoginService, $location, localStorageService) {
          if (_.isNil(LoginService.userData.accessToken) &&
            _.isNil(localStorageService.get('loginKey'))) {
            $location.path('/login');
          }
        }]
      }
    });
  }]);
})();

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
      LoginService.logout().then(function() {
        delete TripFactory.data.trips;
      });
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

    $scope.$on('$ionicView.beforeEnter',function(){
      TripFactory.getAll();
    });
  }]);
})();

( function () {
  'use strict';
  angular.module('app.directives', [])
  .directive('rtpCriteriaPanel', [
    '$rootScope', 'TripFactory', '$ionicModal', 'PoiFactory',
    function($rootScope, TripFactory, $ionicModal, PoiFactory) {
    return {
      templateUrl: 'app/shared/directives/rtp-criteria-panel/rtp-criteria-panel.html',
      link: link
    };

    function link(scope, elem, attrs) {
        $ionicModal.fromTemplateUrl('app/shared/directives/rtp-criteria-panel/poi-modal.html', {
           scope: scope,
           animation: 'slide-in-up'
         }).then(function(modal) {
           scope.PoiModal = modal;
         });

         scope.openPoi= function(poiId, poiIndex) {
           PoiFactory.notifyPoiChange(poiId);
         };
         scope.closePoi = function() {
         };

        scope.selectTrip = function (tripIndex) {
          TripFactory.notifyTripFocusChange(tripIndex);
        };

        scope.deleteTrip = function (tripIndex) {
          TripFactory.deleteOne(TripFactory.data.trips[tripIndex].id);
        };

        TripFactory.onListChange(scope, function() {
          scope.TripPois = [];
          scope.tripList = TripFactory.data.trips;
        });
        TripFactory.onTripFocusChange(scope, function(event, focusedTrip) {
          scope.TripPois = TripFactory.data.trips[focusedTrip.index].pois;
        });

    }
  }]);
})();

( function () {
  'use strict';
  angular.module('app.factories', [])
  .service('LoginService', ['$http','$q','$ionicPopup', '$window', '$state', 'localStorageService', 'API_ENDPOINT',
    function($http,$q, $ionicPopup, $window, $state, localStorageService, API_ENDPOINT) {
    var deferred = $q.defer(),
      userData = {};
    userData.accessToken = localStorageService.get('loginKey');
    userData.userId = localStorageService.get('loginId');
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
          $window.loginstatus=1;
          userData.accessToken = successResponse.data.id;
		      userData.userId = successResponse.data.userId;
          localStorageService.set('loginKey', userData.accessToken);
          localStorageService.set('loginId', userData.userId);
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
          localStorageService.remove('loginId');
          $state.go('login');
        },function (errorResponse) {
        deferred.reject(errorResponse);
        });
      return promise;
    }
  }]);
})();

( function () {
  'use strict';
  angular.module('app.factories')
    .factory('PoiFactory', [ '$q', '$http', 'LoginService', 'API_ENDPOINT', function($q, $http, LoginService, API_ENDPOINT) {

    var poiScopes = [],
      TripFactory = {
       onPoiChange: onPoiChange,
       notifyPoiChange: notifyPoiChange,
       data: {
         currentPoi: {}
         }
       };

    function notifyPoiChange(poiId) {
      if (!poiScopes.length) { return; }
      poiScopes.forEach(function (subScope) {
        subScope.$broadcast('PoiFactory-poiChange', {poiId: poiId});
      });
    }

    function onPoiChange (subScope, subCb) {
      subScope.$on('PoiFactory-poiChange', subCb);
      poiScopes.push(subScope);
    }

    return TripFactory;

  }]);
})();

( function () {
  'use strict';
  angular.module('app.factories')
    .factory('TripFactory', [ '$q', '$http', 'LoginService', 'API_ENDPOINT', function($q, $http, LoginService, API_ENDPOINT) {

    var recentTripList,
      subListScopes = [],
      subFocusScopes = [],
      TripFactory = {
       getAll: getAll,
       onListChange: onListChange,
       onTripFocusChange: onTripFocusChange,
       notifyTripFocusChange: notifyTripFocusChange,
       convertAddressToCoordinates: convertAddressToCoordinates,
       createOne: createOne,
       deleteOne: deleteOne,
       data: {
         }
       };

    function convertAddressToCoordinates (address) {
      var deferred = $q.defer();
      $http.get(API_ENDPOINT + '/Trips/convertGeocode',{headers: {address: address}})
      .then(function(res){
        deferred.resolve(res.data.response);
      },function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function createOne(name, sourceLatLng, destLatLng, range) {
      var deferred = $q.defer();
      $http.post(API_ENDPOINT + '/Trips/populate',{
        name: name,
        source: sourceLatLng,
        dest: destLatLng,
        range: range
      }).then(function(res){
        getAll().then(function() {
          deferred.resolve(true);
        });
      },function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function deleteOne(tripId) {
      var deferred = $q.defer();
      $http.delete(API_ENDPOINT + '/Trips/' + tripId)
        .then(function(res){
        getAll().then(function() {
          deferred.resolve(true);
        });
      },function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function getAll () {
      delete TripFactory.data.trips;
      notifyListChange();
      var deferred = $q.defer();
      $http.get(API_ENDPOINT + '/Trips',{
        params: {
          'access_token': LoginService.userData.accessToken,
          filter: {
            where: {
              userId: LoginService.userData.userId
            }
          }
        },
      }).then(function(res){
        TripFactory.data.trips = JSON.parse(JSON.stringify(res.data));
        notifyListChange();
        deferred.resolve(res.data);
      },function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function notifyListChange() {
      subListScopes.forEach(function (subScope) {
        subScope.$broadcast('TripFactory-listChange', {});
      });
    }

    function onListChange (subScope, subCb) {
      subScope.$on('TripFactory-listChange', subCb);
      subListScopes.push(subScope);
    }
    function notifyTripFocusChange (index) {
      subFocusScopes.forEach(function (subScope) {
        subScope.$broadcast('TripFactory-tripFocusChange', {index: index});
      });
    }
    function onTripFocusChange (subScope, subCb) {
      subScope.$on('TripFactory-tripFocusChange', subCb);
      subFocusScopes.push(subScope);
    }

    return TripFactory;

  }]);
})();

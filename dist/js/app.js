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
    'app.mainMap',
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
  .constant('API_ENDPOINT', 'http://localhost:3000/api')
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
  angular.module('app.mainMap', [])
  .controller('mainMapController', [ '$rootScope', '$scope', '$stateParams', '$ionicModal', '$ionicPopup', 'TripFactory', 'NgMap',
    function($rootScope, $scope, $stateParams,$ionicModal, $ionicPopup, TripFactory, NgMap) {
    var vm = this;

    vm.title = 'Magic School Bus';
    vm.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=' + 'AIzaSyB4rABfee6qTa6-4ELeCJ763m4V-DuTlLk';

    $scope.$on('$stateChangeSuccess', function() {
      NgMap.getMap().then(function(map) {
         $rootScope.map = map;
      });
      vm.map = {
        defaults: {
            tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
            zoomControlPosition: 'bottomleft',
            scrollWheelZoom: true
          },
          center: {
            lat: 45.41170736599208,
            lng: -75.66936492919922,
            zoom: 12
          },
          markers : {},
          events: {
          }
      };

    });
    TripFactory.onListChange($scope, function() {
      vm.map.markers = {};
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
        var markerName = 'po_' + poi.id;
        vm.map.markers[markerName] = poi;
        vm.map.markers[markerName].location = [vm.map.markers[markerName].location.lat, vm.map.markers[markerName].location.lng];
      });
    });

    /**
    * Detect user long-pressing on map to add new location
    */
    $scope.$on('leafletDirectiveMap.contextmenu', function(event, locationEvent){
      vm.newLocation = {
        lat: locationEvent.leafletEvent.latlng.lat,
        lng: locationEvent.leafletEvent.latlng.lng
      };
      console.log(vm.newLocation);
    });
  }]);
})();

( function () {
  'use strict';
  angular.module('app')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('app.mainMap', {
      url: 'map',
      views: {
        'menuContent': {
          templateUrl: 'app/components/map/map.view.html',
          controller: 'mainMapController',
          controllerAs: 'mainMapCtrl'
        }
      },
      resolve: {
        authentication: ['LoginService', '$location', 'localStorageService', function (LoginService, $location, localStorageService) {
          if (!LoginService.userData.accessToken && !localStorageService.get('loginKey')) { $location.path('/login'); }
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
      LoginService.logout();
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
  }]);
})();

( function () {
  'use strict';
  angular.module('app.directives', [])
  .directive('rtpCriteriaPanel', [
    '$rootScope', 'TripFactory', '$ionicModal',
    function($rootScope, TripFactory, $ionicModal) {
    return {
      templateUrl: 'app/shared/directives/rtp-criteria-panel/rtp-criteria-panel.html',
      link: link
    };

    function link(scope, elem, attrs) {
        TripFactory.getAll();

        $ionicModal.fromTemplateUrl('app/shared/directives/rtp-criteria-panel/poi-modal.html', {
           scope: scope,
           animation: 'slide-in-up'
         }).then(function(modal) {
           scope.PoiModal = modal;
         });

         scope.openPoi= function(event, poiId, poiIndex) {
           scope.selectedPoi = scope.TripPois[poiIndex];
           $rootScope.map.showInfoWindow(event, poiId);
          //  scope.PoiModal.show();
         };
         scope.closePoi = function() {
          //  scope.PoiModal.hide();
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
      var deferred = $q.defer();
      $http.get(API_ENDPOINT + '/Trips',{
        params: {
          'access_token': LoginService.userData.accessToken
        }
      }).then(function(res){
        TripFactory.data.trips = JSON.parse(JSON.stringify(res.data));
        console.log('getAll',TripFactory.data.trips);
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

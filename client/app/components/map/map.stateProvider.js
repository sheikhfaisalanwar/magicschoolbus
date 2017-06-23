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

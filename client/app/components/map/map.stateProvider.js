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

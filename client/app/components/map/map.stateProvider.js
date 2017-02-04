( function () {
  'use strict';
  angular.module('app')
  .config(function($stateProvider) {
    $stateProvider.state('app.mainMap', {
      url: '/map',
      views: {
        'menuContent': {
          templateUrl: 'app/components/map/map.view.html',
          controller: 'mainMapController',
          controllerAs: 'mainMapCtrl'
        }
      }
    });
  });
})();

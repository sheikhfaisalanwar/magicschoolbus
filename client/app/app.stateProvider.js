( function () {
   'use strict';
  angular.module('app')
  .constant('_', window._)
  .constant('API_ENDPOINT', 'http://localhost:3000/api')
  .config(['$stateProvider', '$urlRouterProvider', '$logProvider', function($stateProvider, $urlRouterProvider, $logProvider) {
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
  }]);
})();

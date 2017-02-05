( function () {
   'use strict';
  angular.module('app')
  .constant('_', window._)
  .config(function($stateProvider, $urlRouterProvider, $logProvider) {
    $stateProvider
      .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'app/components/menu/menu.view.html',
      controller: 'menuController',
      controllerAs: 'menuCtrl'
    });
    $logProvider.debugEnabled(false);
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
  });
})();

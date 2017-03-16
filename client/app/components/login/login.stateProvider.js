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

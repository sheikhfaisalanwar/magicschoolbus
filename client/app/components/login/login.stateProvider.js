( function () {
  'use strict';
  angular.module('app')
  .config(function($stateProvider) {
    console.log('ss');
    $stateProvider.state('login', {
      url: '/app/login',
      templateUrl: 'app/components/login/login.view.html',
      controller: 'loginController'
    });
  });
})();

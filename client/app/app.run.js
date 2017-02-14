( function () {
  'use strict';
  angular.module('app', [
    'ionic',
    'leaflet-directive',
    'ng-mfb',
    'ngAutocomplete',
    'ngCookies',
    'app.directives',
    'app.factories',
    'login',
    'app.mainMap',
    'app.menu'
  ])
  .run(['$ionicPlatform', '$rootScope', 'LoginService', '$state', function($ionicPlatform, $rootScope, LoginService, $location) {
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

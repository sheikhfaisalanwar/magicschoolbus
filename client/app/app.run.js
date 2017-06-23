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

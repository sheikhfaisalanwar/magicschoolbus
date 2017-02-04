( function () {
  'use strict';
  angular.module('app', [
    'ionic',
    'leaflet-directive',
    'ng-mfb',
    'app.directives',
    'app.mainMap',
    'app.menu',
  ])
  .run(['$ionicPlatform', '$rootScope',function($ionicPlatform, $rootScope) {
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
        StatusBar.styleDefault();
      }
    });
  }]);
})();

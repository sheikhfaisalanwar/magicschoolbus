( function () {
  'use strict';
  angular.module('app.factories')
    .factory('PoiFactory', [ '$q', '$http', 'LoginService', 'API_ENDPOINT', function($q, $http, LoginService, API_ENDPOINT) {

    var poiScopes = [],
      TripFactory = {
       onPoiChange: onPoiChange,
       notifyPoiChange: notifyPoiChange,
       data: {
         currentPoi: {}
         }
       };

    function notifyPoiChange(poiId) {
      if (!poiScopes.length) { return; }
      poiScopes.forEach(function (subScope) {
        subScope.$broadcast('PoiFactory-poiChange', {poiId: poiId});
      });
    }

    function onPoiChange (subScope, subCb) {
      subScope.$on('PoiFactory-poiChange', subCb);
      poiScopes.push(subScope);
    }

    return TripFactory;

  }]);
})();

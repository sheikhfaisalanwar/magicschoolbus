( function () {
  'use strict';
  angular.module('app.factories', [])
    .factory('TripFactory', [ '$q', '$http', 'API_ENDPOINT', function($q, $http, API_ENDPOINT) {

    var deferred = $q.defer(),
      recentTripList,
      subListScopes = [],
      subFocusScopes = [],
      TripFactory = {
       getAll: getAll,
       onListChange: onListChange,
       onTripFocusChange: onTripFocusChange,
       notifyTripFocusChange: notifyTripFocusChange,
       data: {
         }
       };
    function getAll () {
      var promise = deferred.promise;
      return $http.get(API_ENDPOINT + '/Trips').then(function(res){
        TripFactory.data.trips = JSON.parse(JSON.stringify(res.data));
        return res.data;
      },function(err) {
        console.error(err);
      });
    }
    function notifyListChange() {
      subListScopes.forEach(function (subScope) {
        subScope.$broadcast('TripFactory-listChange', {});
      });
    }

    function onListChange (subScope, subCb) {
      subScope.$on('TripFactory-listChange', subCb);
      subListScopes.push(subScope);
    }
    function notifyTripFocusChange (index) {
      subFocusScopes.forEach(function (subScope) {
        subScope.$broadcast('TripFactory-tripFocusChange', {index: index});
      });
    }
    function onTripFocusChange (subScope, subCb) {
      subScope.$on('TripFactory-tripFocusChange', subCb);
      subFocusScopes.push(subScope);
    }

    return TripFactory;

  }]);
})();

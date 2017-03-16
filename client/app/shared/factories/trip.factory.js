( function () {
  'use strict';
  angular.module('app.factories')
    .factory('TripFactory', [ '$q', '$http', 'LoginService', 'API_ENDPOINT', function($q, $http, LoginService, API_ENDPOINT) {

    var recentTripList,
      subListScopes = [],
      subFocusScopes = [],
      TripFactory = {
       getAll: getAll,
       onListChange: onListChange,
       onTripFocusChange: onTripFocusChange,
       notifyTripFocusChange: notifyTripFocusChange,
       convertAddressToCoordinates: convertAddressToCoordinates,
       createOne: createOne,
       deleteOne: deleteOne,
       data: {
         }
       };

    function convertAddressToCoordinates (address) {
      var deferred = $q.defer();
      $http.get(API_ENDPOINT + '/Trips/convertGeocode',{headers: {address: address}})
      .then(function(res){
        deferred.resolve(res.data.response);
      },function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function createOne(name, sourceLatLng, destLatLng, range) {
      var deferred = $q.defer();
      $http.post(API_ENDPOINT + '/Trips/populate',{
        name: name,
        source: sourceLatLng,
        dest: destLatLng,
        range: range
      }).then(function(res){
        getAll().then(function() {
          deferred.resolve(true);
        });
      },function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function deleteOne(tripId) {
      var deferred = $q.defer();
      $http.delete(API_ENDPOINT + '/Trips/' + tripId)
        .then(function(res){
        getAll().then(function() {
          deferred.resolve(true);
        });
      },function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function getAll () {
      var deferred = $q.defer();
      $http.get(API_ENDPOINT + '/Trips',{
        params: {
          'access_token': LoginService.userData.accessToken
        }
      }).then(function(res){
        TripFactory.data.trips = JSON.parse(JSON.stringify(res.data));
        console.log('getAll',TripFactory.data.trips);
        notifyListChange();
        deferred.resolve(res.data);
      },function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
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

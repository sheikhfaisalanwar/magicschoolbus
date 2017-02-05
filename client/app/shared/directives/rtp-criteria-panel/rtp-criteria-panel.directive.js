( function () {
  'use strict';
  angular.module('app.directives', [])
  .controller('RTPController', ['$scope', function($scope) {
    $scope.customer = {
      name: 'Naomi',
      address: '1600 Amphitheatre'
    };
  }])
  .directive('rtpCriteriaPanel', ['TripFactory', function(TripFactory) {
    return {
      templateUrl: 'app/shared/directives/rtp-criteria-panel/rtp-criteria-panel.html',
      link: link
    };

    function link(scope, elem, attrs) {
        TripFactory.getAll().then(function(res) {
          scope.previousTrips = res;
        });

        scope.openTrip = function (tripIndex) {
          console.log(tripIndex);
          TripFactory.notifyTripFocusChange(tripIndex);
        };


    }
  }]);
})();

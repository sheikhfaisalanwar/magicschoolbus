angular.module('app.directives', [])
.controller('RTPController', ['$scope', function($scope) {
  $scope.customer = {
    name: 'Naomi',
    address: '1600 Amphitheatre'
  };
}])
.directive('rtpCriteriaPanel', function() {
  return {
    templateUrl: 'app/shared/directives/rtp-criteria-panel/rtp-criteria-panel.html',
    link: link
  };

  function link(scope, elem, attrs) {
    console.log('hello');
    scope.previousTrips = [
      {
        name: 'Trip A',
        distance: '10km',
        createdOn: '1-2-2017'
      },
      {
        name: 'Trip B',
        distance: '101km',
        createdOn: '1-2-2017'
      },
      {
        name: 'Trip C',
        distance: '21km',
        createdOn: '1-2-2017'
      },
    ];
  }
});

( function () {
  'use strict';
  angular.module('app.directives', [])
  .controller('RTPController', ['$scope', function($scope) {
    $scope.customer = {
      name: 'Naomi',
      address: '1600 Amphitheatre'
    };
    $scope.tripName = 'French Toast Adventure';
    $scope.origin = 'Kingston, ON';
    $scope.destination = 'Ottawa, ON';
    $scope.distance = '196 km';
    $scope.poiList= [
      {
        "name" : "Canadian Museum of History",
        "link" : "http://www.historymuseum.ca/"
      },
      {
        "name" : "1000 Islands",
        "link" : "http://www.visit1000islands.com/"
      },
      {
        "name" : "Canadian Museum of Civilization",
        "link" : "http://outaouais.quebecheritageweb.com/attraction/canadian-museum-civilization-gatineau"
      }];
     $ionicModal.fromTemplateUrl('app/components/menu/poiModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.PoiModal = modal;
      });
      vm.showPoiModal= function() {
        vm.PoiModal.show();
      };
      $scope.closePoiModal = function() {
        vm.PoiModal.hide();
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

'use strict';
var _ = require('lodash');
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyB2rSOfI6W1TfNZ3hH0h5SO-OQVxQ4hPCc'
});
module.exports = function(Trips) {


  Trips.convertGeocode = function (address, cb) {
    googleMapsClient.geocode({
      address: address,
      region: 'CA'
    }, function (err, res) {
      if (err) { return cb(new Error('Geocode Converting Failed ', err));}
      cb(null, res.json.results[0].geometry.location);
    });
  };


  Trips.populate = function(requestBody, cb) {
    if (!_.isNumber(requestBody.source.lat) || !_.isNumber(requestBody.source.lng)  ||
    !_.isNumber(requestBody.dest.lat) || !_.isNumber(requestBody.dest.lng) || !_.isNumber(requestBody.range)) {
      return cb(new Error('Validation Failed'));
    }
    requestBody.range *= 1000;
    googleMapsClient.directions({
      origin: requestBody.source,
      destination: requestBody.dest,
      mode: 'driving'
    }, function (err, res) {
      var runningTally = 0;
      var latLngPairs = [requestBody.source];
      // cb(null, res.json.routes[0].legs[0]);
      _.forEach(res.json.routes[0].legs[0].steps, function (step) {
        runningTally+= step.distance.value;
        if (runningTally > requestBody.range/2) {
          latLngPairs.push(step['end_location']);
          runningTally = 0;
        }
      });
      latLngPairs.push(requestBody.dest);
      var tripPoiList = [];
      _.forEach(latLngPairs, function (latLng) {
        return googleMapsClient.placesNearby({
          location: [latLng.lat, latLng.lng],
          radius: requestBody.range,
          type: 'point_of_interest',
          keyword: 'attraction'
        }, function(error, nearbyRes) {
          _.forEach(nearbyRes.json.results, function (poi) {
            Trips.app.models.Poi.find({where:{'place_id': poi['place_id']}}, function (error1, findResult) {
              if (error1) { return cb(new Error('POI Find Failed', err)); }
              if (findResult.length > 0) {
                tripPoiList.push(findResult[0]);
              }
              else {
                var poiNew =  {
                  location: poi.geometry.location,
                  name: poi.name,
                  'place_id': poi['place_id'],
                  types: poi.types
                };
                console.log('Trips.app.models.Poi', Trips.app.models.Poi);
                Trips.app.models.Poi.create(poiNew, function (error2, poiNewAck) {
                  if (error2) { return cb(new Error('POI Crate Failed')); }
                  tripPoiList.push(poiNewAck);
                });
              }
            });
          });
        });
      });
      console.log('distance', res.json.routes[0].legs[0].distance);
      setTimeout(function () {
        var newTrip = {
          name: 'Trip ' + Math.floor((Math.random() * 100) + 1),
          start: requestBody.source,
          end: requestBody.dest,
          distance: res.json.routes[0].legs[0].distance.value ,
          pois: JSON.parse(JSON.stringify(tripPoiList)),
          userId: Trips.app.currentUserId
        };
        console.log('newTrip', newTrip);
        Trips.create(newTrip, function (error3, newTripAck) {
          console.log(error3);
          console.log('newTripAck', newTripAck);
          return cb(null, newTripAck);
        });
      }, 5000);
    });
  };

  Trips.remoteMethod('convertGeocode', {
    description: 'Convert Geocode into an address',
    http: {
        path: '/convertGeocode',
        verb: 'get'
    },
    accepts: { arg: 'address', type: 'string'} ,
    returns: { arg: 'response', type: 'object', http: {source:'root'}}
  });

  Trips.remoteMethod('populate', {
    description: 'Populate the trip with new search queries',
    http: {
        path: '/populate',
        verb: 'post'
    },
    accepts: { arg: 'data', type: 'object', http:{source:'body'}} ,
    returns: {arg: 'response', type: 'object', http: {source:'root'}}
  });
};

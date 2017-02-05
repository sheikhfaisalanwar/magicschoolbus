'use strict';
var _ = require('lodash');
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyB2rSOfI6W1TfNZ3hH0h5SO-OQVxQ4hPCc'
});
module.exports = function(Trips) {


  Trips.covertGeocode = function (address, cb) {
    googleMapsClient.geocode({
      address: address,
      region: 'CA'
    }, function (err, res) {
      if (err) { return cb(new Error('Geocode Converting Failed ', err));}
      cb(null, res.json.results[0].geometry.location);
    });
  };
  Trips.populate = function(data, cb) {
    if (!_.isNumber(data.source.lat) || !_.isNumber(data.source.lng)  ||
    !_.isNumber(data.dest.lat) || !_.isNumber(data.dest.lng) || !_.isNumber(data.range)) {
      return cb(new Error('Validation Failed'));
    }
    googleMapsClient.directions({
      origin: data.source,
      destination: data.dest,
      mode: 'driving'
    }, function (err, res) {
      // cb(null, res);
      var runningTally = 0;
      var latLngPairs = [data.source,data.dest];
      _.forEach(res.json.routes[0].legs.steps, function (step) {
        runningTally+= step.distance.value;
        console.log('runningTally', runningTally);
        console.log('step.distance.value', step.distance.value);
        if (runningTally > data.range) {
          latLngPairs.push(step['end_location']);
          runningTally = 0;
        }
      });
      console.log('latLngPairs', latLngPairs);
      _.map(latLngPairs, function (latLng) {
        googleMapsClient.placesNearby({
          location: latLng,
          radius: data.range,
          type: 'point_of_interest',
          keyword: 'attraction'
        }, function(err, res) {
          cb(null, res);
        });
      });
    });
  };

  Trips.remoteMethod('covertGeocode', {
    description: 'Convert Geocode into an address',
    http: {
        path: '/covertGeocode',
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

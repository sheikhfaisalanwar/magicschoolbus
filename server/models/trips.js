'use strict';
var _ = require('lodash');
var googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API
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

    function sendPopulatedResult(tripDistance,poiList) {
      setTimeout(function () {
        var newTrip = {
          name: requestBody.name,
          start: requestBody.source,
          end: requestBody.dest,
          distance: tripDistance ,
          pois: JSON.parse(JSON.stringify(poiList)),
          userId: Trips.app.currentUserId,
          createdOn: new Date()
        };
        Trips.create(newTrip, function (error3, newTripAck) {
          return cb(null, newTripAck);
        });
      },300);
    }

    if (!_.isNumber(requestBody.source.lat) || !_.isNumber(requestBody.source.lng)  ||
    !_.isNumber(requestBody.dest.lat) || !_.isNumber(requestBody.dest.lng) || !_.isNumber(requestBody.range)) {
      return cb(new Error('Validation Failed'));
    }

    var listAdditionDone = false;
    requestBody.range *= 1000;
    googleMapsClient.directions({
      origin: requestBody.source,
      destination: requestBody.dest,
      mode: 'driving'
    }, function (err, res) {
      if ( err ) { return cb(new Error('Directions Fetch Failed', err)); }
      var partialDistCntr = 0,
        latLngPairs = [requestBody.source],
        directionSteps,
        tripPoiList = [];

      directionSteps = _.get(res, 'json.routes[0].legs[0].steps');
      if (!directionSteps) { return cb(new Error('Direction Segment Fetch Failed', err)); }
      _.forEach(directionSteps, function (step, stepIndex) {
        partialDistCntr+= step.distance.value;
        if ((partialDistCntr > requestBody.range/5)) {
          latLngPairs.push(step['start_location']);
          partialDistCntr = 0;
        }
      });
      latLngPairs.push(requestBody.dest);
      _.forEach(latLngPairs, function (latLng) {
        return googleMapsClient.placesNearby({
          location: [latLng.lat, latLng.lng],
          radius: requestBody.range,
          type: 'point_of_interest',
          keyword: 'attraction'
        }, function(error, nearbyRes) {
          if (error) {return  cb(new Error('POI List Fetch Failed', error)); }
          var nearByPoiList = _.get(nearbyRes, 'json.results');
          if (!nearByPoiList) {return  cb(new Error('Empty POI List', error));}
          _.forEach(nearByPoiList, function (poi, poiIndex) {
            Trips.app.models.Poi.find({where:{'placeId': poi['place_id']}}, function (error1, findResult) {
              if (error1) { return cb(new Error('POI Find Failed', err)); }
              if (findResult.length > 0) {
                tripPoiList.push(findResult[0]);
              }
              else {
                var poiNew =  {
                  location: poi.geometry.location,
                  name: poi.name,
                  'placeId': poi['place_id'],
                  types: poi.types
                };
                Trips.app.models.Poi.create(poiNew, function (error2, poiNewAck) {
                  if (error2) { return cb(new Error('POI Crate Failed'), error2); }
                  tripPoiList.push(poiNewAck);
                });
              }
              if ((listAdditionDone === false) && (latLng === requestBody.dest) && (poiIndex === nearByPoiList.length - 1)) {
                listAdditionDone = true;
                return sendPopulatedResult(res.json.routes[0].legs[0].distance.value, tripPoiList);
              }
            });
          });
        });
      });
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

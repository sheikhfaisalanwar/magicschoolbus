var loopback = require('loopback');

var properties = {};

var options = {
  relations: {
    preferences: {
      model: 'Trips',
      type: 'hasMany',
      foreignKey:'userId'
    }
  },
  acls: []
};

var user = loopback.Model.extend('user', properties, options);

var express = require("express")
  , app = express();
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyB2rSOfI6W1TfNZ3hH0h5SO-OQVxQ4hPCc'
});

//url/textToLL?textAddress=""
app.get('/textToLL' , function (req, res){
    console.log(googleMapsClient);
    googleMapsClient.geocode({
      address: req.query.textAddress
    }, function(err, response) {
    if (!err) {
      console.log(response.json.results);
      res.send(response.json.results);
    }
  })
});

//url/getDirectionTo?startl=""&destl=""
 app.get('/getDirectionTo' , function (req, res){
   console.log(googleMapsClient);
   googleMapsClient.directions({
       origin: req.query.startl,
       destination: req.query.destl
     }, function(err, response) {
     if (!err) {
       console.log(response.json.results);
       res.send(response.json.results);
     }
   })
 });






var server = app.listen(8080, function () {

  var host = server.address();
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port)

})

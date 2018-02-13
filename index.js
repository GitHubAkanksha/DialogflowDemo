// JavaScript source code

"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

var http = require('http');

function extractJSON(options, callback){
	http.request(options, function(res){
		var body = '';

		res.on('data', function(chunk){
			body += chunk;
		});

		res.on('end', function(){
			var response = JSON.parse(body);
			//console.log(result);
			callback(null, response);
		});

		res.on('error', callback);
	})
	.on('error', callback)
	.end();
}

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/moviesworld", function(req, res) {
  var speech = '';

  var actionName = 
    req.body.result &&
    req.body.result.action    
      ? req.body.result.action
      : "Seems like some problem. Tell me again.";
	
  var movieName =
    req.body.result &&
    req.body.result.parameters &&
    req.body.result.parameters.moviename
      ? req.body.result.parameters.moviename
      : "Seems like some problem. Tell me again.";

  var options = {
		host: 'http://www.omdbapi.com',
		port: 8080,
		path: '/?apikey=44269ab5&t=' + movieName,
		method: 'GET'
  };

  extractJSON(options, function(err, result){
	if(err){
		return console.log('Error while trying to retrieve values', err);
	}
	console.log(result);
  });


  return res.json({
    speech: speech,
    displayText: speech,
    source: "webhook-moviesworld-sample"
  });
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});


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
  var speech = 'This is a test from the web service!';

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
  
  //speech += actionName + movieName;

  if(actionName == "get.movieinfo"){
	speech = "You want to know about movie " + movieName + ". Is that correct?";

	return res.json({
		speech: speech,
		displayText: speech,
		source: "webhook-moviesworld-sample"
	});
  }
  else
  {
	speech = "You have chosen something else";

	return res.json({
		speech: speech,
		displayText: speech,
		source: "webhook-moviesworld-sample"
	});
  }    
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});


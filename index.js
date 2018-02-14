// JavaScript source code

"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

const http = require("http");

function extractJSON(reqURL, callback){	
	http.get(reqURL, resp => {

	  resp.setEncoding("utf8");
	  let body = "";

	  resp.on("data", data => {
		body += data;
	  });

	  resp.on("end", () => {
		var response = JSON.parse(body);
		callback(null, response)
	  });

	  resp.on('error', callback);
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
  
  //speech += actionName + movieName;

  if(actionName == "get.movieinfo"){
	speech = "You want to know about movie " + movieName + ". Is that correct?";

	var options = {
		host: 'www.omdbapi.com',
		port: 8080,
		path: '/?apikey=44269ab5&t=' + movieName,
		method: 'GET'
	};

	var URL = "http://www.omdbapi.com/?apikey=44269ab5&t=frozen"

	extractJSON(URL, function(err, result){
		if(err){
			speech = 'Something went wrong! Please try again later.';
			return speech;
		}
		else
		{
			speech = result;
			return speech;
		}

		return res.json({
			speech: speech,
			displayText: speech,
			source: "webhook-moviesworld-sample"
		});
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


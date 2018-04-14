var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config');

router.get('/', function(req, res, next) {
  var deptDate = req.query.deptDate,
  src = req.query.src, 
  dest = req.query.dest, 
  no_of_passengers = req.query.no_pass,
  classType = req.query.class;
  if(!classType){
  	classType = "E";
  }

  if(!no_of_passengers){
  	no_of_passengers = 1;
  }
  
  var URL = config.magical_backend + 
		"?classType=" + classType +
		"&fromCity="+ src +
		"&toCity="+ dest +
		"&deptDate=" + deptDate +
		"&noOfChd=0&noOfInfnt=0&noOfAdlts="+ no_of_passengers +
		"&lob=Flight"+
		"&noOfChd=0"+
		"&noOfInfnt=0"+
		"&tripType=O"+
		"&tripTypeDup=O";

	console.log(URL);
  request(URL, function (error, response, body) {
	  if (error) {
	  	console.log(error);
		  res.json({
		  	api: 'v1.0.0',
		  	msg: 'There was an error'
		  });
	  }
	  
		try{
			  body = JSON.parse(body);
				var cheapest_flight_fare = body.flights[0].af;
			  var flight_class = body.flights[0].le[0].cls;
			  var departure_date = body.flights[0].le[0].fmtDeparture;
			  var departure_time = body.flights[0].le[0].fmtDepartureTime;
			  var arrival_date = body.flights[0].le[0].fmtArrival;
			  var arrival_time = body.flights[0].le[0].fmtArrivalTime;
			  var stops = (body.flights[0].le[0].noOfStops == "Non Stop"? 0:body.flights[0].le[0].noOfStops);
			  var fare = body.flights[0].af;
			  res.json({fare:fare});
		}catch(exp){
			res.json({
		  	api: 'v1.0.0',
		  	msg: 'There was an error'
		  });	
		}
	});
});

module.exports = router;

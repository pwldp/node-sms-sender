#!/usr/bin/env node
var http = require('http')
    , querystring = require("querystring")
    , util = require('util')
    ;
//
var options = {
    host: '10.89.1.80',
    port: 13013,
    path: "/cgi-bin/sendsms?username=smssend&password=qwe123&to=693911792&text=Hello+world+from+NodeJS+app."
};
//
function sendSMS(phone, text, cb){
    //
    var args = {
	"username": "smssend",
	"password": "qwe1231",
	"to": phone,
	"text": text
    };
    //
    var options = {
	host: '10.89.1.80',
	port: 13013,
	//path: "/cgi-bin/sendsms?username=USER&password=PASSWORD&to=123456789&text=Hello+world+from+NodeJS+app."
	path: "/cgi-bin/sendsms?"+ querystring.stringify(args)
    };
    //
    //console.log("options="+util.inspect(options));
    http.get(options, function(res) {
	//console.log("Got response: " + util.inspect(res));
	var status = parseInt(res.statusCode, 10);
	if (status===202){
	    return cb(null, true);
	} else {
	    return cb(status, false);
	};
	
    });/*
    .on('error', function(e) {
	//console.log("Got error: " + e.message);
	//console.log("Got error: " + util.inspect(e));
	return cb(e.message, null);
    });*/
};
//
/*
var sms= {
    "phone" : "693911792",
    "text": "Hello from NodeJS func."
};
sendSMS(sms.phone, sms.text, function(err, res){
    if (err) console.error("sendSMS::ERROR: "+ util.inspect(err));
    console.log("sendSMS:: isOK="+res);
});
*/
//
// EOF
//
#!/usr/bin/env node
var conf = require('../../conf')
    , http = require('http')
    , querystring = require("querystring")
    , moment = require("moment")
    , util = require('util')
    , sendSMS = require('./sendsms')
    , saveSMS = require("./dbh_pgsql").saveSMS
    ;
//
module.exports = function handleSmsQuery(query, cb){
    console.log("handleSmsQuery= "+util.inspect(query));
    var msg = "";
    //
    // dane nadawcy wyszukac w DB
    var senderInfo = {
	"name": "Fake Sender Name",
	"phone": query.sender
    };
    //
    if (query.query){
	var q = query.query.toLowerCase().replace(/^\s+|\s+$/g,'');
	if (q==="ping" || q==="test"){
	    msg = "pong at "+ moment().format("YYYY-MM-DD HH:mm:ss");
	    sendSMS(query.sender, msg, function(err, res){
		if (err) return cb("handleSmsQuery:: SMS sending problem.", false);
	    });
	} else if (q==="fulltest" || q==="testfull") {
	    var sms = {
		sname: senderInfo.name,
		rname: senderInfo.name,
		phone: senderInfo.phone,
		text: "SMS query handler full test response for "+senderInfo.name+" ("+senderInfo.phone+"), sent at "+moment().format("YYYY-MM-DD HH:mm:ss")+"."
	    };
	    saveSMS(sms);
	};
    } else {
	return cb("Query is required!", false);
    }
    return cb(null, true);
};
//
// EOF
//
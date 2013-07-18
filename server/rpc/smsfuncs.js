// 
// SMS functions
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
// 2013.07.01
//
var ss = require("socketstream")
    , conf = require("../../conf")
    , sendDemoSms = require("../libs/sendDemoSms")
    //, sendProdSMS = require("../libs/sendsms")
    , saveSMS = require("../libs/dbh_pgsql").saveSMS
    ;
//
exports.actions = function(req, res, ss) {
    req.use('session');

  // Uncomment line below to use the middleware defined in server/middleware/example
  //req.use('example.authenticated')

return {
    //
    getSendingStats: function(){
	var ret = {
	    "l24h": "0",
	    "l7days": "0",
	    "l30days": "0",
	    "l365days": "0"
	};
	return res({"err":null, "ret":ret});
    },
    //
    getSmsQueue: function(){
	return res({"err":null, "ret":[]});
    },
    //
    sendSMS: function(sms){
	console.log("sendSMS...");
	//
	if (!sms) return res({"err":"Parameters are required", "ret":'ERR'});
	if (!sms.sname) return res({"err":"Sender name is required", "ret":'ERR'});
	if (!sms.rname) return res({"err":"Recipient name is required", "ret":'ERR'});
	if (!sms.phone) return res({"err":"Recipient phone is required", "ret":'ERR'});
	if (!sms.text) return res({"err":"Contents is required", "ret":'ERR'});
	//
	if (conf.mode==="prod"){
	    saveSMS(sms);
	    /*
	    sendProdSMS(sms.phone, sms.text, function(err, ret){
		if (err) return res({"err":err, "ret":'ERR'});
		return res({"err":null, "ret":'OK'});
	    });
	    */
	} else {
	    sendDemoSms(sms, function(err, ret){
		if (err) return res({"err":err, "ret":'ERR'});
		return res({"err":null, "ret":'OK'});
	    });
	};
    },

};
};
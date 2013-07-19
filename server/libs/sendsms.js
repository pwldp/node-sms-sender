//
// Dariusz PAWLAK <pawlakdp@gmail.com>
//
// MIT License
//
var conf = require('../../conf')
    , http = require('http')
    , querystring = require("querystring")
    , util = require('util')
    ;
//
String.prototype.normalizePhone = function(){
    var retPhone = this.replace(/[^\d]/g, '');
    if (retPhone[0]==="+") retPhone=retphone.slice(1);
    if (retPhone[0]==="4" && retPhone[1]==="8") retPhone=retPhone.slice(2);
    if (retPhone.length!=9) retPhone=-1;
    return retPhone;
};
            
String.prototype.isMobilePhoneInPL = function(){
    var plMobilePrefixes = ['6666','690','691','692','693','694','695','696','50','51','53','57','60','66','69', '72', '73', '78','79','88'];
    var retVal = false;
    var phone = this.normalizePhone();
    //var phone = this;
    if (phone!=-1){
	for (var i=0, len=plMobilePrefixes.length; i<len; i++){
            if (String(phone.substr(0,plMobilePrefixes[i].length))===String(plMobilePrefixes[i])){
                retVal = true;
        	break;
    	    };
	};
    };
    return retVal;
};
//
module.exports = function sendSMS(phone, text, cb){
    //
    if (!phone.isMobilePhoneInPL()) return cb("Numer telefonu musi być numerem sieci komórkowej w Polsce.", false);
    //
    var args = {
	"username": conf.kannel.user,
	"password": conf.kannel.password,
	"to": phone,
	"text": text
    };
    //
    var options = {
	host: conf.kannel.host,
	port: conf.kannel.port,
	//path: "/cgi-bin/sendsms?username=USER&password=PASSWORD&to=123456789&text=Hello+world+from+NodeJS+app."
	path: "/cgi-bin/sendsms?"+ querystring.stringify(args)
    };
    //
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
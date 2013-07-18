//
// Sending fake demo SMS
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
// 2013.07.01
//
var ss = require('socketstream')
    , util = require('util')
    , moment = require("moment")
    , Puid = require("puid")
    , events = require('events')
    , evEmitter = new events.EventEmitter()
    ;
//
evEmitter.on('new_demo_sms', function(sms){
    console.log("evEmitter.handler: New sms in queue, id="+sms.id);
    
    if (sms.status==="new"){
	console.log("Obrabiam SMS id="+sms.id);
	var now = moment().format("YYYY-MM-DD HH:mm:ss");
	ss.api.publish.all('smsstatus', {"id":sms.id, "status":"sending", "dt":now});
	//
	// simulating send SMS
	var msDelay = 2000+Math.floor((Math.random()*10000)+1);
	setTimeout(function(){
	    console.log("Delayed SMS send, id="+sms.id);
	    now = moment().format("YYYY-MM-DD HH:mm:ss");
	    ss.api.publish.all('smsstatus', {"id":sms.id, "status":"sent", "dt":now});
	}, msDelay);
    };
    
});    
//
module.exports = function sendDemoSms(sms ,cb){
    //
    //return function(sms, cb){
    if (!sms) return cb("Parameters are required", false);
    if (!sms.sname) return cb("Sender name is required", false);
    if (!sms.rname) return cb("Recipient name is required", false);
    if (!sms.phone) return cb("Recipient phone is required", false);
    if (!sms.text) return cb("Contents is required", false);
    //
    // generate unique identifier for sms
    puid = new Puid();
    sms.id = puid.generate();
    sms.status = "new";
    //
    // set sms's send date and time
    sms.dtin= moment().format("YYYY-MM-DD HH:mm:ss");
    //
    console.log("demo SMS="+util.inspect(sms));
    //
    ss.api.publish.all('newsms', sms);
    //
    evEmitter.emit("new_demo_sms",sms);
    //
    return cb(null, true);
    //};
};
//
// EOF
//
//
// Nodejs SMS sender with Kannel and PostgerSQL as a backend and dedicated dashboard.
// 
// Dariusz Pawlak <pawlakdp@gmail.com>
// 2013.07.15
//
//
var ss = require('socketstream')
    , conf = require('./conf')
    , events = require('events')
    , eventEmitter = new events.EventEmitter()
    , http = require('http')
    , moment = require('moment')
    , util = require('util')
    , sendDemoSms = require('./server/libs//sendDemoSms')
//    , dbhPgsql = require('./server/libs/dbh_pgsql')
    , querystring = require('querystring')
    , url = require('url')
    , handleSmsQuery = require('./server/libs/smsQueryHandler')
    ;

// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'smsboard.html',
  css:  [],
  code: ['libs', 'app'],
  tmpl: '*'
});
// Serve this client on the root URL
ss.http.route('/', function(req, res){
    res.serveClient('main');
});
//
//
//
ss.http.route('/smsquery', function(req, res){
    //console.log("REQ="+util.inspect(req));
//    var qs = querystring.parse(req.url);
//    console.log("REQ.qs="+util.inspect(qs));
    var uu = url.parse(req.url, true);
    console.log("REQ.uu="+util.inspect(uu.query));
    handleSmsQuery(uu.query, function(err, ret){
	if (err) console.error("Error: "+err);
    });
    //
    res.writeHead(200, {'Content-Type': 'text/plain' });
    res.end("OK");
});
// Code Formatters
//ss.client.formatters.add(require('ss-stylus'));
// Use server-side compiled Hogan (Mustache) templates. Others engines available
//ss.client.templateEngine.use(require('ss-hogan'));
// Minimize and pack assets if you type: SS_ENV=production node app.js
if (ss.env === 'production') ss.client.packAssets();
//
// send date and time to client
if (conf.sendDtToClient){
    setInterval(function() {
	var now = moment().format("YYYY-MM-DD HH:mm");
	ss.api.publish.all('dt', now);
    }, 10000 );
};
//
// Start web server
var server = http.Server(ss.http.middleware);
var listPort =  process.env.PORT || 3001;
console.log("Server listen on port: "+listPort);
server.listen( listPort );
// Start SocketStream
ss.start(server);
//
// run app in configured mode
//
if (conf.mode==="demo"){
    console.log("DEMO MODE");
    var Puid = require("puid");
    puid = new Puid();
    //
    // send fake sms info
    var maxSmsInTestPack = 5;
    //
    setInterval(function() {
	var smsNum = Math.floor((Math.random()*maxSmsInTestPack)+1);
	var now = moment().format("YYYY-MM-DD HH:mm:ss");
	for (var i=0; i<smsNum; i++){
	    var sms = {
		"id": puid.generate(),
		"dtin":now,
		"sname": "Demo Sender",
		"rname": "Demo Recipient",
		"phone": "123456789",
		"status":"new",
		"text": "bla bla"
	    };
	    console.log("New sms id="+util.inspect(sms));
	    sendDemoSms(sms, function(err, ret){
		if (err) return console.error(err);
		return true;
	    });
	};
    }, 15000 );
} else if (conf.mode==="prod"){
    console.log("MODE: PRODUCTION");
    //
//    readSmsFromQueue();
    
};
//
// EOF
//
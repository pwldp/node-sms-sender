//
// node-kannel-dashboard
// PostgreSQl database handler
//
// Dariusz Pawlak <pawlakdp@gmail.com>
// 2013.07.15
//
var conf = require("../../conf")
    , ss = require("socketstream")
    , pg = require("pg")
    , util = require("util")
    , moment = require("moment")
    , async = require("async")
    , sendSMS = require("./sendsms")
    //, bigInt = require("big-integer")
    ;
//
if (conf.mode==="prod"){
    var client = new pg.Client(conf.pgURI);
    client.connect(function(data){
	console.log("Podłączony do PgSQL ??");
	// check another kannel sender is connected do PgSQL
/*
	var sql = "SELECT * FROM sms_status";
	client.query(sql,   function(err, res){
	    if (err) console.log("ERROR: "+err);
	    console.log("res="+util.inspect(res));
	});
*/
    });
    client.on('error', function(data){
	console.error("PostgreSQL error: "+data);
    });
    //
    client.query('LISTEN "new_sms_in_queue"');
    //
    client.on('notification', function(data) {
	console.log("NEW notification from PgSQL: "+util.inspect(data));
	var jsonSMS = JSON.parse(data.payload);
	/*
	var sms = {
	    sname: jsonSMS.sender_name,
	    rname: jsonSMS.receiver_name,
	    phone: jsonSMS.receiver_phone_number,
	    text: jsonSMS.sms_contents
	};
	*/
	sendSMS(jsonSMS.receiver_phone_number, jsonSMS.sms_contents, function(err, ret){
	    if (err) {
		console.error("Error: "+err );
		ss.api.publish.all('smsstatus', {"id":jsonSMS.id, "status":"error", "dt":now});
	    } else {
		now = moment().format("YYYY-MM-DD HH:mm:ss");
		ss.api.publish.all('smsstatus', {"id":jsonSMS.id, "status":"sent", "dt":now});
	    };
	    return true;
	});
    });
};
//
//
/*
  [ { id: 39926,
       ts_add_to_queue: Thu Jul 18 2013 13:35:05 GMT+0200 (CEST),
       ts_sent: Thu Jul 18 2013 13:35:05 GMT+0200 (CEST),
       status: 'new',
       sender_id: 0,
       sender_name: 'Fake Sender Name',
       receiver_id: 0,
       receiver_name: 'Fake Sender Name',
       receiver_phone_number: '48693911792',
       sms_contents: 'SMS query handler full test response for Fake Sender Name (48693911792), sent at 2013-07-18 13:35:18.',
       note: '2013-07-18 13:35:18' } ],
*/
exports.saveSMS = function(sms) {
    console.log("saveSMS(): "+util.inspect(sms));
    if (sms.sname && sms.rname && sms.phone && sms.text){
	now = moment();
	client.query(
	    "INSERT INTO sms_send_queue (sender_name,receiver_name,receiver_phone_number,status,sms_contents,note) values ($1,$2,$3,'new',$4,$5) RETURNING *",
	    [sms.sname, sms.rname, sms.phone, sms.text, ""+now.format("YYYY-MM-DD HH:mm:ss")], 
	    function(err, res){
		if (err) console.error("ERROR: "+err);
		//console.log("After INSERT res="+util.inspect(res));
		//
		//var resJson = JSON.parse(data.payload);
		sms.id = res.rows[0].id;
		sms.dtin = res.rows[0].ts_add_to_queue;
		ss.api.publish.all('newsms', sms);
	    }
	);

    } else {
	console.error("saveSMS:error: No required arguments.");
    };
};
//
// get send sms statistics
//exports.getSmsStatisticts = function() {
function getSmsStatisticts(){
    console.log("getSmsStatisticts...");
    var curDate = new Date();
    //var current_hour = date.getHours();
    var curYear = curDate.getFullYear();
    var curMonth = curDate.getMonth() + 1;
    var monthsList = [];
    var curTmp= '';
    for (var i=0; i<12; i++){
	//console.log("monthsList counter="+i);
	curTmp = curYear + "-" + (curMonth<=9 ? '0' + curMonth : curMonth);
	//console.log("curTmp="+curTmp);
	monthsList.push(curTmp);
	curMonth--;
	if (curMonth==0){
	    curYear--;
	    curMonth=12;
	}
    };
    console.log("monthsList="+util.inspect(monthsList));
    //
    // query Db
    client.query("SELECT count(*) FROM sms_archive WHERE to_char(ts_sent,'YYYY-MM')=$1", ["2013-05"],
	function(err, res){
	    if (err) console.log("ERROR: "+err);
	    console.log("After INSERT res="+util.inspect(res));
	}
    );
    //
    var last12months = [];
    async.forEach(monthsList, function(month, callback) { 
	client.query("SELECT count(*) FROM sms_archive WHERE to_char(ts_sent,'YYYY-MM')=$1", [month],
	    function(err, res){
		if (err) console.log("ERROR: "+err);
		console.log("After INSERT res="+util.inspect(res.rows[0].count));
		last12months.push( [month, res.rows[0].count] );
	});
    }, function(err) {
        //if (err) return next(err);
        //Tell the user about the great success
        console.log("last12months="+util.inspect(last12months));
    });
    //console.log("last12months="+util.inspect(last12months));

};

//getSmsStatisticts();
/*
var os = require( 'os' );
var networkInterfaces = os.networkInterfaces( );
console.log( networkInterfaces );
*/
//
// Tests
//
/*
var maxSmsInTestPack=5;
setInterval(function() {
    now = moment();
    var smsNum = Math.floor((Math.random()*maxSmsInTestPack)+1);
    console.log("\nInsert  SMS into queue "+smsNum +" SMSs, at: "+ now );
    for (var i=0; i<smsNum; i++){
	console.log("SMS #"+i+" at "+now)
	client.query("INSERT INTO sms_send_queue (sender_name,receiver_name,receiver_phone_number,status,sms_contents,note) values ('foo','boo','00000000000','new',$1,$2)",[i+". "+now.format("YYYY-MM-DD HH:mm:ss"), "timestamp:"+now.format("X")], function(err, res){
	    if (err) console.log("ERROR: "+err);
	    console.log("res="+util.inspect(res));
	});
    };
}, 5000 );
*/
//
// EOF
//
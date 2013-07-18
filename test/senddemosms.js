//
// test funkcji wysylania demo smsa
//
var ass = require('socketstream');
var util = require("util");
var sendDemoSms = require("../sendDemoSms");
var ss = ass.start();
//
var sms = {
    "sname": "Demo Sender",
    "rname": "Demo Recipient",
    "rphone": "1234567890",
    "text": "Helo from node kannel sender."
};
//
describe('sendDemoSms', function(){
    it('should get OK', function(done){
	sendDemoSms(sms, function(err, ret){
	    console.log("SMS sent:"+util.inspect(ret));
	    done();
	});
/*
	ss.rpc('auth.isLogged', function(ret){
	console.log("isLOgged.ret="+util.inspect(ret),ret[0]);
	ret[0].should.not.have.keys('err');
        done();
	});
*/
    });
});
//
// EOF
//
//
// test funkcji autoryzacji
//
var ass = require('socketstream');
var util = require("util");
//
var ss = ass.start();
//
describe('smsfuncs.getSmsQueue', function(){
    it('should get sms queue array', function(done){
	ss.rpc('smsfuncs.getSmsQueue', function(ret){
	//console.log("ret="+util.inspect(ret),ret[0]);
	ret[0].ret.should.be.an.instanceOf(Array);
	ret[0].should.not.have.keys('err');
        done();
	});
    });
});
//
describe('smsfuncs.getSendingStats', function(){
    it('should get sms sending stats', function(done){
	ss.rpc('smsfuncs.getSendingStats', function(ret){
	//console.log("ret="+util.inspect(ret),ret[0]);
	ret[0].ret.should.have.keys('l24h','l7days','l30days','l365days');
	ret[0].should.not.have.keys('err');
        done();
	});
    });
});
//
describe('smsfuncs.sendSMS', function(){
    it('should get OK', function(done){
	var sms = {
	    "sname": "Demo Sender",
	    "rname": "Demo Recipient",
	    "rphone": "1234567890",
	    "text": "Helo from node kannel sender."
	};
	ss.rpc('smsfuncs.sendSMS', sms, function(ret){
	console.log("ret="+util.inspect(ret),ret[0]);
	
	if (ret[0].ret==="ERR"){
	    console.log("sendSMS ret="+util.inspect(ret[0]));
	};
	ret[0].ret.should.not.equal('ERR');
        done();
	});
    });
});
//
// EOF
//
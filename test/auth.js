//
// test funkcji autoryzacji
//
var ass = require('socketstream');
var util = require("util");
var ss = ass.start();
//
describe('auth.checkUserPswd',function(){
    it('should get true in ret', function(done){
	ss.rpc('auth.checkUserPswd', "demo", "demo", function(ret){
	//console.log("ret="+util.inspect(ret),ret[0]);
	ret[0].should.not.have.keys('err');
	ret[0].ret.should.equal(true);
        done();
	});
    });
});
//
describe('auth.isLogged', function(){
    it('should get null error', function(done){
	ss.rpc('auth.isLogged', function(ret){
	console.log("isLOgged.ret="+util.inspect(ret),ret[0]);
	ret[0].should.not.have.keys('err');
        done();
	});
    });
});
//
// EOF
//
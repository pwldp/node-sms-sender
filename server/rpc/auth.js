//
// Authorization code
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
// 2013.07.01
//
var conf = require("../../conf");
//
exports.actions = function(req, res, ss) {
req.use('session');

return {
   
    checkUserPswd: function(inputUser, inputePswd){
	console.log(inputUser,":",inputePswd)
	var userExists = false;
	conf.users.forEach(function(user){
	    console.log(user[0], user[1]);
	    if (inputUser==user[0] && inputePswd==user[1]) {
		userExists=true;
		req.session.setUserId( user[0] );
	    } else {
		req.session.setUserId( null );
	    };
	});
	req.session.save();
	console.log("userExists="+userExists);
	return res({"err":null, "ret":userExists});
    },
    
    isLogged: function(){
	console.log("isLogged:: session.userId="+req.session.userId)
	if (req.session.userId!=null){
	    return res({"err":null, "ret":true})
	} else {
	    return res({"err":null, "ret":false});
	};
    },
    
};
};
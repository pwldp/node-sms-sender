$(document).ready(function() {
console.log("Loaded: login.js");
//
// submit login form
$('#submit').click(function(e) {
    //alert('Handler for .submit() called.');
    e.preventDefault();
    ss.rpc('auth.checkUserPswd', $("#inputUser").val(), $("#inputPswd").val(), function(data){
	console.log("checkUserPswd: "+JSON.stringify(data));
	if (data.ret===true){
	    self.location="/app";
	} else {
	};
	return false;
    });
});
//
});
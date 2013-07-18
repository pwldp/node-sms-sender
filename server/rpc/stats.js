// Server-side Code
exports.actions = function(req, res, ss) {

  // Example of pre-loading sessions into req.session using internal middleware
  req.use('session');

  // Uncomment line below to use the middleware defined in server/middleware/example
  //req.use('example.authenticated')

return {
/*
    sendMessage: function(message) {
      if (message && message.length > 0) {         // Check for blank messages
        ss.publish.all('newMessage', message);     // Broadcast the message to everyone
        return res(true);                          // Confirm it was sent to the originating client
      } else {
        return res(false);
      }
    };
*/    
    getSendingStats: function(){
	var ret = {
	    "l24h": "123",
	    "l7days": "1 234",
	    "l30days": "12 345",
	    "l365days": "123 456"
	};
	return res({"err":null, "ret":ret});
    }

};
};
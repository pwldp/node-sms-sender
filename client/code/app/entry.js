// This file automatically gets called first by SocketStream and must always exist

//
// sms's queue
var smsQueue = [];

// Make 'ss' available to all modules and the browser console
window.ss = require('socketstream');

ss.server.on('disconnect', function(){
    console.log('Connection down :-(');
    var n = noty({text: 'Server connection is down.', layout: 'topRight', type:'error', timeout:4098, closeWith: ['button'],force:true});
    ss.server.emit('logEvent', {'t':'error','msg':'Disconnected from app server.','from':'appconn'});
});

ss.server.on('reconnect', function(){
    console.log('Connection back up :-)');
    var n = noty({text: 'Server connection back up.', layout: 'topRight', type:'success', timeout:10000, closeWith: ['button'],force: true});
    ss.server.emit('logEvent', {'t':'info','msg':'Reconnected to app server.','from':'appconn'});
});
//
//
ss.server.on('ready', function(){

  // Wait for the DOM to finish loading
  jQuery(function(){
    
    // Load app
    require('/app');

  });

});

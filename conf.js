//
// Configuration file for node-kannel-sender
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
// 2013.06.26
//
var conf = {
    "mode": "demo",	// ["demo", "prod"]
    "users" : [	// pairs list: username, password
	['demo', 'demo'],
	['user', 'password']
    ],
    "kannel": {
	"host": "10.89.1.80",
	"port": 13013,
	"user": "smssend",
	"password": "qwe123"
    },
    pgURI: "tcp://smssender:ha5elk0@10.89.1.154/smsy",
    sendDtToClient: false,
};
//
if (conf.mode==="demo"){
    conf.sendDtToClient = true;
};
//
module.exports = conf;
//
// EOF
//
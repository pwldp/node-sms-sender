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
	"host": "10.10.10.10",
	"port": 13013,
	"user": "smsuser",
	"password": "P@ssw0rd"
    },
    pgURI: "tcp://pguser:P@ssw0rd0@10.10.10.10/smsy",
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

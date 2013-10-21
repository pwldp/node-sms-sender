//
// Configuration file for node-kannel-sender
//
// Dariusz PAWLAK <pawlakdp@gmail.com>
// 2013.06.26
//
var conf = {
    "mode": "prod",	// ["demo", "prod"]
    "enable_send_sms": false,
    "users" : [	// pairs list: username, password
	['demo', 'demo'],
	['user', 'password']
    ],
    "kannel": {
	"host": "10.10..10.10",
	"port": 13013,
	"user": "sender",
	"password": "P@ssw0rd"
    },
    pgURI: "tcp://sender:P@ssw0rd@10.10.10.10/sms",
    sendDtToClient: true,
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

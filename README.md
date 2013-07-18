node-sms-sender
===============

SMS sender running on NodeJS and Socketstream with PostgreSQL and Kannel backend.


[Dasboard demo](http://nkd.neatsky.net/)



## Features

* working with [kannel](http://www.kannel.org);
* [PostgeSQL](http://www.postgresql.org) database backend, application listens to notification from DB;
* fast aplication running on [Nodejs](http://www.nodejs.org) and [Socketstream](http://www.socketstream.org) framework
* dashboard with sms queue view;


## Installation


### Install and configure kannel.


### Prepare PostgreSQL database


### Download, configure  and run node-kannel-sender

    git clone git://github.com/pwldp/node-sms-sender.git
    cd node-sms-sender
    npm install


Run with:

    nodejs app.js
    
    
    or 
    
    
    ./run_dev.sh






## License

(The MIT License)

Copyright (c) 2013 Dariusz Pawlak &lt;pawlakdp@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

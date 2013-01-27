/** target payload
string name1; 	# Name (or endpoint) of called subsystem 1
string url1; 	# Url called for subsystem 1
int64 rt1;		# Response time in milliseconds for subsystem 1 call
string resp1; 	# Description of the response from subsystem 1 call
int32 code1; 	# HTTP response code from the subsystem 1 call
**/

function bufferPlay()
{
	var buf = new Buffer(100);

	//
	// buffer composition demo.
	// fills a buffer with numerical values of various sizes,
	// and a string, plus a c-style termination null value for the string.
	//
	
	buf.writeUInt8(255,0);
	buf.writeUInt32BE(0xfeedface, 1);
	buf.writeUInt16BE(0xbeef, 5);
	buf.write('hello',7);
	buf.writeUInt8(0,12); 	// c-style string termination null byte
	buf.fill(0xff, 13); 	// fill the rest of the buffer with the byte 'ff'

	console.log(buf);
	return buf;
}

var message = bufferPlay();

var dgram = require('dgram');
var client = dgram.createSocket("udp4");
client.send(message, 0, 100, 41234, "localhost", function(err, bytes) {
	console.log('an error occured in sending a UDP message.');
});
client.close();



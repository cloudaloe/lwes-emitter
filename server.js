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

function sendUDP(message, port, host)
{
	console.log("sending ", message);
	var dgram = require('dgram');
	var client = dgram.createSocket("udp4");
	client.send(message, 0, 100, port, host, function(err, bytes) {
		console.log('an error occured in sending a UDP message.');
	});
	client.close();
}

//sendUDP(bufferPlay());

function marshal_LWES_ShortString()
{
	//this function TBD to make code nicer wherever it writes an LWES string to buffer
}

function buildEvent(type, numOfAttibutes)
{
	//
	// Serializes the event into a buffer for transmission
	// Gory details: 	assumes the receiving side will handle integers as little endian.
	//					The C implementation acts differently, it maintains the OS endian,
	//					but node.js doesn't know the OS endian and only exposes an API
	//					that requires the code to pick between the two endian types.
	//
	// TODO: avoid pushing empty values, and values that exceed their alloted size
	//		 add endian type selection as configuration
	//
	
	console.log("event type: ", type);
	console.log("event number of attributes: ", numOfAttibutes);	

	var offset = 0; // tracks the next position in the buffer to write to
	var buf = new Buffer(100); // for now
	
	// push the event type | corresponds to line 335 in lwes_event.c
	buf.writeUInt8(type.length, offset);
	offset++;
	offset += buf.write(type, offset);

	// push the number of attributes | corresponds to line 341 in lwes_event.c
	buf.writeUInt16LE(numOfAttibutes, offset); 		// push as little endian
	offset += 2; 									// cause UInt16 is two bytes

	//
	// Push string encoding for the entire event.
	// It was implied this is not mandatory for the receiving party to rely on this value.
	// The encoding value should be a constant occupying two bytes. 
	// It's values are not documented, but all examples seem to use the number value 1.
	//
	var ENC = "enc";
	var LWES_INT_16_TOKEN   = 0x02; // from lwes_types.c
	var encoding = 1; // from lwes_types.c
	
	buf.writeUInt8(ENC.length, offset);
	offset++;
	offset += buf.write(ENC, offset);
	
	buf.writeUInt8(LWES_INT_16_TOKEN, offset);
	offset++;
	
	buf.writeUInt16LE(1, offset);
	offset += 2; 									// cause UInt16 is two bytes
	
	console.log(buf);
	
	return buf;
}

sendUDP(buildEvent("EventTypeA", 1), 1111, "v-cloudaloe-dev-01.local");
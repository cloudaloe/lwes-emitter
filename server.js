var buf = new Buffer(100);

//
// buffer composition demo.
// push numerical values of various sizes, starting at various offsets, 
// and a string, plus a c-style termination null value.
//
buf.writeUInt8(255,0);
buf.writeUInt32BE(0xfeedface, 1);
buf.writeUInt16BE(0xbeef, 5);
buf.write('hello',7);
buf.writeUInt8(0,12); 	// c-style string termination null byte
buf.fill(0xff, 13); 	// fill the rest of the buffer with the byte 'ff'

console.log(buf);
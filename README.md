# beatnik_encryption

The goal of this project is to write a JavaScript function that takes
a string and outputs a [Beatnik](http://cliffle.com/esoterica/beatnik.html)
program that prints that string.

To encrypt a file/message/etc for transmission, you could base64 encode
it, pass it through beatnik_encryption, and send an avante-garde poem
over the wire! The receiver would then run it through the [Beatnik
interpretter](http://www.club.cc.cmu.edu/~rjmccall/beatnik.js), base64
decode the resulting string, and *presto!* -- you're back to the original
message!

**NOTE:** There are several interpretters out there. The JavaScript
interpretter given in the link above seems to have been created by the
Carnegie Mellon Computer Club. Depending on how far we want to take this
project, we may have to test against other interpretters to ensure the
correctness of the program.


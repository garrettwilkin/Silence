var Silencer = require('../silencer.js').Silencer;
var Waiter = require('../waiter.js').Waiter;
var util  = require('util'),
    spawn = require('child_process').spawn;

var walt = new Waiter('choppedFolk','test.wav');

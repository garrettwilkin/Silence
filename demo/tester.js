var silencer = require('../silencer.js').silencer;
var util  = require('util'),
    spawn = require('child_process').spawn,

silo = new silencer('demo','randommoog.wav');
silo.startStream();

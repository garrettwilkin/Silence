var util = require('util');
var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;

function silencer(label,file) {
    this.label = label;
    this.file= file;
    EventEmitter.call(this);
};
util.inherits(silencer,EventEmitter);
exports.silencer = silencer;

silencer.prototype.startStream = function() {
    var self = this;
    var process = spawn('sox', [self.file, ['-t', 'dat', '-c', '1']]);
    process.stdout.on('data',function(data) {
        console.log(data);
        console.log('===');
        //parse data for lines here
        for (var line in parsedLines) {
            self.emit('amplitude',timestamp,value);
        }
    });
};

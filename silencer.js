var util = require('util');
var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');

function silencer(label,file) {
    this.label = label;
    this.file= file;
    this.trailingLine = '';
    EventEmitter.call(this);
};
util.inherits(silencer,EventEmitter);
exports.silencer = silencer;

silencer.prototype.onLine = function(line) {
    line = line.replace(/[\r\n]/gmi, '');
    console.log(line);
};

silencer.prototype.onData = function(data) {
  var self = this;

  // Split input into lines
  var lines = data.toString().split(/(\r\n|\n|\r)/gmi);

  // If there was a previously incomplete last line, add it back here.
  if (this.trailingLine.length) {
    lines[0] = this.trailingLine + lines[0];
  }

  // Look for incomplete last line.
  if (lines[lines.length - 1].length) {
    this.trailingLine = lines.pop();
  } else {
    this.trailingLine = '';
  }

  lines.forEach(function(line) {
    self.onLine(line);
  });

};

silencer.prototype.startStream = function() {
    var self = this;
    console.log(self.file);
    fs.stat(self.file,function(err, stats) {
            console.log(err);
            if ( stats.isFile() ) { console.log ('file')};
        });
    var sox = spawn('sox', [self.file, '-c', '1', '-t', 'dat', '-']);
    var glob = '';
    var i = 0;
    sox.stdout.on('data', function(data) {
        self.onData(data);
    });

    sox.stdout.on('error',function() {
        console.log('Error!');
    });

    sox.stdout.on('exit',function() {
        console.log('Exit!');
    });
};

var util = require('util');
var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');

function Silencer(label,file) {
    this.label = label;
    this.file= file;
    this.trailingLine = '';
    this.rate = '1000';
    this.threshold = 0.007;
    this.size = 20;
    this.silent = 1;
    this.collected = 0;
    this.total = 0;
    this.avgTime = null;
    EventEmitter.call(this);
};
util.inherits(Silencer,EventEmitter);
exports.Silencer = Silencer;

eliminate = function (results) {
    var len = results.length;
    var copy = results;
    var origLen = results.length;
    var time = null;
    var amp = null;
    
    while (time == null & len > 0) {
        el = results.shift();
        if (el != '') {
            time = el;
        };
        len = results.length;
    };
    while (amp == null & len > 0) {
        el = results.shift();
        if (el != '') {
            amp = el;
        };
        len = results.length;
    };
    
    if (time == null || amp == null) {
        console.log('NULL ' + copy + ' origLen ' + origLen);
    };
    return {time:time, amp:amp};
};

Silencer.prototype.onAverage = function(average, time) {
    var self = this;

    //if amplitude is less than threshold, this is silence
    if (average < self.threshold && !self.silent) {
        self.emit('begin',self.label,time,average);
        self.silent = 1;
    } else if (average > self.threshold && self.silent) {
        self.emit('end',self.label,time,average);
        self.silent = 0;
    }
    
};

Silencer.prototype.onLine = function(line) {
    var self = this;
    line = line.replace(/[\r\n]/gmi, '');
    if (line == null) {console.log('UNBELIEVEABLE');};
    var result = line.split(' ');
    //skip comments
    if (result[0] != ';' && result.length != 1) {
        var extract = eliminate(result);
        var time = extract.time;
        var amp = extract.amp;
        if (self.collected < self.size) {
            self.total += Math.abs(amp);
            if (self.collected == 0) {
                self.avgTime = time;
            }
            self.collected++;
        } else {
            var average = self.total / self.collected;
            var time = self.avgTime;
            self.onAverage(average, time);
            self.avgTime = null;
            self.collected = 0;
            self.total = 0;
        }

/*
*/
    };
};

Silencer.prototype.onData = function(data) {
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

Silencer.prototype.start = function() {
    var self = this;
    console.log(self.file);
    fs.stat(self.file,function(err, stats) {
            console.log(err);
            if ( stats.isFile() ) { console.log ('file')};
        });
    //sox randommoog.wav -c 1 -r 8 -t dat -
    //-r rate 12khz
    //-c channel 1 (mono)
    //-t type - date ???
    //- special filename placeholder signifying stdout
    var sox = spawn('sox', [self.file, '-c', '1', '-r', self.rate, '-t', 'dat', '-']);
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

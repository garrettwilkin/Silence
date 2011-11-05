var Silencer = require('./silencer.js').Silencer;
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Waiter(label, file,duration) {
    this.silo = new Silencer(label, file);
    this.silo.start();
    this.silo.on('begin',this.onBegin)
    this.silo.on('end',this.onEnd)
    EventEmitter.call(this);
}
util.inherits(Waiter,EventEmitter);
exports.Waiter = Waiter;

Waiter.prototype.onBegin = function(label,time,amp) {
    console.log(label + ' SILENCE BEGIN:\ttime ' + time + '\tamp ' + amp);
};

Waiter.prototype.onEnd = function(label,time,amp) {
    console.log(label + ' SILENCE END:\ttime ' + time + '\tamp ' + amp);
}

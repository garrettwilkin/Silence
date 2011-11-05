var vows = require('vows');
    assert = require('assert');
    Silencer = require('../silencer.js').Silencer;
    fs = require ('fs');

var silo = {
    scan: function (file,ev) {
        return function () {
            var silence = new Silencer(file,file);
            silence.start();
            silence.once(ev, this.callback);
        }
    }
}

function eventifier(ev) {
    return function (label, time, amp) {
        assert.isNotNull(label);
        assert.isNotNull(time);
        assert.isNotNull(amp);
        console.log(ev + ' label ' + label + ' time ' + time + ' amp ' + amp);
    }
}

var suite = vows.describe('silencer')
.addBatch({                                        //Batch
    'Silencer': {                                  //Context
        'macro': {
            topic: silo.scan('randommoog.wav','begin'),
            'begin': eventifier('begin')
        }
    }
})
.export(module);

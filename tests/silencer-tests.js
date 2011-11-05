var vows = require('vows');
    assert = require('assert');
    silencer = require('../silencer.js').silencer;
    fs = require ('fs');

var silo = {
    scan: function (file,ev) {
        return function () {
            var silence = new silencer(file,file);
            silence.startStream();
            silence.once(ev, this.callback);
        }
    }
}

var suite = vows.describe('silencer')
.addBatch({                                        //Batch
    'Silencer': {                                  //Context
        'macro': {
            topic: silo.scan('randommoog.wav','amplitude'),
            'amplitude': function (timestamp, value) {
                console.log(timestamp);
                console.log(value);
            }
        }
    }
})
.export(module);

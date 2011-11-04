var vows = require('vows');
    assert = require('assert');
    silencer = require('../silencer.js').silencer;

var suite = vows.describe('silencer')
.addBatch({                                        //Batch
    'Silencer': {                                  //Context
        'open file':{                              //SubContext
            topic: function () {                   //Topic
                var silo = new silencer('test1','../randommoog.wav');
                silo.startStream();
                return silo;
            },
            'Returns stream object': function(error,stream) { //Vow
                assert.isNull(error);
                assert.isNotNull(stream);
                assert.isObject(stream);
                assert.instanceOf(stream,silencer);
            }
        }
    }
})
.export(module);

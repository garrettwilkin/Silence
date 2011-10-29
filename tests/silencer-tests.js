var vows = require('vows');
    assert = require('assert');
    silencer = require('../silencer.js');

var suite = vows.describe('silencer')
.addBatch({                                        //Batch
    'Silencer': {                                  //Context
        'open file':{                              //SubContext
            topic: function () {                   //Topic
                new silencer();
            },
            'Returns stream object': function(error,stream) { //Vow
            }
        }
    }
});

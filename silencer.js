var spawn = require('child_process').spawn;

function silencer(label,file) {
    this.label = label;
    this.file= file;
};
exports.silencer = silencer;

silencer.prototype.startStream = function() {
   var self = this;
   var process = spawn('sox', [self.file, ['-t', 'dat', '-c', '1']]);

}

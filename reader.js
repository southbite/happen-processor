var fs = require('fs');

module.exports = {
	instance:function(filename){
		
		var _this = this;
		_this.fd = fs.openSync(filename, 'r');
		_this.bufferSize = 10;
		_this.buffer = new Buffer(_this.bufferSize);
		_this.complete = false;
		_this.data = '';
		
		_this.readLine = function(){

			var read, line, idxStart, idx;
			
			while (_this.data.indexOf("\n") == -1){
				read = fs.readSync(_this.fd, _this.buffer, 0, _this.bufferSize, null);

				if(read > 0){
					_this.data += _this.buffer.toString('utf8', 0, read);
				}
				else{
					_this.complete = true;
					return _this.data;
				}
			}

			var line = _this.data.substring(0, _this.data.indexOf("\n"));
			_this.data = _this.data.substring(line.length + 1, _this.data.length);

			return line.replace(/(\r\n|\n|\r)/gm,"");

		}

		return _this;
	}
}
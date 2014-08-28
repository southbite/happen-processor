module.exports = {
	references:{
		
	},
	columnCount:null,
	delimiter:null,
	init:function(params){
		var _this = this;
		
		if (params.delimiter == null)
			throw "Bad hygiene rule configuration, require the delimiter parameter";
		
		if (params.mappings == null)
			throw "Bad hygiene rule configuration, require the mappings parameter";
		
		_this.stringDelimiter = params.stringDelimiter?params.stringDelimiter:'';
		_this.delimiter = _this.stringDelimiter + params.delimiter + _this.stringDelimiter;
		_this.mappings = params.mappings;

		
	},
	process:function(line, done){
		var _this = this;
		try
		{
			var newline = [_this.mappings.length];
			var columns = line.split(_this.delimiter);
			
			_this.mappings.map(function(currentValue, index, array){
				
				if (currentValue.fromIndex != null)
					newline[index] = columns[currentValue.fromIndex];
				else if (currentValue.defaultValue != null)
					newline[index] = currentValue.defaultValue;
				else
					newline[index] = '';
					
				
			});
			
			line = newline.join(_this.delimiter);;
		}
		catch(e)
		{
			return {status:'ERROR', line:line, error:e};
		}
		
		return {status:'OK', line:line};
	}
}
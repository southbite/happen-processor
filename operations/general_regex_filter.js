module.exports = {
	references:{
		
	},
	columnCount:null,
	delimiter:null,
	init:function(params){
		var _this = this;
		
		if (params.delimiter == null)
			throw "Bad hygiene rule configuration, require the delimiter parameter";
		
		if (params.regex == null)
			throw "Bad hygiene rule configuration, require the regex parameter";
		
		if (params.dateFormat == null)
			_this.dateFormat = 'YYYYMMDD';
		else
			_this.dateFormat = params.dateFormat;
		
		_this.regexOptions = params.regexOptions?params.regexOptions:'g';
		_this.stringDelimiter = params.stringDelimiter?params.stringDelimiter:'';
		_this.delimiter = _this.stringDelimiter + params.delimiter + _this.stringDelimiter;
		_this.regex = new RegExp(params.regex,_this.regexOptions);
		
	},
	process:function(line, done){
		var _this = this;
		try
		{
			if (line.match(_this.regex) == null)
				throw 'Item does not match pattern';
		}
		catch(e)
		{
			return {status:'ERROR', line:line, error:e};
		}
		
		return {status:'OK', line:line};
	}
}
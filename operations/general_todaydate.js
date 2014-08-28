module.exports = {
	references:{
		moment:require('moment')
	},
	columnCount:null,
	delimiter:null,
	init:function(params){
		var _this = this;
		
		if (params.delimiter == null)
			throw "Bad hygiene rule configuration, require the delimiter parameter";
		
		if (params.dateColumnIndexes == null)
			throw "Bad hygiene rule configuration, require the dateColumnIndexes parameter";
		
		if (params.dateFormat == null)
			_this.dateFormat = 'YYYYMMDD';
		else
			_this.dateFormat = params.dateFormat;
		
		_this.todaysDate = _this.references.moment(new Date()).format(_this.dateFormat).toString();
		
		console.log(_this.todaysDate);
		
		_this.stringDelimiter = params.stringDelimiter?params.stringDelimiter:'';
		_this.delimiter = _this.stringDelimiter + params.delimiter + _this.stringDelimiter;
		_this.dateColumnIndexes = params.dateColumnIndexes;
		
	},
	process:function(line, done){
		var _this = this;
		try
		{
			var columns = line.split(_this.delimiter);
			
			this.dateColumnIndexes.map(function(currentValue, index, array){
				columns[currentValue] = _this.todaysDate;
			});
			
			line = columns.join(_this.delimiter);
		}
		catch(e)
		{
			return {status:'ERROR', line:line, error:e};
		}
		
		return {status:'OK', line:line};
	}
}
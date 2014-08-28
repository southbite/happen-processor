module.exports = {
	columnCount:null,
	delimiter:null,
	init:function(params){
		if (params.columnCount == null)
			throw "Bad hygiene rule configuration, require the columnCount parameter";
		
		if (params.delimiter == null)
			throw "Bad hygiene rule configuration, require the delimiter parameter";
		
		this.stringDelimiter = params.stringDelimiter?this.context.params.stringDelimiter:'';
		this.columnCount = params.columnCount;
		this.delimiter = this.stringDelimiter + params.delimiter + this.stringDelimiter;
	},
	process:function(line, done){
		try
		{
			var columnCount = line.split(this.delimiter).length;
			if (columnCount != this.columnCount)
				throw "Bad column count, got " + columnCount + ",expected " + this.columnCount;
		}
		catch(e)
		{
			return {status:'ERROR', line:line, error:e};
		}
		
		return {status:'OK', line:line};
	}
}
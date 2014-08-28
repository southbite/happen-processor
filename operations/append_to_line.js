module.exports = {
	references:{
		
	},
	columnCount:null,
	delimiter:null,
	init:function(params){
		var _this = this;
		
		if (params.append_text == null)
			throw "Bad configuration, require the append_text parameter";
		
		_this.append_text = params.append_text;
		
	},
	process:function(line, done){
		var _this = this;
		try
		{
			line = line + _this.append_text;
		}
		catch(e)
		{
			return {status:'ERROR', line:line, error:e};
		}
		
		return {status:'OK', line:line};
	}
}
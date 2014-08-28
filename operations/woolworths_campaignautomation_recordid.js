module.exports = {
	references:{
	},
	lastRecordID:0,
	currRecordID:0,
	columnCount:null,
	delimiter:null,
	init:function(params){
		var _this = this;
		if (params.delimiter == null)
			throw "Bad hygiene rule configuration, require the delimiter parameter";
		
		if (params.recordIDIndex == null)
			throw "Bad hygiene rule configuration, require the recordIDIndex parameter";
		
		this.stringDelimiter = params.stringDelimiter?params.stringDelimiter:'';
		this.delimiter = this.stringDelimiter + params.delimiter + this.stringDelimiter;
		this.recordIDIndex = params.recordIDIndex;
		this.dfieldIndex = params.recordIDIndex + 1;
		this.noDynamic = params.noDynamic?params.noDynamic:false;
		
	},
	process:function(line, done){
		var _this = this;
		try
		{
			var columns = line.split(_this.delimiter);
			var currentRecordId = parseInt(columns[this.recordIDIndex]);

			if (_this.noDynamic)
			{
				columns[this.recordIDIndex] = _this.currRecordID.toString();
				columns[this.dfieldIndex] = (0).toString();
				_this.currRecordID++;
			}
			else
			{
				if (currentRecordId != _this.lastRecordID)
					columns[this.recordIDIndex] = (_this.lastRecordID + 1).toString();

				_this.lastRecordID = columns[this.recordIDIndex];
			}
			
			line = columns.join(_this.delimiter);
		}
		catch(e)
		{
			return {status:'ERROR', line:line, error:e};
		}
		
		return {status:'OK', line:line};
	}
}
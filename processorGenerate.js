var byline = require('byline');
var fs = require('fs');
var uuid = require('node-uuid');
var lineReader = require('./reader');
var transform = require('./transform');

module.exports = {
	lastLineProcessed:null,
	currentLine:null,
	dataLineCount:0,
	errorCount:0,
	rowCount:0,
	init:function(params){
		
	},
	cleanLine:function(line){
		if (line.indexOf('\uFEFF') === 0) 
			 //writeToLog("found byte order mark - removing... ");
		    line = line.substring(1, line.length);

		 
	 	if (line != null && line.replace(' ','').length > 0)//again, since there may have been a BOM
	 		return line;
	 	else
	 		return null;
	},
	process:function(params, done){
		
		var outputFile = null;
		var errorsFile = null;
		var reportFile = null;
		var _this = this;
		
		try
		{
			var outputFile = fs.openSync(params.outputFile, 'w');
			var errorsFile = fs.openSync(params.errorsFile, 'w');
			var reportFile = fs.openSync(params.reportFile, 'w');
			
			var operation = params.fileprocess.operations[0];
			operation.operator.transform = transform.instance();
			
			_this.params = params;

			_this.logger['info']('Initializing operator: ' + operation.name);
			
			operation.operator.process = function(){
				try{
					operation.operator.processInternal();
				}catch(e){
					 var reportBout = new Buffer('error: ' + ' ' + e + "\r\n", params.outputEncoding);
					 fs.writeSync(reportFile, reportBout, 0, reportBout.length);
					 _this.errorCount++;
				}				
			};

			operation.operator.emit = function(data){
				var bout = new Buffer(data, params.outputEncoding);
			 	fs.writeSync(outputFile, bout, 0, bout.length);
			 	_this.dataLineCount++;
			 	_this.rowCount++;
			}

			operation.operator.done = function(){
				fs.closeSync(outputFile);
		    	fs.closeSync(errorsFile);
		    	fs.closeSync(reportFile);
		    	done(null, {processed:_this.dataLineCount, errors:_this.errorCount, ok:_this.rowCount});
			}

			operation.operator.tempFile = function(){
				var tmpFile = {
					fileName:params.outputFolder + operation.operator.name + '_' + uuid.v4()
				};

				tmpFile.stream = fs.openSync(tmpFile.fileName, 'w');
				tmpFile.reader = new lineReader.instance(tmpFile.fileName);
				
				return tmpFile;
			}

			operation.operator.init(operation.params);//initialize the rule parameters
			operation.operator.processor = _this;
				
			_this.logger['info']('Initialized operator: ' + operation.name);
			
			if (params.hasHeader)
				{
					var headerbout;
					
					if(params.fileprocess.outputHeader != null)
					{
						headerbout = new Buffer(params.fileprocess.outputHeader.replace(/(\r\n|\n|\r)/gm,"") + "\r\n", params.outputEncoding);
					}else{
						headerbout = new Buffer(line.replace(/(\r\n|\n|\r)/gm,"") + "\r\n", params.outputEncoding);
					}
					
					//do nothing for now - this is the header
					
					_this.logger['info']('Writing header...');
					fs.writeSync(outputFile, headerbout, 0, headerbout.length);
					_this.rowCount++;
				}

			operation.operator.process();//will start emitting data
		}
		catch(ex)
		{
			try
			{
				if (outputFile != null)
					fs.closeSync(outputFile);
				if (errorsFile != null)
					fs.closeSync(errorsFile);
				if (reportFile != null)
					fs.closeSync(reportFile);
			}
			catch(exx)
			{
				//well, we tried...
			}
			
			
			done(ex);
		}
	}
}
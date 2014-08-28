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
			var lineStream = byline(fs.createReadStream(params.inputFile, {'encoding': params.inputEncoding}));
			
			var outputFile = fs.openSync(params.outputFile, 'w');
			var errorsFile = fs.openSync(params.errorsFile, 'w');
			var reportFile = fs.openSync(params.reportFile, 'w');
			
			var operation = params.fileprocess.operations[0];
			_this.params = params;

			_this.logger['info']('Initializing operator: ' + operation.name);
			
			operation.operator.fileSize = fs.statSync(params.inputFile).size;
			operation.operator.transform = transform.instance();

			operation.operator.process = function(line){
				try{
					operation.operator.processInternal(line);
				}catch(e){
					 var reportBout = new Buffer('line: ' + _this.dataLineCount + ' ' + e + "\r\n", params.outputEncoding);
					 fs.writeSync(reportFile, reportBout, 0, reportBout.length);
					 _this.errorCount++;
				}				
			};

			operation.operator.emit = function(data){
				var bout = new Buffer(data, params.outputEncoding);
			 	fs.writeSync(outputFile, bout, 0, bout.length);
			}

			operation.operator.done = function(){
				_this.logger['info']('Completed process: ' + operation.name);
				fs.closeSync(outputFile);
		    	fs.closeSync(errorsFile);
		    	fs.closeSync(reportFile);
		    	done(null, {processed:_this.dataLineCount, errors:_this.errorCount, ok:_this.rowCount});
			}

			operation.operator.inputDone = function(){
				operation.operator.inputDoneInternal();
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
			_this.logger['info']('Starting process: ' + operation.name);
			lineStream.on('data', function(line) {
				
				_this.dataLineCount++;
				_this.currentLine = line.toString(); //clone the current line, as the processors are going to make changes
				
				if (params.removeHeader && _this.dataLineCount == 1){
					//do nothing
				}else if (params.hasHeader && _this.dataLineCount == 1)
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
				else
				{
					 line = _this.cleanLine(line);

					 if (line)
					 	operation.operator.process(line);//we store the line, the operator pushes the line to a tmp file
 
					 _this.lastLineProcessed = _this.currentLine;
				}
				
			});
			
			lineStream.on('end', function() {
			 	operation.operator.inputDone();
			});
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
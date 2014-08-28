var byline = require('byline');
var fs = require('fs');
var transform = require('./transform');

module.exports = {
	lastLineProcessed:null,
	currentLine:null,
	dataLineCount:0,
	errorCount:0,
	rowCount:0,
	init:function(params){
		
	},
	process:function(params, done){
		
		var outputFile = null;
		var errorsFile = null;
		var reportFile = null;
		var _this = this;
		
		try
		{
			console.log(params);
			
			var lineStream = byline(fs.createReadStream(params.inputFile, {'encoding': params.inputEncoding}));
			
			var outputFile = fs.openSync(params.outputFile, 'w');
			var errorsFile = fs.openSync(params.errorsFile, 'w');
			var reportFile = fs.openSync(params.reportFile, 'w');
			
			var initializedOperations = [];
			
			for (var operationIndex in params.fileprocess.operations)
			{
				var operation = params.fileprocess.operations[operationIndex];
				_this.logger['info']('Initializing operator: ' + operation.name);
				
				operation.operator.init(operation.params);//initialize the rule parameters
				operation.operator.processor = _this;
				operation.operator.transform = transform.instance();

				_this.logger['info']('Initialized operation: ' + operation.name);
				initializedOperations.push(operation);
			 }
			
			lineStream.on('data', function(line) {
				
				_this.dataLineCount++;
				_this.currentLine = line.toString(); //clone the current line, as the processors are going to make changes
				
				if (params.hasHeader && _this.dataLineCount == 1)
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
				if (line != null && line.replace(' ','').length > 0)
				{
					 if (line.indexOf('\uFEFF') === 0) 
					 {
						 //writeToLog("found byte order mark - removing... ");
						 line = line.substring(1, line.length);
					 }
					 
					 if (line != null && line.replace(' ','').length > 0)//again, since there may have been a BOM
					 {
						 var ruleResult = {status:'OK'};
						 
						 for (var operationIndex in initializedOperations)
						 {
							var operation = initializedOperations[operationIndex];
							
							 ruleResult = operation.operator.process(line);//process 
							 
							 if (ruleResult.status == 'ERROR')//failed hygiene
								 break;
							 else
								 line = ruleResult.line;//hygiene may have cleaned the line somehow

						 }
						 
						 var bout = new Buffer(line.replace(/(\r\n|\n|\r)/gm,"") + "\r\n", params.outputEncoding);
						
						 if (ruleResult.status == "OK")
						 {
							 fs.writeSync(outputFile, bout, 0, bout.length);
							 _this.rowCount++;
						 }
						 else
						 {
							 var reportBout = new Buffer('line: ' + _this.dataLineCount + ' ' + ruleResult.error + "\r\n", params.outputEncoding);
							 fs.writeSync(errorsFile, bout, 0, bout.length);
							 fs.writeSync(reportFile, reportBout, 0, reportBout.length);
							 _this.errorCount++;
						 }
					 }
					 
					 _this.lastLineProcessed = _this.currentLine;
				}
				
			});
			
			lineStream.on('end', function() {
				fs.closeSync(outputFile);
		    	fs.closeSync(errorsFile);
		    	fs.closeSync(reportFile);
		    	done(null, {processed:_this.dataLineCount, errors:_this.errorCount, ok:_this.rowCount});
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
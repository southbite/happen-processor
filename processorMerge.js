var lineReader = require('./reader');
var fs = require('fs');
var transform = require('./transform');

module.exports = {
	lastLineProcessed:null,
	currentLines:[],
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
		var readers = [];

		//try
		//{
			params.inputFiles.map(function(inputFile){
				readers.push(new lineReader.instance(inputFile));
			});

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
			
			if(params.fileprocess.outputHeader != null){
				headerbout = new Buffer(params.fileprocess.outputHeader.replace(/(\r\n|\n|\r)/gm,"") + "\r\n", params.outputEncoding);
				fs.writeSync(outputFile, headerbout, 0, headerbout.length);
			}
				
		 	var eof = false;
			while (!eof){

				this.currentLines = [];
				readers.map(function(reader){

					if (reader.complete)
						eof = true;
					else{

						 var line = reader.readLine();

						 if (line.indexOf('\uFEFF') === 0) {
							 //writeToLog("found byte order mark - removing... ");
							 line = line.substring(1, line.length);
						 }
						 console.log(line);
						 _this.currentLines.push(line);
					}
						
				});

				if (eof)
					continue;//we stop as soon as one of the files is finished

				var ruleResult = {status:'OK'};
				var lines = null;

				 for (var operationIndex in initializedOperations)
				 {
					var operation = initializedOperations[operationIndex];
					
					 ruleResult = operation.operator.process(this.currentLines);//process 
					 
					 if (ruleResult.status == 'ERROR')//failed hygiene
						 break;
					 else
						 lines = ruleResult.lines;//hygiene may have cleaned the line somehow

				 }
				 
				 console.log(lines);

				 var output = '';

				 lines.map(function(line){

				 	output += line.replace(/(\r\n|\n|\r)/gm,"") + "\r\n"

				 });

				 var bout = new Buffer(output, params.outputEncoding);
				
				 if (ruleResult.status == "OK"){
					 fs.writeSync(outputFile, bout, 0, bout.length);
					 _this.rowCount++;
				 }
				 else{
					 var reportBout = new Buffer('line: ' + _this.dataLineCount + ' ' + ruleResult.error + "\r\n", params.outputEncoding);
					 fs.writeSync(errorsFile, bout, 0, bout.length);
					 fs.writeSync(reportFile, reportBout, 0, reportBout.length);
					 _this.errorCount++;
				 }

				_this.dataLineCount++;
			}

			fs.closeSync(outputFile);
		    fs.closeSync(errorsFile);
		    fs.closeSync(reportFile);
		    done(null, {processed:_this.dataLineCount, errors:_this.errorCount, ok:_this.rowCount});
		    /*
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
		*/
	}
}
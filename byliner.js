/*
Example file run

node byliner "inputfolder=/Users/simonbishop/Documents/Client Projects/Acceleration/woolworths_campaignautomation/Data/support/20140313_convertvoucher/" "inputfile=ww_import_20140312_V1.txt" fileprocess=recordid_date_fix

node byliner "inputfile=DIRECTMARKETING_EMAIL_08052014.txt" fileprocess=interim_converter


node byliner "inputfile=VOUCH_EMAIL_20131029_104527.txt" fileprocess=aggregate_oldtonewvouchersort processor_type=aggregate removeHeader=true

VOUCH_EMAIL_20131029_104527.txt

 */


var fs = require('fs');
var utils = require('./utils');

var args = utils.slurpArgs(process.argv, ['fileprocess','processor_type']);

var fileprocess = require('./processes/' + args['fileprocess']);
var inputFile = args['inputfile'];
var outputFolder = args['outputfolder'];
var inputFolder = args['inputfolder'];
var processor;

var config = require('./config');

var inputEncoding = 'utf8';//ucs-2
var outputEncoding = 'utf8';
var hasHeader =  (args['header'] == 'true');
var removeHeader = (args['removeheader'] == 'true');
var moment = require('moment');

var processorType = args['processor_type'];

if (args['inputencoding'])inputEncoding=args['inputencoding'];
if (args['outputencoding'])inputEncoding=args['outputencoding'];

var log4js = require('log4js');
log4js.configure(config['log4jsConfig']);

var logger = log4js.getLogger();

if (outputFolder == null)
	outputFolder = __dirname + '/output/';

if (inputFolder == null)
	inputFolder = __dirname + '/input/';

outputFolder = utils.appendIfNotAtEnd(outputFolder, '/');
inputFolder = utils.appendIfNotAtEnd(inputFolder, '/');

/*
var dt = new Date();
outputFolder = outputFolder + dt.getFullYear() + "/" + (parseInt(dt.getMonth()) + 1) + "/" + dt.getDate() + "/";
*/

if (!fs.existsSync(outputFolder))
	fs.mkdirSync(outputFolder, 0777);

var outputFile = outputFolder + fileprocess.name + moment.utc().valueOf() + '-processed.txt';
var errorsFile = outputFolder + fileprocess.name + moment.utc().valueOf() +  '-errors.txt';
var reportFile = outputFolder + fileprocess.name + moment.utc().valueOf() +  '-report.txt';

var inputFiles = inputFile?inputFile.split(';'):null;


if (processorType == 'merge'){

	processor = require('./processorMerge');

	logger['info']('Process starting for files ' + inputFile);

	processor.utils = utils;
	processor.logger = logger;

	inputFiles.map(function(path, ind, arr){
		arr[ind] = inputFolder + path;
	});

	console.log(inputFiles);

	processor.process({fileprocess:fileprocess,
		inputFiles:inputFiles,
		outputFile:outputFile,
		errorsFile:errorsFile,
		reportFile:reportFile,
		inputEncoding:inputEncoding,
		outputEncoding:outputEncoding,
		hasHeader:hasHeader,
		removeHeader:removeHeader,
		outputFolder:outputFolder
		}, function(e, results){
		
			if (!e)
				logger['info']('Process completed, ' + results.processed + ' lines processed, ' + results.errors + ' errors, ' + results.ok + ' processed ok');
			else
				logger['error']('Process failed: ' + e);
		
	});

}
else if (processorType == 'series')
{
	processor = require('./processorSeries');

	inputFile = inputFolder + inputFile;
	logger['info']('Process starting for file ' + inputFile);


	processor.utils = utils;
	processor.logger = logger;

	processor.process({fileprocess:fileprocess,
		inputFile:inputFile,
		outputFile:outputFile,
		errorsFile:errorsFile,
		reportFile:reportFile,
		inputEncoding:inputEncoding,
		outputEncoding:outputEncoding,
		hasHeader:hasHeader,
		removeHeader:removeHeader,
		outputFolder:outputFolder
		}, function(e, results){
		
			if (!e)
				logger['info']('Process completed, ' + results.processed + ' lines processed, ' + results.errors + ' errors, ' + results.ok + ' processed ok');
			else
				logger['error']('Process failed: ' + e);
		
	});
}else if (processorType == 'aggregate'){

	processor = require('./processorAggregate');

	inputFile = inputFolder + inputFile;
	logger['info']('Aggregation process starting for file ' + inputFile);

	processor.utils = utils;
	processor.logger = logger;

	processor.process({fileprocess:fileprocess,
		inputFile:inputFile,
		outputFile:outputFile,
		errorsFile:errorsFile,
		reportFile:reportFile,
		inputEncoding:inputEncoding,
		outputEncoding:outputEncoding,
		hasHeader:hasHeader,
		removeHeader:removeHeader,
		outputFolder:outputFolder
		}, function(e, results){
		
			if (!e)
				logger['info']('Process completed, ' + results.processed + ' lines processed, ' + results.errors + ' errors, ' + results.ok + ' processed ok');
			else
				logger['error']('Process failed: ' + e);
		
	});
}else if (processorType == 'generator'){

	logger['info']('Generator process starting for ' + fileprocess.name);

	processor = require('./processorGenerate');

	processor.utils = utils;
	processor.logger = logger;

	processor.process({fileprocess:fileprocess,
		outputFile:outputFile,
		errorsFile:errorsFile,
		reportFile:reportFile,
		inputEncoding:inputEncoding,
		outputEncoding:outputEncoding,
		hasHeader:hasHeader,
		outputFolder:outputFolder
		}, function(e, results){
		
			if (!e)
				logger['info']('Process completed, ' + results.processed + ' lines processed, ' + results.errors + ' errors, ' + results.ok + ' processed ok');
			else
				logger['error']('Process failed: ' + e);
		
	});

}






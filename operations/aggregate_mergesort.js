var fs = require('fs');

module.exports = {
	name:'aggregatemergesort',
	references:{
		
	},
	sortColumns:[],
	delimiter:null,
	lineArray:[],
	currentFileSize:0,
	tmpFileArray:[],
	currentTmpFile:null,
	sortFunction:function(a, b){
		var _this = this;


	},
	performSort:function(sortArray, propertyName){
		var _this = this;

		sortArray.sort(function(a, b){
			
			if (propertyName){
				a = a[propertyName];
				b = b[propertyName];
			}

			var aSplit = a.split(_this.delimiter);
			var bSplit = b.split(_this.delimiter);

			function getSortValue(split){
				var value = '';
				_this.sortColumns.map(function(ind){
					value+=split[ind];
				});
				return value.toLowerCase();
			};

			var aSplitValue = getSortValue(aSplit);
			var bSplitValue = getSortValue(bSplit);

			////console.log('comparing');
			////console.log(aSplitValue);
			////console.log(bSplitValue);

			var returnValue = false;

			if (this.sortDirection != 'ASC')
				returnValue = (aSplitValue < bSplitValue) ? -1 : (aSplitValue > bSplitValue) ? 1 : 0;
			else
				returnValue = (aSplitValue > bSplitValue) ? -1 : (aSplitValue < bSplitValue) ? 1 : 0;

			////console.log(returnValue);

			return returnValue;

		});

		return  sortArray;
	},
	flush:function(){
		var _this = this;

		//console.log('flushing');

		////console.log(_this.lineArray);
		////console.log('sort done');

		if (_this.lineArray.length > 0){
			var tmpFile = _this.tempFile();
			_this.performSort(_this.lineArray);

			var sortedData = new Buffer(_this.lineArray.join('\r\n'));

			////console.log('SORTED DATA');
			////console.log(_this.lineArray.join('\r\n'));

			fs.writeSync(tmpFile.stream, sortedData, 0, sortedData.length);
			_this.tmpFileArray.push(tmpFile);
			_this.currentFileSize = 0;
			_this.lineArray = [];
		}
	},
	processInternal:function(line){
		var _this = this;

		_this.lineArray.push(line);
		var tmpOut = new Buffer(line + "\r\n", _this.processor.params.outputEncoding);
		_this.currentFileSize += tmpOut.length;

		////console.log('file size');
		////console.log(_this.currentFileSize);
		////console.log(_this.currentFileSize / 1024000);
		////console.log(_this.memoryUsageMaxMB);

		if (_this.currentFileSize / 1024000 >= _this.memoryUsageMaxMB){
			_this.flush();
		}
	},
	popSortedTop:function(){
		var _this = this;
		var dataToSort = [];

		if (_this.tmpFileArray.length == 1){
			return _this.tmpFileArray[0].reader.readLine();
		}else{
			_this.tmpFileArray.map(function(tmpFile){

				if (!tmpFile.currentLine && !tmpFile.reader.complete)
					tmpFile.currentLine = tmpFile.reader.readLine({removeCRLF:true});

				if (tmpFile.currentLine)
					dataToSort.push(tmpFile);
				
			});

			if (dataToSort.length > 0){
				return _this.performSort(dataToSort, 'currentLine')[0];
			}else 
				return null;
		}
	},
	inputDoneInternal:function(){
		var _this = this;
		_this.flush();
		_this.EOF = false;

		while(!_this.EOF){

			var sortedTop = _this.popSortedTop();
			if (!sortedTop)
				_this.EOF = true;
			else{
				//console.log('emitting sorted ');
				//console.log(sortedTop.currentLine);
				//line.replace(/(\r\n|\n|\r)/gm,"") + "\r\n"
				_this.emit(sortedTop.currentLine + '\r\n');
				sortedTop.currentLine = null;
			}
		}


		_this.done();
	},
	init:function(params){
		var _this = this;
		////console.log(_this.fileSize);
		////console.log(params);

		_this.sortColumns = params.sortColumns;
		_this.sortDirection = params.sortDirection;
		_this.delimiter = params.delimiter;
		_this.memoryUsageMaxMB = params.memoryUsageMaxMB;
		//_this.outputStream =  fs.openSync(params.outputFile, 'w');
	}
}
var fs = require('fs');

module.exports = {
	name:'aggregatetransform',
	references:{
		
	},
	currentGroup:'',
	currentGroupItems:[],
	transformCurrentGroupItems:function(){
		var _this = this;
		var transformed = '';
		var batchSequence = 0;
		_this.currentGroupItems.map(function(lineSplit){
			transformed += _this.transform.replace(_this.template, lineSplit, batchSequence);
			batchSequence++;
		});
		return transformed;
	},
	processInternal:function(line){
		var _this = this;

		var lineSplit = line.split(_this.delimiter);
		var lineSplitGroup = '';

		lineSplit.map(function(value, index){
			if (_this.groupColumns.indexOf(index) > -1)
				lineSplitGroup += lineSplit[index];
		});

		console.log('working with');
		console.log(_this.currentGroup);
		console.log(lineSplitGroup);

		if (_this.currentGroup == '')
			_this.currentGroup = lineSplitGroup;

		if (_this.currentGroup != lineSplitGroup){
			_this.emit(_this.transformCurrentGroupItems());
			_this.currentGroup = lineSplitGroup;
			_this.currentGroupItems = [lineSplit];
		}else
			_this.currentGroupItems.push(lineSplit);
		
	},
	inputDoneInternal:function(){
		var _this = this;
		
		if (_this.currentGroupItems.length > 0)
			_this.emit(_this.transformCurrentGroupItems());

		_this.done();
	},
	init:function(params){
		var _this = this;
		////console.log(_this.fileSize);
		////console.log(params);

		_this.groupColumns = params.groupColumns;
		_this.delimiter = params.delimiter;
		_this.template = params.template;
	}
}
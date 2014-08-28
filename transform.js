var uuid = require('node-uuid');
var moment = require('moment');
module.exports = {
	instance:function(){
		var transformer = function(){
			this.currentSequence = 0;
			this.replace = function(template, values, batchSequence){
				var _this = this;
				var rendered = template;

				if (!values)
					values = [];

				if (!batchSequence)
					batchSequence = 0;

				rendered = rendered.replace(/\{\{guid\}\}/g, uuid.v4());
				rendered = rendered.replace(/\{\{sequence\}\}/g, _this.currentSequence);
				rendered = rendered.replace(/\{\{batchsequence\}\}/g, batchSequence);
				rendered = rendered.replace(/\{\{YYYYMMDD\}\}/g, moment().format('YYYYMMDD'));

				_this.currentSequence++;

				values.map(function(value, ind){
					rendered = rendered.replace(new RegExp('\\{\\{val' + ind.toString() + '\\}\\}','g'), value);
				});
				
				return rendered;
			};
		}

		return new transformer();
	}
}
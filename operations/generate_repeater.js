module.exports = {
	name:'aggregaterepeater',
	references:{
		
	},
	currentSequence:0,
	render:function(){
		var _this = this;
		return _this.transform.replace(_this.template);
	},
	processInternal:function(){
		var _this = this;

		for (var i = 0;i < _this.repeatCount;i++)
			_this.emit(_this.render());

		_this.done();
	},
	init:function(params){
		var _this = this;
		_this.repeatCount = params.repeatCount;
		_this.template = params.template;
	}
}
//node byliner fileprocess=generate_testdata processor_type=generator
module.exports = {
	name:'generatetestdata',
	outputHeader:'GUID|Name|Surname|SEQUENCE',
	operations:[{
			    	name:'Generate TestData',
			    	params:{
			    		repeatCount:1000000,
						template:'{{guid}}|Simon|Bishop|{{sequence}}\r\n'
			    	},
			    	operator:require('../operations/generate_repeater.js')
			    }]
}
//node byliner "inputfile=bigfiletosort.txt" fileprocess=aggregate_stresstest processor_type=aggregate

module.exports = {
	name:'aggregate_stresstest',
	outputHeader:'GUID|Name|Surname|SEQUENCE',
	operations:[
	    {
	    	name:'Aggregate',
	    	params:{
	    		delimiter:'|',
	    		sortColumns:[0, 3],
	    		sortDirection:'ASC',
	    		memoryUsageMaxMB:5
	    	},
	    	operator:require('../operations/aggregate_mergesort.js')
	    }
	]
}
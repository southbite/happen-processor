//node byliner "inputfile=VOUCH_EMAIL_20131029_104527.txt" fileprocess=aggregate_oldtonewvouchersort processor_type=aggregate removeHeader=true

module.exports = {
	name:'oldtonewvouchersort',
	outputHeader:'EmailAddr|Promotion_Id|Campaign_Id|Campaign_Name|C2_number|Promotion_Description|Language|Title|Initial|FirstName|LastName|Subscribe_Context|RecordID|DFieldID|DFieldName|DFieldValue|DFieldDate|Correspondence_Id|Siebel_Row_Id|Send_Batch_Id',
	operations:[
	    {
	    	name:'vouchersort',
	    	params:{
	    		delimiter:'|',
	    		sortColumns:[14, 16, 0],
	    		sortDirection:'ASC',
	    		memoryUsageMaxMB:1
	    	},
	    	operator:require('../operations/aggregate_mergesort.js')
	    }
	]
}
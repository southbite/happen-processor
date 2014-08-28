module.exports = {
	name:"Merge Vouchers",
	outputHeader:'EmailAddr|Promotion_Id|Campaign_Id|Campaign_Name|C2_number|Promotion_Description|Language|Title|Initial|FirstName|LastName|Subscribe_Context|RecordID|DFieldID|DFieldName|DFieldValue|DFieldDate|Correspondence_Id|Siebel_Row_Id|Send_Batch_Id',
	operations:[
		{
	    	name:'Merge Vouchers',
	    	params:{
	    		
	    	},
	    	operator:require('../operations/merge_vouchers.js')
	    }
	]
}
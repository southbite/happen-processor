module.exports = {
	outputHeader:'EmailAddr|Promotion_Id|Campaign_Id|Campaign_Name|C2_number|Promotion_Description|Language|Title|Initial|FirstName|LastName|Subscribe_Context|RecordID|DFieldID|DFieldName|DFieldValue|DFieldDate|Correspondence_Id|Siebel_Row_Id|Send_Batch_Id',
	operations:[
		{
	    	name:'Append static line',
	    	params:{
	    		append_text:'|0|0||||||20140509'
	    	},
	    	operator:require('../operations/append_to_line.js')
	    },
	    {
	    	name:'Set todays date',
	    	params:{
	    		dateColumnIndexes:[19],
	    		delimiter:'|'
	    	},
	    	operator:require('../operations/general_todaydate.js')
	    } 
	]
}
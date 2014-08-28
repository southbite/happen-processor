module.exports = {
	outputHeader:'EmailAddr|Promotion_Id|Campaign_Id|Campaign_Name|C2_number|Promotion_Description|Language|Title|Initial|FirstName|LastName|Subscribe_Context|RecordID|DFieldID|DFieldName|DFieldValue|DFieldDate|Correspondence_Id|Siebel_Row_Id|Send_Batch_Id',
	operations:[
	    {
	    	/*
			Emailaddress|
			Vision_customer_no|
			C2_customer_number|
			Language|
			Title|
			Initial|
			FirstName|
			LastName|
			Cell_phone|
			Voucher_Barcode|
			Voucher_expiry_date|
			Voucher_type_ID|
			Store_Number|
			Mailid|
			Campaign_id|
			Campaign_description|
			Promotion_id|--16
			Promotion_description|due_date|Child_first_name|Child_surname|Child_gender|Child_date_of_birth|child_id|Card_number|Club_subscribe_status|Club_subscribe_date|Club_product_code|Permission_promotion_email|Permission_date|Correspondence_ID
	    	*/

	    	name:'Transform',
	    	params:{
	    		delimiter:'|',
	    		mappings:[
	    		  {fromIndex:0},//EmailADdr
	    		  {fromIndex:16},//Promotion_Id
	    		  {fromIndex:14},
	    		  {},
	    		  {fromIndex:2},
	    		  {},
	    		  {fromIndex:3},//Language
	    		  {fromIndex:4},//Title
	    		  {fromIndex:5},//Initial
	    		  {fromIndex:6},//Firstname
	    		  {fromIndex:7},//Lastname
	    		  {defaultValue:'W'},//Subscribe_Context
	    		  {defaultValue:''},//RecordID
	    		  {defaultValue:'0'},//DFieldID
	    		  {},//DFieldName
	    		  {},//DFieldValue
	    		  {},//DFieldDate
	    		  {},//Correspondence_Id
	    		  {},//Siebel_Row_Id
	    		  {}//Send_Batch_Id
	    		]
	    	},
	    	operator:require('../operations/mappingtransform.js')
	    },
	    {
	    	name:'Set todays date',
	    	params:{
	    		dateColumnIndexes:[19],
	    		delimiter:'|'
	    	},
	    	operator:require('../operations/general_todaydate.js')
	    }, 
	    {
	    	name:'Update RecordID',
	    	params:{
	    		recordIDIndex:12,
	    		delimiter:'|',
	    		noDynamic:true
	    	},
	    	operator:require('../operations/woolworths_campaignautomation_recordid.js')
	    }
	]
}
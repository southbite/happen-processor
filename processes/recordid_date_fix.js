module.exports = {
	outputHeader:'Emailaddress|Vision_customer_no|C2_customer_number|Language|Title|Initial|FirstName|LastName|Cell_phone|Voucher_Barcode|Voucher_expiry_date|Voucher_type_ID|Store_Number|Mailid|Campaign_id|Campaign_description|Promotion_id|Promotion_description|due_date|Child_first_name|Child_surname|Child_gender|Child_date_of_birth|child_id|Card_number|Club_subscribe_status|Club_subscribe_date|Club_product_code|Permission_promotion_email|Permission_date|Correspondence_ID',
	operations:[
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
	    },
	    {
	    	name:'Match regex',
	    	params:{
	    		delimiter:'|',
	    		regex:'voucher_barcode'
	    	},
	    	operator:require('../operations/general_regex_filter.js')
	    },
	    {
	    	name:'Transform',
	    	params:{
	    		delimiter:'|',
	    		mappings:[
	    		  {fromIndex:0},
	    		  {},
	    		  {fromIndex:4},
	    		  {fromIndex:6},
	    		  {fromIndex:7},
	    		  {fromIndex:8},
	    		  {fromIndex:9},
	    		  {fromIndex:10},
	    		  {},
	    		  {fromIndex:15},
	    		  {defaultValue:'2014/03/31'},
	    		  {defaultValue:'1345'},
	    		  {},
	    		  {},
	    		  {fromIndex:2},
	    		  {},
	    		  {fromIndex:1},
	    		  {},
	    		  {},
	    		  {},
	    		  {},
	    		  {},
	    		  {},
	    		  {},
	    		  {},
	    		  {},
	    		  {},
	    		  {},
	    		  {},
	    		  {},
	    		  {}
	    		]
	    	},
	    	operator:require('../operations/woolworths_campaignautomation_new_old_xform.js')
	    }   
	]
}
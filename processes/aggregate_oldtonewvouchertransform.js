//node byliner "inputfile=sortedvouchers.txt" fileprocess=aggregate_oldtonewvouchertransform processor_type=aggregate


module.exports = {
	name:'oldtonewvouchertransform',
	outputHeader:'EmailAddr|Promotion_Id|Campaign_Id|Campaign_Name|C2_number|Promotion_Description|Language|Title|Initial|FirstName|LastName|Subscribe_Context|RecordID|DFieldID|DFieldName|DFieldValue|DFieldDate|Correspondence_Id|Siebel_Row_Id|Send_Batch_Id',
	/*
	Emailaddress|
	Vision_customer_no|
	C2_customer_number|
	Language|3
	Title|
	Initial|
	FirstName|6
	LastName|
	Cell_phone|
	Voucher_Barcode|9
	Voucher_expiry_date|
	Voucher_type_ID|
	Store_Number|
	Mailid|13
	Campaign_id|
	Campaign_description|
	Promotion_id|16
	Promotion_description|
	due_date|
	Child_first_name|19
	Child_surname|
	Child_gender|
	Child_date_of_birth|22
	child_id|
	Card_number|
	Club_subscribe_status|25
	Club_subscribe_date|
	Club_product_code|
	Permission_promotion_email|28
	Permission_date|
	Correspondence_ID 30
	*/
	operations:[
	    {
	    	name:'vouchertransform',
	    	params:{
	    		template:'{{val0}}|{{val16}}|{{val14}}|{{val15}}|{{val2}}|{{val17}}|{{val3}}|{{val4}}|{{val5}}|{{val6}}|{{val7}}|W|{{sequence}}|{{batchsequence}}|voucher_barcode|{{val9}}||||{{YYYYMMDD}}\r\n' +
						 '{{val0}}|{{val16}}|{{val14}}|{{val15}}|{{val2}}|{{val17}}|{{val3}}|{{val4}}|{{val5}}|{{val6}}|{{val7}}|W|{{sequence}}|{{batchsequence}}|voucher_type_id|{{val11}}||||{{YYYYMMDD}}\r\n' +
						 '{{val0}}|{{val16}}|{{val14}}|{{val15}}|{{val2}}|{{val17}}|{{val3}}|{{val4}}|{{val5}}|{{val6}}|{{val7}}|W|{{sequence}}|{{batchsequence}}|voucher_exp_date|{{val10}}||||{{YYYYMMDD}}\r\n' +
						 '{{val0}}|{{val16}}|{{val14}}|{{val15}}|{{val2}}|{{val17}}|{{val3}}|{{val4}}|{{val5}}|{{val6}}|{{val7}}|W|{{sequence}}|{{batchsequence}}|voucher_value|10||||{{YYYYMMDD}}\r\n' +
						 '{{val0}}|{{val16}}|{{val14}}|{{val15}}|{{val2}}|{{val17}}|{{val3}}|{{val4}}|{{val5}}|{{val6}}|{{val7}}|W|{{sequence}}|{{batchsequence}}|threshold|1.0000||||{{YYYYMMDD}}\r\n' +
						 '{{val0}}|{{val16}}|{{val14}}|{{val15}}|{{val2}}|{{val17}}|{{val3}}|{{val4}}|{{val5}}|{{val6}}|{{val7}}|W|{{sequence}}|{{batchsequence}}|store_nbr|{{val12}}||||{{YYYYMMDD}}\r\n',
	    		delimiter:'|',
	    		groupColumns:[0, 14, 16]
	    	},
	    	operator:require('../operations/aggregate_transform.js')
	    }
	]
}
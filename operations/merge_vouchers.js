module.exports = {
	references:{
		
	},
	columnCount:null,
	delimiter:null,
	init:function(params){
		var _this = this;
		
	},
	createVoucherLines:function(voucher_data, recipient_data, field_id, promo_id, campaign_id){
		var moment = require('moment');
		var voucherLines = [];
		voucher_data.map(function(val, ind){

			var append = false;

			

			/*
			feliciteviviers@woolworths.co.za|1|1469|Email: WRewards: VIP Birt|604564|Email: WRewards: VIP Birt|1|MS|F||VIVIERS|W|0|0|voucher_barcode|10000055220298014733||||20140613
feliciteviviers@woolworths.co.za|1|1469|Email: WRewards: VIP Birt|604564|Email: WRewards: VIP Birt|1|MS|F||VIVIERS|W|0|1|voucher_type_id|1473||||20140613
feliciteviviers@woolworths.co.za|1|1469|Email: WRewards: VIP Birt|604564|Email: WRewards: VIP Birt|1|MS|F||VIVIERS|W|0|2|voucher_exp_date|2014/07/30||||20140613
feliciteviviers@woolworths.co.za|1|1469|Email: WRewards: VIP Birt|604564|Email: WRewards: VIP Birt|1|MS|F||VIVIERS|W|0|3|start_dte|2014-06-30 00:00:00.0||||20140613
feliciteviviers@woolworths.co.za|1|1469|Email: WRewards: VIP Birt|604564|Email: WRewards: VIP Birt|1|MS|F||VIVIERS|W|0|4|end_dte|2014-07-30 00:00:00.0||||20140613
feliciteviviers@woolworths.co.za|1|1469|Email: WRewards: VIP Birt|604564|Email: WRewards: VIP Birt|1|MS|F||VIVIERS|W|0|5|voucher_value|10||||20140613
feliciteviviers@woolworths.co.za|1|1469|Email: WRewards: VIP Birt|604564|Email: WRewards: VIP Birt|1|MS|F||VIVIERS|W|0|6|threshold|1.0000||||20140613
feliciteviviers@woolworths.co.za|1|1469|Email: WRewards: VIP Birt|604564|Email: WRewards: VIP Birt|1|MS|F||VIVIERS|W|0|7|store_nbr|0||||20140613
			*/

			if (ind == 0){
			
				recipient_data[14] =  'voucher_barcode';
				recipient_data[15] =  val;

				append = true;
			}

			if (ind == 1){
			
				recipient_data[14] =  'voucher_type_id';
				recipient_data[15] =  val;

				append = true;
			}

			if (ind == 2){
			
				recipient_data[14] =  'start_dte';
				recipient_data[15] =  val;

				append = true;
			}

			if (ind == 4){
			
				recipient_data[14] =  'end_dte';
				recipient_data[15] =  val;

				append = true;
			}

			if (ind == 6){
			
				recipient_data[14] =  'voucher_value';
				recipient_data[15] =  val;

				append = true;
			}

			if (append){
				recipient_data[1] = promo_id;
				recipient_data[2] = campaign_id;
				recipient_data[13] = field_id.toString();
				recipient_data[19] = moment(new Date).format('YYYYMMDD');

				voucherLines.push(recipient_data.join('|'));
			}
				

		});

		return voucherLines;

	},
	process:function(lines){
		var _this = this;
		var newLines = [];
		try
		{
			var voucher_data_0 = lines[0].split(/\s+/);
			var voucher_data_1 = lines[1].split(/\s+/);
			var recipient_data = lines[2].split('|');

			/*

			voucher_barcode|0     
			voucher_type_id|1
			start_dte|2
			start_dte_tm|3                       
			end_dte|4
			end_dte_tm|5                         
			voucher_amount|6        
			campaign_id|7
			promotion_id|8

			10000055220316014769
			1476            
			2014-06-26 
			00:00:00.000 
			2014-08-03 
			00:00:00.000 
			100.00                
			1488        
			2

			EmailAddr|0
			Promotion_Id|1
			Campaign_Id|2
			Campaign_Name|3
			C2_number|4
			Promotion_Description|5
			Language|6
			Title|7
			Initial|8
			FirstName|9
			LastName|10
			Subscribe_Context|11
			RecordID|12
			DFieldID|13
			DFieldName|14
			DFieldValue|15
			DFieldDate|16
			Correspondence_Id|17
			Siebel_Row_Id|18
			Send_Batch_Id|19
			*/

		

			_this.createVoucherLines(voucher_data_0, recipient_data, 0, 1, 1463).map(function(line){
				newLines.push(line);
			});

			_this.createVoucherLines(voucher_data_1, recipient_data, 1, 1, 1463).map(function(line){
				newLines.push(line);
			});


		}
		catch(e)
		{
			return {status:'ERROR', lines:lines, error:e};
		}
		
		return {status:'OK', lines:newLines};
	}
}
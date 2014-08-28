var reader = require('./reader').instance('/Users/simonbishop/Documents/Client Projects/Acceleration/woolworths_campaignautomation/Data/support/20140714_mergevoucherfiles/Camp 1488 promo 2.txt');

var readComplete = false;
var i = 0;
while(!reader.complete){
	var line = reader.readLine();
	console.log('line: ' + line);
}
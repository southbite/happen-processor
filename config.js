module.exports = {
		log4jsConfig:{
			"appenders": [
			      { type: 'console' },
	              {
	                "type": "file",
	                "absolute": true,
	                "filename": __dirname + "/activity.log",
	                "maxLogSize": 20480,
	                "backups": 10       
	              }
	            ]
		}
}
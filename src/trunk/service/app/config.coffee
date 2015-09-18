module.exports = do ->
	debug: true
	server_port: 1081
	monogo: 'mongodb://colee:z1x2c3@127.0.0.1:27017/'
	db_name: 'co_webyi'
	logs: 
		appenders: [
			type: "console"
		# ,
		# 	type: "file"
		# 	filename: "logs/cheese.log"
		# 	category: "cheese"
		]
		# replaceConsole: true
		level: 'all' # level: all | trace | debug | info | warn | error | fatal
	app_base_code: __dirname+'/../app_base_code/'
	app_tpls: __dirname+'/../app_tpls/'
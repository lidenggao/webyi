# 生成单个数据模式
module.exports = (doc, stdout)->
	config = require '../config'
	Q = require 'q'
	# deferred = Q.defer()
	# deferred.reject err
	# deferred.resolve rows
	# deferred.promise
	log4js = require 'log4js'
	Error = require '../utils/Error'
	swig = require('./SwigSetFilter')()
	GenerateCodeFile = require './GenerateCodeFile'
	AppItem = require '../models/AppItem'

	base_code_dir = config.app_base_code
	tpls_dir = config.app_tpls
	generate_to_dir = ''
	file_path = ''

	Q.fcall ->
		AppItem.findByIdQ doc.app_item_id
	.then (app_item_doc)->
		generate_to_dir = app_item_doc.directory
		code_str = swig.compileFile(tpls_dir+'schema.coffee.html')
		code_str = code_str
			doc: doc
		file_path = generate_to_dir+'app/schemas/'+doc.model_name+'.coffee'

		GenerateCodeFile file_path, code_str, stdout
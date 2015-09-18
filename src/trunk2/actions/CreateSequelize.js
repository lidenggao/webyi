// 把数据表生成 Sequelize 的 models/schemas

var _ = require('underscore');
var Sequelize = require('sequelize');
var log4js = require('log4js');
var FS = require("q-io/fs");
var logger = log4js.getLogger('CreateSequelize');
var swig = require('../lib/SwigFilters');

var allSchemasPool = {};
exports.getAllSchemas = function (path) {
	if(allSchemasPool[path]){
		// return allSchemasPool[path];
	}
	var sequelize = new Sequelize('sumaitong', 'developer', 'z1x2c3', {
		logging: console.log,
		define: {
			timestamps: false
		}
	});
	// 查询表结构
	allSchemasPool[path] = sequelize.showAllSchemas().then(function(res){
		var reqs = [];
		_.each(res, function(item){
			var table_name = _.values(item)[0];
			var doc = sequelize.query('show full fields from '+table_name, null, {raw:true})
			.then(function(res){
				var names = table_name.split('_');
				var _names = '';
				_.each(names, function(name){
					_names += name[0].toUpperCase() + name.substring(1)
				});
				return {
					tableName: table_name,
					modelName: _names,
					fields: res[0]
				};
			});
			reqs.push(doc);
		});
		return Q.all(reqs);
	});
	return allSchemasPool[path];
};
/**
 * 生成数据模式
 */
exports.createSchemas = function (io, path) {
	// 当前会话请求加入到项目组
	var socket = function () {
		return io.sockets.in(path);
	};
	var dir = path+'/schemas/';
	var getCode = swig.compileFile(__dirname+'/../project_templates/webapi/schemas.js.html');
	return this.getAllSchemas(path).then(function(docs){
		var run = FS.exists(dir).then(function(res){
			if(!res){
				return FS.makeDirectory(dir);
			}
		});
		_.each(docs, function(doc){
			var code_str = getCode({doc: doc});
			var file_name = dir+doc.modelName+'.js';
			run.then(function(){
				return FS.write(file_name, code_str);
			}).then(function(){
				logger.info(doc.modelName,'成功');
				socket().emit('console', doc.modelName+'成功');
			}).fail(function(err){
				logger.error(err);
				socket().emit('console', err);
			});
		});
	}).then(function(res){
		logger.info('schemas 生成完成');
		socket().emit('console', 'schemas 生成完成');
	}).fail(function(err){
		logger.error(err);
		socket().emit('console', err);
	});
};
/**
 * 生成模型，已存在则不处理
 */
exports.createModels = function (io, path) {
	// 当前会话请求加入到项目组
	var socket = function () {
		return io.sockets.in(path);
	};
	var dir = path+'/models/';
	var getCode = swig.compileFile(__dirname+'/../project_templates/webapi/models.js.html');
	return this.getAllSchemas(path).then(function(docs){
		var run = FS.exists(dir).then(function(res){
			if(!res){
				return FS.makeDirectory(dir);
			}
		});
		_.each(docs, function(doc){
			var code_str = getCode({doc: doc});
			var file_name = dir+doc.modelName+'.js';
			run.then(function(){
				return FS.exists(file_name);
			}).then(function(is_exists){
				if(!is_exists){
					return FS.write(file_name, code_str);
				}
			}).then(function(){
				logger.info(doc.modelName,'成功');
				socket().emit('console', doc.modelName+'成功');
			}).fail(function(err){
				logger.error(err);
				socket().emit('console', err);
			});
		});
	}).then(function(res){
		logger.info('models 生成完成');
		socket().emit('console', 'models 生成完成');
	}).fail(function(err){
		logger.error(err);
		socket().emit('console', err);
	});
};
/**
 * 生成路由，已存在则不处理
 */
exports.createRouters = function (io, path) {
	// 当前会话请求加入到项目组
	var socket = function () {
		return io.sockets.in(path);
	};
	var dir = path+'/routers/';
	var getCode = swig.compileFile(__dirname+'/../project_templates/webapi/routers.js.html');
	return this.getAllSchemas(path).then(function(docs){
		var run = FS.exists(dir).then(function(res){
			if(!res){
				return FS.makeTree(dir);
			}
		});
		_.each(docs, function(doc){
			var code_str = getCode({doc: doc});
			var file_name = dir+doc.modelName+'.js';
			run.then(function(){
				return FS.exists(file_name);
			}).then(function(is_exists){
				// if(!is_exists){
					return FS.write(file_name, code_str);
				// }
			}).then(function(){
				logger.info(doc.modelName,'成功');
				socket().emit('console', doc.modelName+'成功');
			}).fail(function(err){
				logger.error(err);
				socket().emit('console', err);
			});
		});
	}).then(function(res){
		logger.info('models 生成完成');
		socket().emit('console', 'models 生成完成');
	}).fail(function(err){
		logger.error(err);
		socket().emit('console', err);
	});
};
/**
 * 生成models的测试用例，已存在则不处理
 */
exports.createModelTests = function (io, path) {
	// 当前会话请求加入到项目组
	var socket = function () {
		return io.sockets.in(path);
	};
	var dir = path+'/test/models/';
	var getCode = swig.compileFile(__dirname+'/../project_templates/webapi/models.test.js.html');
	return this.getAllSchemas(path).then(function(docs){
		var run = FS.exists(dir).then(function(res){
			if(!res){
				return FS.makeTree(dir);
			}
		});
		_.each(docs, function(doc){
			var code_str = getCode({doc: doc});
			var file_name = dir+doc.modelName+'.test.js';
			run.then(function(){
				return FS.exists(file_name);
			}).then(function(is_exists){
				if(!is_exists){
					return FS.write(file_name, code_str);
				}
			}).then(function(){
				logger.info(doc.modelName,'成功');
				socket().emit('console', doc.modelName+'.test 成功');
			}).fail(function(err){
				logger.error(err);
				socket().emit('console', err);
			});
		});
	}).then(function(){
		logger.info('models test 生成完成');
		socket().emit('console', 'models.test 生成完成');
	}).fail(function(err){
		logger.error(err);
		socket().emit('console', err);
	});
}
module.exports = function(doc, stdout) {
  var AppItem, Error, GenerateCodeFile, Q, base_code_dir, config, file_path, generate_to_dir, log4js, swig, tpls_dir;
  config = require('../config');
  Q = require('q');
  log4js = require('log4js');
  Error = require('../utils/Error');
  swig = require('./SwigSetFilter')();
  AppItem = require('../models/AppItem');
  GenerateCodeFile = require('./GenerateCodeFile');
  base_code_dir = config.app_base_code;
  tpls_dir = config.app_tpls;
  generate_to_dir = '';
  file_path = '';
  return Q.fcall(function() {
    return AppItem.findByIdQ(doc.app_item_id);
  }).then(function(app_item_doc) {
    var code_str;
    generate_to_dir = app_item_doc.directory;
    code_str = swig.compileFile(tpls_dir + 'action.test.coffee.html');
    code_str = code_str({
      doc: doc
    });
    file_path = generate_to_dir + 'app/tests/actions/' + doc.name + '.test.coffee';
    return GenerateCodeFile(file_path, code_str, stdout);
  });
};

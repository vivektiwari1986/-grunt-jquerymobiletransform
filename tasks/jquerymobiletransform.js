var fs = require('fs'),
  path = require('path'),
 jsdom = require('jsdom'),
jquery = fs.readFileSync(path.join(__dirname, '../support/jquery-1.9.1.min.js'), 'utf8'),
jquerymobile = fs.readFileSync(path.join(__dirname, '../support/jquerymobile.js'), 'utf8');

module.exports = function(grunt) {
  var task = grunt.task,
    file = grunt.file,
    log = grunt.log;

  grunt.registerTask('jquerymobiletransform', 'Transform HTML files with jQuery Mobile', function() {
    grunt.config.requires('jquerymobiletransform');

    var conf = grunt.config('jquerymobiletransform'),
      files = file.expand({ filter: fs.isFile }, conf.files),
      transform = conf.transform,
      cb = this.async();

    (function run(files) {
      var f = files.shift();

      if(!f) return cb();

      executeTransform(f, transform, function(err, body) {
        if(err) return grunt.fail.warn(err);

        // Write the new content, and keep the doctype safe (innerHTML returns
        // the whole document without doctype).
        fs.writeFileSync(f, body);

        log.ok(f);

        run(files);
      });
    }(files));
  });

  function processFile(file, cb) {
    fs.readFile(file, 'utf8', function(err, body) {
      if(err) return cb(err);

      jsdom.env({
        html: body,
        src: [jquery, jquerymobile],
        done: cb
      });
    });
  }

  function executeTransform(f, transform, cb) {
    log.subhead('About to transform ' + f);

    processFile(f, function(err, window) {
      if(err) return cb(err);

      var $ = window.$,
        isAsync = false,
        doneProcessing = function() {
          cb(null, window.document.innerHTML, window);
        },
        context = {
          async: function() {
            isAsync = true;

            return doneProcessing;
          }
        };

      transform.call(context, $);

      if(!isAsync) doneProcessing();
    });
  };
};
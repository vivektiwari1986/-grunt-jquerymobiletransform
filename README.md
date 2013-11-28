# jQuery Transform

grunt-jquerymobiletransform is a grunt task for transforming HTML files with jQuerymobile

## Installation

	npm install grunt-jquerymobiletransform


## Use

### Simple Case

```
grunt.initConfig({
  jquerymobiletransform: {
    files: ['**/*.html'], // All HTML files
    transform: function($) {
      // For styling bullet separate from text
      $('.post li').wrapInner('<span />');
    }
  }
});

grunt.loadNpmTasks('grunt-jquerymobiletransform');

```

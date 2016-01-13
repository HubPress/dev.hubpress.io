var dest = './dist';
var src = './src';

module.exports = {
  browserSync: {
    port: 9000,
    server: {
      // We're serving the src folder as well
      // for sass sourcemap linking
      baseDir: [dest, src],
    },
    files: [
      dest + '/**'
    ]
  },
  css: {
    src: src + "/hubpress/styles/**/*.less",
    dest: dest + "/hubpress/styles"
  },
  markup: {
    src: [
      src + "/hubpress/index.html",
      src + "/hubpress/config.json",
      src + "/hubpress/favicon.ico"
    ],
    dest: dest + "/hubpress"
  },
  markupHome: {
    src: [
      src + "/index.html",
      src + "/*.adoc",
      src + "/LICENSE",
      src + "/.nojekyll"
    ],
    dest: dest
  },
  markupImages: {
    src: [
      src + "/images/**/*"
    ],
    dest: dest + "/images"
  },
  markupThemes: {
    src: [
      src + "/themes/**/*"
    ],
    dest: dest + "/themes"
  },
  helpers: {
    src: src + "/hubpress/scripts/helpers/tpl/**",
    dest: dest + '/hubpress/scripts/helpers/tpl'
  },
  vendors: {
    src: [
      src + "/hubpress/bower_components/modernizr/modernizr.js",
      src + "/hubpress/bower_components/lodash/lodash.min.js",
      src + "/hubpress/bower_components/github/lib/base64.min.js",
      src + "/hubpress/bower_components/github/github.js"
    ],
    dest: dest + '/hubpress/scripts/vendors'
  },
  version: {
    src: [
      src + "/hubpress/index.html"
    ],
    dest: dest + "/hubpress"
  },
  fontIcons: {
    src: src + "/css/font-icons/**",
    dest: dest + '/font-icons'
  },
  browserify: {
    // Enable source maps
    debug: true,
    extensions: [ '.jsx' ],
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: src + '/hubpress/scripts/app.jsx',
      dest: dest,
      outputName: 'hubpress/scripts/app.js'
    }]
  }
};

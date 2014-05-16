var nconf = require('nconf');

nconf
  .file({ file: 'config.json' })
  .env();

nconf.defaults({

});

module.exports = nconf;
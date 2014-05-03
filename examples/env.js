/*
  run in your commandline:

    MLOG=envTest node env.js

  you should then the output:

    envTest namespace is enabled

  try with a different namespace enabled:

    MLOG=http node env.js

  and you should see no output!
*/

var Console = require('../public/MagiConsole');

var envLogger = new Console('envTest');

envLogger.log('envTest namespace is enabled');
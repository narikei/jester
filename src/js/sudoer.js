const sudo = require('sudo-prompt');

const options = {
  name: 'Jester',
  icns: __dirname + '/../../jester.icns',
};

module.exports.execute = (command, callback) => {
  sudo.exec(command, options, (error, stdout, stderr) => {
    if (error) {
      callback(error);
      return;
    }

    if (stderr) {
      console.log(stderr);
    }

    callback(null, stdout);
  });
};

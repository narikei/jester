const fs = require('fs');
const sudoer = require('./sudoer');

const HOSTS_PATH = '/etc/hosts';

module.exports.readFile = (callback) => {
  fs.readFile(HOSTS_PATH, (error, content) => {
    if (error) {
      console.error(error);
      callback('hostsファイルが読み込めませんでした。');
      return;
    }
    
    const text = content.toString();
    callback(null, text);
  });
};

module.exports.writeFile = (filepath, text, callback) => {
  fs.writeFile(filepath, text, (error) => {
    if (error) {
      console.error(error);
      callback('書き込みに失敗しました。');
      return;
    }
    let command = `mv ${filepath} ${HOSTS_PATH}`;
    sudoer.execute(command, (error, stdout) => {
      if (error) {
        console.error(error);
        callback('書き込みに失敗しました。');
        return;
      }

      callback(null, stdout);
    });
  });
};

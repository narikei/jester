const IP_REG = /^[0-9\.|\[{0,1}a-z\:\%\]{0,1}]+/g
const COMMENT_REG = /\#.+$/g
const SEPARATER_REG = /[\s\t]+/g

module.exports = class {
  constructor(text) {
    if (!text) {
      return;
    }

    this.list = [];
    
    const lines = text.split(/\r\n|\r|\n/);
    lines.forEach((line) => {
      const params = {
        type: 'host',
      };
      
      params.text = line.replace(/^\s*|\s*$/g, '');
      
      if (params.text === '') {
        params.type = 'blank';
      } else if (params.text.charAt(0) === '#') {
        params.type = 'comment';
        params.comment = params.text;
      } else {
        let str = params.text;
        let array;

        // comment
        array = str.match(COMMENT_REG);
        if (array && array.length === 1) {
          params.comment = array[0];
          str = str.replace(COMMENT_REG, '');
        }

        // ip
        array = params.text.match(IP_REG);
        if (array && array.length === 1) {
          params.ip = array[0];
          str = str.replace(IP_REG, '');
        }

        // host
        str = str.replace(SEPARATER_REG, '');
        params.host = str;
      }

      this.list.push(params);
    });
  }

  getLines() {
    const list = [];
    this.list.forEach((line) => {
      list.push(line.text);
    });
    return list;
  }
};
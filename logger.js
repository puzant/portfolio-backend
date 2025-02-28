import fs from 'fs'

class Logger {
  constructor() {
    this.logFilePath = './log.txt'
  }

  getTimeStamp() {
    return new Date().toISOString()
  }

  logError(error) {
    const timestamp = this.getTimeStamp()
    const stack = error.stack ? error.stack.split('\n').slice(0, 5).join('\n') : 'No stack trace available';
    const logMessage = `\n[${timestamp}] [ERROR] ${error.message}\n\n${stack}\n`;

    console.error(logMessage)
    fs.appendFileSync(this.logFilePath, logMessage)
  }
}

export default new Logger()
var chalk = require('chalk')

module.exports = function (msg) {
  if (msg) {
    console.log('')
    console.log('      ' + chalk.black.bgYellow(' ' + msg + ' '))
    console.log('')
  }
}

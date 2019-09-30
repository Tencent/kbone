const path = require('path')

module.exports = {
  'extends': [
    path.resolve(__dirname, '../../.eslintrc.js'),
  ],
  'rules': {
    'import/no-unresolved': 'off',
    'import/no-absolute-path': 'off',
  },
  'globals': {
    'init': true,
    'appConfig': true,
  },
}

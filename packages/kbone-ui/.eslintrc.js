module.exports = {
  'extends': [
    'airbnb-base',
    'plugin:promise/recommended'
  ],
  'parserOptions': {
    'ecmaVersion': 9,
    'ecmaFeatures': {
      'jsx': false
    },
    'sourceType': 'module'
  },
  'env': {
    'es6': true,
    'node': true,
    'jest': true,
    'browser': true,
  },
  'plugins': [
    'import',
    'node',
    'promise'
  ],
  'rules': {
    'arrow-parens': 'off',
    'comma-dangle': [
      'error',
      'only-multiline'
    ],
    'complexity': ['error', 10],
    'func-names': 'off',
    'global-require': 'off',
    'handle-callback-err': [
      'error',
      '^(err|error)$'
    ],
    'import/no-unresolved': [
      'error',
      {
        'caseSensitive': true,
        'commonjs': true,
        'ignore': ['^[^.]']
      }
    ],
    'import/prefer-default-export': 'off',
    'linebreak-style': 'off',
    'no-catch-shadow': 'error',
    'no-continue': 'off',
    'no-div-regex': 'warn',
    'no-else-return': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-shadow': 'off',
    'no-multi-assign': 'off',
    'no-underscore-dangle': 'off',
    'node/no-deprecated-api': 'error',
    'node/process-exit-as-throw': 'error',
    'object-curly-spacing': [
      'error',
      'never'
    ],
    'operator-linebreak': [
      'error',
      'after',
      {
        'overrides': {
          ':': 'before',
          '?': 'before'
        }
      }
    ],
    'prefer-arrow-callback': 'off',
    'prefer-destructuring': 'off',
    'prefer-template': 'off',
    'quote-props': [
      1,
      'as-needed',
      {
        'unnecessary': true
      }
    ],
    'semi': [
      'error',
      'never'
    ],
    'indent': ['error', 4, {'SwitchCase': 1}],
    'space-before-function-paren': ['error', 'never'],
    'no-return-assign': 'off',
    'complexity': 'off',
    'no-use-before-define': 'off',
    'max-len': 'off',
    'no-restricted-syntax': 'off',
    'no-console': 'off',
    'class-methods-use-this': 'off',
    'no-nested-ternary': 'off',
    'no-mixed-operators': 'off',
    'consistent-return': 'off',
    'no-restricted-globals': 'off',
    'promise/always-return': 'off',
    'camelcase': 'off',
    'no-control-regex': 'off',
    'no-await-in-loop': 'off',
    'import/no-extraneous-dependencies': 'off',
    'promise/no-nesting': 'off',
    'array-callback-return': 'off',
    'no-trailing-spaces': ['error', {'ignoreComments': true}],
  },
  'globals': {}
}

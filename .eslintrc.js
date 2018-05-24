module.exports = {
  "extends": "standard",
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    'semi': [1, 'always'],
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always'
    }],
    'no-useless-constructor': 'off',
    'no-unused-vars': 'warn',
    'eol-last': ['error', 'always'],
    'promise/param-names': 'never',
  }
};

module.exports = {
  extends: ['stylelint-config-recommended-scss', 'stylelint-config-recess-order'],
  overrides: [
    {
      files: ['**/*.{css,scss}'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['**/*.less'],
      parser: 'less',
      plugins: ['stylelint-order'],
    },
  ],
  rules: {
    'import-notation': 'string',
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'keyframes-name-pattern': null,
    'no-descending-specificity': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'export', 'deep'],
      },
    ],
    'order/order': null,
    'no-empty-source': null,
    'order/properties-order': null,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind'],
      },
    ],
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['menuBg', 'menuText', 'menuActiveText'],
      },
    ],
  },
};

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'airbnb-base',
    'plugin:vue/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['vuetify', 'vue'],
  // add your custom rules here
  rules: {
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'no-unused-vars': 'off',
    'import/no-extraneous-dependencies': 'off',
    'global-require': 'off',
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
  },
};

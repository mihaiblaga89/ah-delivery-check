module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    [
      'module-resolver',
      {
        root: ['./src'],
      },
    ],
    'dynamic-import-node',
    '@babel/plugin-proposal-class-properties',
  ],
  ignore: ['**/*.test.js'],
};

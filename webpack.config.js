const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js',
    fleet: './src/fleet-management.js'
  },
  output: {
    filename: '[name].bundle.js', // Generates main.bundle.js and fleet.bundle.js
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Transpile .js files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], // Use preset-env for modern JavaScript
          },
        },
      },
    ],
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 9000,
  },
  resolve: {
    extensions: ['.js'],
  },
};

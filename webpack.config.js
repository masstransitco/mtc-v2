const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js', // Entry point for Sign-in & Verification
    fleet: './src/fleet.js'  // Entry point for Fleet Management
  },
  output: {
    filename: '[name].bundle.js', // Generates main.bundle.js and fleet.bundle.js
    path: path.resolve(__dirname, 'public'), // Output directory
    publicPath: '/', // Public URL of the output directory when referenced in a browser
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply this rule to .js files
        exclude: /node_modules/, // Exclude dependencies in node_modules
        use: {
          loader: 'babel-loader', // Use Babel loader to transpile JavaScript
          options: {
            presets: ['@babel/preset-env'], // Preset for compiling ES6+ syntax
          },
        },
      },
      {
        test: /\.css$/, // Apply this rule to .css files
        use: ['style-loader', 'css-loader'], // Enables importing CSS into JS
      }
    ],
  },
  devServer: {
    static: path.join(__dirname, 'public'), // Serve static files from 'public' directory
    compress: true, // Enable gzip compression
    port: 9000, // Port to run the dev server
  },
  resolve: {
    extensions: ['.js'], // Resolve these extensions
  },
};

module.exports = {
    // other configurations
    module: {
      rules: [
        // Other loaders
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[hash].[ext]',
                outputPath: 'assets/', // Customize the output path
              },
            },
          ],
        },
      ],
    },
  };
  
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: {
    main: './src/main.js',
    reservation: './src/pages/reservation/reservation.js',
    login: './src/pages/login/login.js',
    register: './src/pages/register/register.js',
    dashboard: './src/pages/admin/dashboard/dashboard.js',
    reservationEdit: './src/pages/admin/reservation-edit/reservation-edit.js',
    reservationDetails: './src/pages/admin/reservation-details/reservation-details.js',
    footer: './src/vendors/footer.vendor.js',
    navbar: './src/vendors/navbar.vendor.js',
    bootstrap: './src/vendors/bootstrap.vendor.js',
  },
  output: {
    filename: 'js/[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: false, // Disable to see raw errors in console
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
        generator: { filename: 'images/[hash][ext]' },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: { filename: 'fonts/[hash][ext]' },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['main', 'footer', 'navbar', 'bootstrap'],
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/reservation/reservation.html',
      filename: 'reservation/index.html',
      chunks: ['reservation', 'footer', 'navbar', 'bootstrap'],
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/login/login.html',
      filename: 'login/index.html',
      chunks: ['login', 'bootstrap'],
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/register/register.html',
      filename: 'register/index.html',
      chunks: ['register', 'bootstrap'],
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/admin/dashboard/dashboard.html',
      filename: 'dashboard/index.html',
      chunks: ['dashboard', 'footer', 'navbar', 'bootstrap'],
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/admin/reservation-edit/reservation-edit.html',
      filename: 'reservation/edit/index.html',
      chunks: ['reservationEdit', 'footer', 'navbar', 'bootstrap'],
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/admin/reservation-details/reservation-details.html',
      filename: 'reservation/details/index.html',
      chunks: ['reservationDetails', 'footer', 'navbar', 'bootstrap'],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
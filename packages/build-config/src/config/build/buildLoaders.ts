import { ModuleOptions } from 'webpack';
import ReactRefreshTypeScript from 'react-refresh-typescript';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BuildOptions } from './types/types';
import { buildBabelLoader } from './babel/buildBabelLoader';

export default function buildLoaders(options: BuildOptions): ModuleOptions['rules'] {
  const isDev = options.mode === 'development';
  const assetLoader = {
    test: /\.(png|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  }
  const svgrLoader = {
    test: /\.svg$/i,
    use: [{
      loader: '@svgr/webpack', 
      options: {
        icon: true,
        svgoConfig: {
          plugins: [
            {
              name: 'convertColors',
              params: {
                currentColor: true
              }
            }
          ]
        }
      }
    }],
  }
  const cssLoaderWithModules = {
    // свойство test строкой ниже закоментировано, потому что оно указано на 17 строке
    // test: /\.css$/i, 
    loader: "css-loader",
    options: {
      modules: {
        localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]'
      },
    },
  }
  const scssLoader = {
    test: /\.s[ac]ss$/i,
    use: [
      // Creates `style` nodes from JS strings
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      // Translates CSS into CommonJS
      cssLoaderWithModules,
      // Compiles Sass to CSS
      "sass-loader",
    ],
  }

  const tsLoader = {
    // ts-loader умеет работать с jsx
    // если бы мы не использовали typescript: нужен бы был babel-loader
    exclude: /node_modules/,
    test: /\.tsx?$/,
    use: [
      { 
        loader: 'ts-loader',
        options: {
          // transpileOnly: true (типы не проверяет)
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
          }),
        }
      }
    ]
  }

  // const babelLoader = buildBabelLoader(options)

  return [
    assetLoader,
    scssLoader,
    tsLoader,
    // babelLoader,
    svgrLoader
  ]
}
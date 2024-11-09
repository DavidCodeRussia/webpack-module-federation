import path from 'path';
import {
  buildWebpack,
  BuildMode,
  BuildPaths,
  BuildPlatform
} from '@packages/build-config';
import webpack from 'webpack';
import packageJson from './package.json';

interface EnvVariables {
  mode?: BuildMode
  port?: number
  analyzer?: boolean
  platform?: BuildPlatform
}

export default (env: EnvVariables) => {
  const paths: BuildPaths = {
    output: path.resolve(__dirname, 'build'),
    entry: path.resolve(__dirname, 'src', 'index.tsx'), 
    html: path.resolve(__dirname, 'public', 'index.html'),
    public: path.resolve(__dirname, 'public'),
    src: path.resolve(__dirname, 'src')
  }
  const config = buildWebpack({
    port: env.port ?? 3001,
    mode: env.mode ?? 'development',
    paths,
    analyzer: env.analyzer,
    platform: env.platform ?? 'desktop'
  });

  config.plugins.push(new webpack.container.ModuleFederationPlugin({
    name: 'shop',
    // (fileName) название файла которое будет удаленно подключаться
    // в host container. по умолчанию называют remoteEntry.js
    filename: 'remoteEntry.js', 
    // что мы хотим предоставить приложению контейнеру
    // грубо говоря что мы отдаем наружу
    // та часть что мы будем внедрять в host container
    exposes: {
      './Router': './src/router/Router.tsx',
    },
    // здесь указываем какие библиотеки у нас общие, 
    // а какие должны шариться
    shared: {
      ...packageJson.dependencies,
      react: {
        // противоположность lazy loading
        eager: true,
        requiredVersion: packageJson.dependencies['react'],
      },
      'react-router-dom': {
        eager: true,
        requiredVersion: packageJson.dependencies['react-router-dom'],
      },
      'react-dom': {
        eager: true,
        requiredVersion: packageJson.dependencies['react-dom'],
      }
    }
  }))

  return config
}
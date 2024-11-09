import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { BuildOptions } from './types/types';

export default function buildDevServer(options: BuildOptions): DevServerConfiguration {
    return {
      port: options.port ?? 3000,
      open: true,
      // свойство ниже работает только для dev-сервера.
      // если раздавать статику через nginx, то надо
      // делать проксирование через index.html
      historyApiFallback: true,
      hot: true
    }
}
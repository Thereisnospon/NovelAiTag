import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

import Unocss from 'unocss/vite';

export default defineConfig({
    plugins: [
        vue(),
        Unocss({
            /* options */
        })
    ],

    // 别名
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }

    // ,
    // // 这里可以类比 webpack 的 devServer
    // // 设置开发服务器
    // server: {
    //   // 这里不设置 host 就无法像 webpack 一样在局域网中访问到
    //   host: '0.0.0.0',
    //   // port: 9999,
    //   // 设置代理
    //   proxy: {
    //     '/api': {
    //       target: 'http://localhost:3000',
    //       // changeOrigin: true,
    //       // rewrite: path => path.replace(/^\/api/, '')
    //     }
    //   }
    // }
});

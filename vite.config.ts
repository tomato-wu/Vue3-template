import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver(),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve('src')
    }
  },
  // publicDir: '',
  build: {
    terserOptions: {
      // 生产环境禁用console和debugger
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // 资源相对路径
  base: './'
})

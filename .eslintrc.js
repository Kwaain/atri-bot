/** @format */

import { defineConfig } from 'eslint-define-config'

export default defineConfig({
  root: true, // 指定当前配置文件为根配置文件，不再向上查找
  // 指定环境的全局变量
  env: {
    ndoe: true, // Node.js 全局变量和 Node.js 作用域
    es2021: true // 启用除了modules以外的所有ECMAScript 2021特性
  },
  // 继承的子规范
  extends: [
    'prettier/@typescript-eslint',
    'standard',
    'prettier',
    'plugin:prettier/recommended'
  ],
  // 解析器选项
  parserOptions: {
    ecmaVersion: 13, // ECMAScript 版本
    parser: '@typescript-eslint/parser', // 解析器
    sourceType: 'module' // 指定来源的类型，有两种”script”或”module”
  },
  // 插件
  plugins: ['@typescript-eslint', 'import', 'node', 'promise'],
  // 自定义规则
  rules: {}
})

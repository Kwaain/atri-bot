export default {
    // 定义ESLint的解析器
    parser: '@typescript-eslint/parser',
    // 定义文件继承的子规范
    extends: ['prettier/@typescript-eslint', 'plugin:prettier/recommended'],
    // 定义了该eslint文件所依赖的插件
    plugins: ['@typescript-eslint'],
    // 指定代码的运行环境
    env: {
        node: true,
    },
}

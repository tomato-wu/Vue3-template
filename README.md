# Vue3-template

本项目由Shine创建的vue3模板，已支持Antd-vue按需引入、git提交信息校验、git提交自定义、eslint样式约束等，同时具有性能监控、日志上报、请求封装等功能

## Start

### 初始化

- `npm install` 安装依赖
- `npx husky add .husky/pre-commit "npm run lint-staged"` 添加钩子（代码提交前样式检查和修复）
- `npx husky add .husky/commit-msg 'npx commitlint --edit "$1"' ` 添加钩子(提交的message进行规则检查)
- 根据开发或生产环境配置`.env.development`或`.env.production`文件

### git提交

在`git add`文件之后，要摒除以往手动`git commit`提交信息，而是运行`npm run commit`通过终端提示进行提交，规范提交信息

## Features

### 页面跳转

减少使用原生`vue-router`,而是通过调用封装的`src/utils/usePage/index.ts`文件进行跳转,习惯使用函数式编程

例子:

```ts
// 跳转/home路径
const go = useGo()
go(PageEnum.HOME)   // PageEnum为路径的枚举

// 返回
useBack()
```

### 网络请求

调用`src/utils/http/index.ts`进行网络请求

### 性能监控

调用`src/utils/monitor/index.ts`的Monitor进行打点和监控性能

样例：

```ts
const monitor = Monitor.getInstance()
monitor.start('key1')

// 需要结束监控key1时
const monitor = Monitor.getInstance()
monitor.end('key2')
```

### 页面消息提示

调用`src/utils/useMessage/index.tsx`进行页面消息提示，支持Modal,Notification等

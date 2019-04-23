# Node Typescript 项目，用于sso中间层

## 技术点
1. nodemon 自动监听文件变化，开发阶段方便 (没有使用)
2. ts-node-dev 自动监听文件变化，开发阶段方便 （项目中使用）
3. gulp 拷贝文件夹
4. cross-env 部署动态带入process.env.NODE_ENV
5. tsc
6. koa2，koa2-cors，koa-bodyparser，koa-router
7. axios
8. jsonwebtoken 中间件

## 优化点
1. axios 统一设置timeout，以免长时间占用

## to do
1. 尾递归优化
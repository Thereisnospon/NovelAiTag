# Novel_AI_Tag

一个 Novel Ai 的 ai 绘画魔导书

## 链接

-   [Novel_AI_Tag 网站链接](https://thereisnospon.github.io/NovelAiTag/)
-   [作者 B 站链接](https://space.bilibili.com/6537379)

## 网站使用帮助

0. 删除本地存储可以解决大部分 bug，但是意味着分组顺序以及添加 tag 会被清空
1. TAG 点击左边是减少权重，中间是打开关闭 TAG ，右边是增加权重，没有打开 TAG 只增减权重不会添加 TAG。
2. 分组管理用法：在文本框调节分组顺序，或者新增删除分组. 比如是 [头,脚] 改成 [m1 头] 相当于 头 分类的顺序调节到最后,并且删掉了 脚分组，而且增加了一个 m1 分组 新增的分组必须以 m 开头，分组之间用英文逗号,分割

## 需求

1. [] 实现 tag 搜索功能
2. [] 迁移数据存储方式
3. [] vue 框架迁移 (暂定使用 Vue3 + Vite + Element_Plus)

## 技术栈

-   Vue3
-   Vite
-   Element_Plus
-   Unocss
-   Pinia

## 部署操作

```bash
# 安装 pnpm ( npm 和 yarn 大概也可以, 推荐使用 pnpm )
# git clone 本项目之后, cd 进入文件夹
pnpm install # 安装依赖
pnpm dev # 本地调试
pnpm build # 本地打包

```

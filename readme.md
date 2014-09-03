## my code for flux todo app

slight different from the demo on flux site

### start and run

    npm install
    npm install gulp -g
    npm start


## ReactApp 开发流程...
模块 & 组件的划分更细致, 数据渲染成页面变得简单直接. 随之而来的是数据的操作和维护,变得更为重要, 良好的数据结构可以使操作变得简单的多. 如todoApp中的map格式的todo列表, CRUD中update和delete都简单了很多, create 和 read的复杂度基本没有变化.

以下环节暂不定顺序, 只是大致顺序

* 数据结构制定期
* 页面样式期
* 转化为组件期
* Dispatcher Store Action框架搭建期
* 数据操作期
这是网盘系统前台项目，使用 vue 开发

### record

Global Component

- IconFont

### process

```js
listenerRouteChange((to) => {
  console.log(to);
});

// 每单独监听路由浪费性能，使用发布订阅者模式
router.beforeEach((to, from, next) => {
  next();
});
```

### 参数
- 指定页面页数 page
- 指定页面条数 pageSize - limit
- 搜索内容key标识 search
- 


### Todo
fix: 修复List组件网络不确定时延导致的内容与页码错乱的问题
这是网盘系统前台项目，使用vue开发

### process

``js
listenerRouteChange((to) => {
  console.log(to);
});

// 每单独监听路由浪费性能，使用发布订阅者模式
router.beforeEach((to, from, next) => {
  next();
});
```
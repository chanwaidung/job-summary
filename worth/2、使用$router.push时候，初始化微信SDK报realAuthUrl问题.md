# 使用$router.push时候，初始化微信SDK报realAuthUrl问题

## 一、调用router.push，无法初始化SDK

> 在开发微信H5应用时，需要接入微信的地理位置授权，遂引入微信JSSDK。

因为是SPA应用，所以将SDK初始化放在全局路由守卫，配合白名单来完成SDK的注册。

`whiteList.js`: 微信初始化白名单

```javascript
export const WECHAT_SDK_INIT_WHITE_LIST = [ 'GetLocation' ]
```

`/router/index.js`: 路由配置

```javascript
router.beaforeEach((to, from, next)=> {
   if(WECHAT_SDK_INIT_WHITE_LIST.includes(to.name)) {
       // TODO: 初始化微信SDK 
   }
    next()
})
```

到这里一切都还正常，但是当我路由跳转到其他同样需要初始化JSSDK的页面时，诡异的事情发生了：

![real-auth-url](https://github.com/chanwaidung/job-summary/blob/main/static/real-auth-url-error.png?raw=true)

再次确认，请求后端签名时上传的URL地址、通过`vConsole`打印当前的`location.href`确实是当前的页面的URL无误。

如果请求的URL与当前的页面location.href一致，但是却报realAuthUrl这样的错误，那么只能是微信SDK对页面URL的判断是有问题的。

## 二、原理剖析

vue-router的history模式的实现主要是借助HTML5的`pushState、replaceState、以及popState事件`来实现，当**调用pushState、replaceState并不会使页面重新加载。**

vue-router通过路由表中，路由路径与组件的对应关系来对页面进行渲染，路由的变化会引浏览器地址栏URL的改变，从而根据URL渲染特定的vue组件，**这并不会导致浏览器重新加载页面。**

而在微信JSSDK的源码中，**当引入SDK脚本时会将模块默认挂载到window对象上，并缓存当前的页面的URL地址。**

```javascript
!(function(e, n) {
    module.exports = n(e)
})(window, function(o, e) {
    if(!o.jWeixin) {
        // 微信sdk相关逻辑
    }
})
```

在源码中，当当前window对象的jWeixin属性存在时，证明模块已经引入，此时并不会重新执行相关的代码。自然，URL始终都是第一次加载微信JSSDK脚本时，那个页面的URL。

## 三、解决方案

- 使用`window.location.href`方式跳转强制让页面重新加载，从而使window重新绑定微信SDK。

- 手动将window.jWeixin置为null



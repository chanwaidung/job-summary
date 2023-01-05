# 前端项目模板管理 CHAN-CLI

## 一、背景

随着业务的开拓前端的项目越来越多，包括H5、Web Admin、小程序等等。

它们或因为技术、功能不同，所以往往需要不同的代码模板。

如果每次都用Vue CLI来开新项目，每次都需要重新配置项目需要的一些工具，比如:

- UI: 适配第三方UI库, arco-design、vant、ElementUI等等

- CSS: 适配CSS相关，sass、autoprefixer等等

- Mobile: 适配移动端，postcss-px2viewport、postcss-px2rem等等

- Framework Base: 使用vue-router、pinia\vuex、axios等，搭建项目基础模板

- Script: 一些工具脚本，鉴权类、本地存储类、CDN工具函数等等

但是项目越来越多，技术越来越复杂，模板库也会相应的增加。

因此，如果有一个好的项目模板工具，会使得工作变得更便捷。这样就不用

每次开新的代码库，都要去git上copy SSH link、clone显得有点麻烦。

## 二、工作流程

##### 1.用户安装

```shell
npm i chan-cli -g
```

##### 2.创建项目

```shell
chan init
```

##### 3.输入项目名称
```shell
? Input the program name which you want.... chan-template
```

##### 4.选择项目模板

```shell
? Select the coding template (Use arrow keys)
❯ H5 Template 
  Web Admin Template
```

## 三、实现

## 四、总结

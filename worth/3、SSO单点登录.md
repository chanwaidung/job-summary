# SSO单点登录

> 当公司的业务繁多的时候，不可能为每个项目都单独写一个登录业务。这时候就需要我们将登录业务抽离出来，做成统一的登录模块了。

## 一、场景

目前有三个项目，**【专家评价】**、**【测评管理】**、**【360评估】**，需要用户完成登录来确定用户身份。

如果我们都为每个项目写一套用户登录显得很不合理，并且如果后续增加了相应的管理系统，又需要增加同样的登录业务这样的代码多余、且难以维护。

一样的业务需要维护多套代码，简直噩梦。

## 二、技术

假设当前有用户直接输入**master.abc.com**进入【专家评价】，此时因为用户首次进入，并未携带任何用户信息，系统将引导用户引导至**sso.abc.com**，完成登录流程。

![](https://github.com/chanwaidung/job-summary/blob/main/static/sso-flow.png?raw=true)

1. `master.abc.com`请求**Business Server**

2. **Business Server**发现用户未登录，返回**401 Forbidden**

3. `master.abc.com`发现状态码为**401 Forbidden**时，重定向至`sso.abc.com?redirect=https%3A%2F%2Fmaster.abc.com`

4. 用户在`sso.abc.com`发起登录

5. **Auth Server**校验用户的登录信息，登录信息校验成功，**Auth Server**返回**Auth Code**

6. 重定向至：`master.abc.com?authCode=xxxxxxxxxxx`

7. 携带**authCode**请求**Auth Server**

8. 校验**authCode**成功，返回**AccessToken、refreshCode**

## 三、实现

`sso-client`: **登录界面**

`master-client`: **专家系统**

`business-server`: **业务服务**

`auth-server`: **单点登录服务**

## 四、总结

虽然很多功能没实现但是，总体流程基本就是如此

[源码地址](https://github.com/chanwaidung/job-summary/tree/main/origin/sso)

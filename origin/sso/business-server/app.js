const express = require('express')
const {expressjwt: jwt} = require('express-jwt')
const {v1:uuid} = require('uuid')

const app = express()

// TODO: 配置jwt中间件，生成Token

const apiPath = function (path) {
    return '/api' + path
}

const whiteDomain = ['http://127.0.0.1:2048', 'http://127.0.0.1:1257']

// CORS配置
app.all(apiPath(), function (req,res) {
    res.setHeader('Access-Control-Allow-Origin', whiteDomain.toString())
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,OPTIONS,PATCH')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
})

// CORS预检请求配置
app.options(apiPath('/*'), function (req, res) {
    res.sendStatus(200)
})

// 模拟登录接口
app.post(apiPath('/sign-in'), function (req, res) {
    res.status(200)
    res.send({
        authCode: uuid()
    })
})

app.get(apiPath('/get-data'), function (req, res) {
    const isLegalAuth = function (authorization) {
       return !!authorization.split('Bearer ')[0]
    }
    if(isLegalAuth(req.headers.authorization)) {
        res.send({
            list: Array.from({length: 5}).map(item=> uuid())
        })
        return
    }
    res.sendStatus(401)
})

// 获取token
app.get(apiPath('/get-token'), function (req, res) {
    res.status(200)
    res.send({
        accessToken: `${uuid().replaceAll('-')}.${uuid().replaceAll('-')}.${uuid().replaceAll('-')}`,
        expiredTime: new Date().getTime() + 7 * 24 * 60 * 60 * 1000
    })
})

app.listen(5678, function () {
    console.log('Start Success in port: ', 5678)
})

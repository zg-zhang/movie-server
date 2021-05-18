const Router = require('koa-router')
const { secret } = require('../contants/config')
const { response, getRandomString } = require('../tools/tools')
const { find, add } = require('../tools/sql')
const jwt = require('jsonwebtoken')

const mainRouter = new Router()

// 注册
mainRouter.post('/register', async ctx => {
    const { phone, password } = ctx.request.body
    const data = await find('users', '', {phone})
    if (!data.length) {
        const avatar = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202003%2F26%2F20200326144657_zwnpn.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1623661073&t=aabc3608c822255350b10873ae97ba7e'
        const id = getRandomString()
        const nickName = `新用户_${id}`
        const stars = JSON.stringify([])
        await add('users', {id, phone, password, nickName, avatar, stars})
        ctx.body = response('success', 200, '注册成功！')
    } else {
        ctx.body = response('error', 200, '该手机号已经注册过啦～')
    }
})

// 登录
mainRouter.post('/login', async ctx => {
    const { phone, password } = ctx.request.body
    const data = await find('users', '', {phone})
    if (!data.length) ctx.body = response({status: 'error'}, 200, '没有找到这个用户哦～')
    if (data[0].password === password) {
        const token = jwt.sign({
            data: data[0].id
        }, secret)
        const info = {
            id: data[0].id,
            phone: data[0].phone,
            nickName: data[0].nickName,
            avatar: data[0].avatar,
            signature: data[0].signature,
            stars: JSON.parse(data[0].stars)
        }
        ctx.body = response({status: 'success', token, info}, 200, '登录成功！')
    } else {
        ctx.body = response({status: 'error'}, 200, '密码错啦～')
    }
})

// 获取首页数据
mainRouter.get('/getAllData', async ctx => {
    const list = await find('list', 'releaseDateNew DESC')
    const movieList = []
    const comingListNeiDi = []
    const comingListOther = []
    const popularList = []

    list.forEach(item => {
        const _isNew = type => item.type.indexOf(type) !== -1 && item.releaseDateNew !== null
        const _limit = (array, size) => array.length < size
        if (item.isPopular === '1' && _limit(popularList, 10)) popularList.push(item)

        if (_isNew('0') && _limit(movieList, 10)) {
            movieList.push(item)
        } else if (_isNew('1') && _limit(comingListNeiDi, 10)) {
            comingListNeiDi.push(item)
        } else if (_isNew('2') && _limit(comingListOther, 10)) {
            comingListOther.push(item)
        }
    })
    ctx.body = response({movieList, comingListNeiDi, comingListOther, popularList})
})

// 获取发现页列表
mainRouter.get('/getAllList', async ctx => {
    const data = await find('list', 'releaseDateNew DESC')
    ctx.body = response({data})
})

// 获取电影详情
mainRouter.get('/getDetail/:id', async ctx => {
    const { id } = ctx.request.params
    const data = await find('movie', '', {id})
    ctx.body = response(data[0])
})

module.exports = mainRouter
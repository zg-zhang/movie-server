const Router = require('koa-router')
const { find, update } = require('../tools/sql')
const { response } = require('../tools/tools')

const apiRouter = new Router()

// 收藏电影
apiRouter.post('/changeStar', async ctx => {
    const { uid, mid } = ctx.request.body
    const data = await find('users', '', {id: uid})
    const stars = JSON.parse(data[0].stars)
    const hasMovie = stars.indexOf(mid) === -1

    if (hasMovie) {
        await update('users', {stars: JSON.stringify([...stars, mid])}, {id: uid})
    } else {
        const newStars = stars.filter(item => item !== mid)
        await update('users', {stars: JSON.stringify(newStars)}, {id: uid})
    }

    const res = await find('users', '', {id: uid})
    ctx.body = res[0]
})

apiRouter.post('/getStars', async ctx => {
    const { stars } = ctx.request.body
    const res = []
    for (let i = 0; i < stars.length; i++) {
        res[i] = (await find('list', '', {id: stars[i]}))[0]
    }
    ctx.body = res
})

module.exports = apiRouter
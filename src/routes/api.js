const Router = require('koa-router')
const { response } = require('../tools/tools')

const apiRouter = new Router()

// 改变收藏状态
apiRouter.post('/changeStar', async ctx => {
    const { id } = ctx.request.body
    console.log(id)
    ctx.body = response()
})

module.exports = apiRouter
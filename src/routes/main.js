const Router = require('koa-router')
const { response } = require('../tools/tools')
const { find } = require('../tools/sql')

const mainRouter = new Router()

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

mainRouter.get('/getAllList', async ctx => {
    const data = await find('list', 'releaseDateNew DESC')
    ctx.body = response({data})
})

mainRouter.get('/getDetail/:id', async ctx => {
    const { id } = ctx.request.params
    const data = await find('movie', '', {id})
    ctx.body = response(data[0])
})

module.exports = mainRouter
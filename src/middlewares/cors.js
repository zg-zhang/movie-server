module.exports = async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE')
    ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type, authorization')
    ctx.set('Access-Control-Max-Age', 3600)
    ctx.set('Content-Type', 'application/json;charset=utf-8')

    if (ctx.method === 'OPTIONS') {
        ctx.body = 'options success'
        ctx.status = 204
    } else {
        await next()
    }
}
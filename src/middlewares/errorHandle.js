module.exports = errorHandle = (ctx, next) => {
    return next().catch(err => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = {
                code: 200,
                message: '您没有权利访问哦～'
            }
        } else {
            throw err
        }
    })
}
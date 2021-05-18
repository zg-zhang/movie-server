const Koa = require('koa2')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const jwt = require('koa-jwt')

const { host, secret } = require('./src/contants/config')
const cors = require('./src/middlewares/cors')
const errorHandle = require('./src/middlewares/errorHandle')

const mainRouter = require('./src/routes/main')
const apiRouter = require('./src/routes/api')

const app = new Koa()
const router = new Router()

router
    .use('/main', mainRouter.routes(), mainRouter.allowedMethods())
    .use('/api', apiRouter.routes(), apiRouter.allowedMethods())

app
    .use(cors)
    .use(logger())
    .use(bodyParser({
        enableTypes: ['json', 'form', 'text'],
        extendTypes: {
            text: ['text/xml', 'application/xml']
        }
    }))
    .use(errorHandle)
    .use(jwt({ secret }).unless({path: [/\/main/]}))
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(host, () => {
        console.log(`listen @http://127.0.0.1:${host}`)
    })
const Koa = require('koa2')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')

const { host } = require('./src/contants/config')
const cors = require('./src/middlewares/cors')
const mainRouter = require('./src/routes/main')

const app = new Koa()
const router = new Router()

router
    .use('/main', mainRouter.routes(), mainRouter.allowedMethods())

app
    .use(cors)
    .use(logger())
    .use(bodyParser({
        enableTypes: ['json', 'form', 'text'],
        extendTypes: {
            text: ['text/xml', 'application/xml']
        }
    }))
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(host, () => {
        console.log(`listen @http://127.0.0.1:${host}`)
    })
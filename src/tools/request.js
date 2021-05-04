const axios = require('axios')
const qs = require('qs')

const { baseURL } = require('../contants/config')

const request = axios.create({
    baseURL: baseURL,
    timeout: 3000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

request.defaults.retry = 10

request.interceptors.response.use(res => res.data, err => {
    let config = err.config
    if (!config || !config.retry) return Promise.reject(err)

    config.__retryCount = config.__retryCount || 0

    if (config.__retryCount >= config.retry) {
        return Promise.reject(err)
    }

    config.__retryCount += 1
    console.log(`[请求超时 重新请求 第${config.__retryCount}次] @${config.url}`)

    let backoff = new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, 3000)
    })

    return backoff.then(() => request(config))
})

request.interceptors.request.use(
    config => {
        config.data = qs.stringify(config.data)
        return config
    },
    error => Promise.reject(error)
)

module.exports = request
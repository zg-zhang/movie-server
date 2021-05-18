const random = require('string-random')

const response = (data = {}, code = 200, message = 'success') => {
    return {code, message, data}
}

const getRandomString = () => {
    return random(16)
}

module.exports = {
    response,
    getRandomString
}
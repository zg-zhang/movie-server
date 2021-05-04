const request = require('../tools/request')
const {
    commonListNeiDi,
    commonListOther,
    movieList,
    popularList,
    movieDetail
} = require('../contants/config')

// 获取内地即将上映列表
const getComingListNeiDi = async () => {
    console.log(`[内地即将上映] 更新开始`)
    const data = await request.get(commonListNeiDi)
    return data.data.moviecomings
}

// 获取其他即将上映列表
const getComingListOther = async () => {
    console.log(`[其他即将上映] 更新开始`)
    const data = await request.get(commonListOther)
    return data.data.movies
}

// 获取正在上映列表
const getMovieList = async () => {
    console.log(`[正在上映] 更新开始`)
    const data = await request.get(movieList)
    return data.data.ms
}

// 获取最受关注列表
const getPopularList = async () => {
    console.log(`[最受关注] 更新开始`)
    const dara = await request.post(popularList, {
        pType: 1,
        size: 50
    })
    return dara.data.populars
}

// 获取电影详情
const getMovieDetail = async id => {
    console.log(`[电影详情] ${id} 更新开始`)
    return await request.get(`${movieDetail}${id}`)
}

const getQueue = [
    getMovieList,
    getComingListNeiDi,
    getComingListOther,
    getPopularList
]

module.exports = {
    getQueue,
    getMovieDetail
}
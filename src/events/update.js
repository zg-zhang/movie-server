const { add, find, update } = require("../tools/sql");
const {
    getQueue,
    getMovieDetail
} = require('./getData')

async function updateAll() {
    const len = getQueue.length
    await getList(0, len)
}

async function getList(i, len) {
    const list = await getQueue[i]()
    const ids = []
    list.map(item => {
        let id = ''
        if (i === 3) {
            id = item.relateId
        } else {
            id = item.movieId
        }
        ids.push(id)
    })
    await getDetail(ids, i, 0)
    if (i < len - 1) {
        await getList(i + 1, len)
    } else {
        console.log(`[更新完成]`)
    }
}

async function getDetail(ids, type, i) {
    if (ids[i] == '270114') await getDetail(ids, type, i + 1)
    else {
        const response = await getMovieDetail(ids[i])
        const res = response.data.basic

        const data = {
            actors: res.actors,
            cover: res.bigImage,
            countries: res.countries,
            directors: res.directors,
            tags: res.movieGenres,
            id: res.movieId,
            name: res.name,
            nameEn: res.nameEn,
            rating: res.overallRating,
            productionCompanies: res.productionCompanies,
            releaseDateNew: res.releaseDateNew,
            stageImg: res.stageImg,
            story: res.story,
            videos: res.videos,
            writers: res.writers,
            type: type < 3 ? type : '',
            isPopular: type === 3
        }
        const item = {
            id: res.movieId,
            cover: res.bigImage,
            name: res.name,
            nameEn: res.nameEn,
            releaseDateNew: res.releaseDateNew,
            type: type < 3 ? type : '',
            isPopular: type === 3
        }

        const has = await find('movie', '', {id: res.movieId})

        if (!has.length) {
            await add('movie', data)
            await add('list', item)
        } else if (type < 3 && Number(has[0].type) !== type) {
            console.log(`[数据更新] type ${type}`)
            await update('movie', {type: `${has[0].type}${type}`}, {id: res.movieId})
            await update('list', {type: `${has[0].type}${type}`}, {id: res.movieId})
        } else if (type === 3 && has[0].isPopular === '0') {
            console.log(`[数据更新] type ${type}`)
            await update('movie', {isPopular: '1'}, {id: res.movieId})
            await update('list', {isPopular: '1'}, {id: res.movieId})
        } else {
            console.log(`[数据已存在 跳过] ${res.movieId}`)
        }

        if (i < ids.length - 1) {
            await getDetail(ids, type, i + 1)
        } else {
            console.log(`[${type} 更新完成]`)
        }
    }
}

updateAll()
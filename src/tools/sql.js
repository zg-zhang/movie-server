const mysql = require('mysql')

const pool = mysql.createPool({
	host: '39.105.147.233',
	user: 'sex-crawler',
	password: 'Zzg010527..',
	database: 'movie'
})

function _objectToString(object = {}) {
	const keys = Object.keys(object)
	let string = ''
	keys.forEach((item, index) => {
		string += index === 0 ? `${item} = '${object[item]}'` : `, ${item} = '${object[item]}'`
	})
	return string
}

function _objectAddAnd(object = {}) {
	const keys = Object.keys(object)
	let string = ''
	keys.forEach((item, index) => {
		string += index === 0 ? `${item} = '${object[item]}'` : `AND ${item} = '${object[item]}'`
	})
	return string
}

function _objectToAdd(object = {}) {
	const keys = Object.keys(object)
	let keysStr = ''
	let mid = ''
	let values = []
	const _isObject = data => typeof data === 'object' && data !== null
	keys.forEach((item, index) => {
		keysStr += index === 0 ? item : `, ${item}`
		mid += index === 0 ? '?' : ', ?'
		values.push(_isObject(object[item]) ? JSON.stringify(object[item]): object[item])
	})
	return {
		keys: `(${keysStr})`,
		mid: `(${mid})`,
		values: values
	}
}

exports.find = function find(table, order, data) {
	const str = _objectAddAnd(data)
	let sql = str ? `SELECT * FROM ${table} WHERE ${str}` : `SELECT * FROM ${table}`
	if (order) sql = `${sql} ORDER BY ${order}`;
	return new Promise((resolve, reject) => {
		pool.query(sql, (err, result) => {
			if (err) {
				console.error(err)
				reject(err)
			}
			resolve(result)
		})
	})
}

exports.findCustomize = function (table, query) {
	const sql = `SELECT * FROM ${table} ${query}`
	console.log(sql)
	return new Promise((resolve, reject) => {
		pool.query(sql, (err, result) => {
			if (err) {
				console.error(err)
				reject(err)
			}
			resolve(result)
		})
	})
}

exports.add = function add(table, data) {
	const {keys, mid, values} = _objectToAdd(data);
	const sql = `INSERT INTO ${table} ${keys} VALUES ${mid}`
	return new Promise((resolve, reject) => {
		pool.query(sql, values, (err, result) => {
			if (err) {
				console.error(err)
				reject(err)
			}
			resolve(result)
		})
	})
}

exports.update = function update(table, data, where) {
	const dataStr = _objectToString(data)
	const whereStr = _objectToString(where)
	const sql = `UPDATE ${table} SET ${dataStr} WHERE ${whereStr}`
	return new Promise((resolve, reject) => {
		pool.query(sql, (err, result) => {
			if (err) {
				console.error(err)
				reject(err)
			}
			resolve(result)
		})
	})
}


const reserve = require('../novel/reserve')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"


const async = require('async');
const eventproxy = require('eventproxy');
const ep = new eventproxy()

const spiderConfig = {
	CONCURRENCY_COUNT: 5,
	MAX_SINGLE_COUNT: 10
}

async function testBook() {
	// let book = await reserve.init(res)
	const book = await reserve.getBook()
	const cs = await reserve.getChapters(book.chapterUrl)
	const length = cs.length
	const count = Math.floor(length / spiderConfig.MAX_SINGLE_COUNT)
	const list = []
	while (cs.length) {
		list.push(cs.splice(0, spiderConfig.MAX_SINGLE_COUNT))
	}
	let index = 0
	async.mapLimit(list, 1, function (subList, callback) {
		dos(subList, index++, callback)
	}, function (err, result) {
		console.log(err, result)
	})
}

function dos(list, index, subCallback) {
	async.mapLimit(list, spiderConfig.CONCURRENCY_COUNT, function (cs, callback) {
		reserve.getChapter(cs.source).then(res => {
			console.log(cs.source)
			cs.content = res
			cs.success = true
			callback(null, cs)
		}).catch(e => {
			cs.success = false
			cs.content = e.message
			callback(null, cs)
		})
		
	}, function (err, result) {
		let failed = []
		const success = result.filter(item => {
			if (!item.success) failed.push(item)
			return item.success
		})
		if (!err) {
			subCallback(null, {
				index,
				success: true,
				data: {
					failed,
					success
				}
			})
			// 写入数据库
		} else {
			subCallback(null, {
				index,
				success: false
			})
		}
	});
}


ep.after('chapter', result => {

})

testBook()

// async.parallel([
// 		function(callback) {
// 			setTimeout(function() {
// 				callback(null, 'one');
// 			}, 200);
// 		},
// 		function(callback) {
// 			setTimeout(function() {
// 				callback(null, 'two');
// 			}, 100);
// 		}
// 	],
// // optional callback
// 	function(err, results) {
// 		// the results array will equal ['one','two'] even though
// 		// the second function had a shorter timeout.
// 		console.log(results)
// 	});

// getBreakpoint()

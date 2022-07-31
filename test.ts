async function test() {
	const arr = [1,2,3]
	arr.forEach(a => {
		if ( a === 2) {
			throw "不能是1"
		}
		console.log(a)
	})
	console.log('???')
}

async function handle() {
	try {
		await test()
	} catch ( err ) {
		console.log("报错：", err)
	}
}

handle()
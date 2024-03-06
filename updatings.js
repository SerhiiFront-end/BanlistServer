const puppeteer = require('puppeteer')

// function decodeUnicodeEscapes(text) {
// 	return text.replace(/\\u([\d\w]{4})|\\/gi, function (match, grp) {
// 		if (match === '\\') {
// 			return ''
// 		} else {
// 			return String.fromCharCode(parseInt(grp, 16))
// 		}
// 	})
// }
const fullBans = {
	rpg: [],
	'1rp': [],
	'2rp': [],
}
async function banlistLoad(server) {
	const browser = await puppeteer.launch({ headless: 'new' })
	const page = await browser.newPage() //
	await page.goto(
		`https://gta-trinity.com/forum/api/monitoring/?csrfKey=ed2e21b61c22a21e55e89e427ba4eafc&draw=21&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=desc&start=0&length=6300&search%5Bvalue%5D=&search%5Bregex%5D=false&server=1&monitoring=${server}ban&_=1683791465568`
	)

	setTimeout(async () => {
		const content = await page.content()
		// const decodedText = decodeUnicodeEscapes(content)
		const decodedText = content.replace(
			/\\u([\d\w]{4})|\\/gi,
			function (match, grp) {
				if (match === '\\') {
					return ''
				} else {
					return String.fromCharCode(parseInt(grp, 16))
				}
			}
		)
		const matches = decodedText.match(/\[(\d{2}:\d{2}:\d{4})\].*?\..*?/g)
		const result = matches.map(match => match.slice(0, -1) + '.')
		await browser.close()
		fullBans[server] = result
	}, 6000)
}
module.exports = { fullBans, banlistLoad }

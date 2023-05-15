const express = require('express')
const puppeteer = require('puppeteer')
const fs = require('fs')
const cron = require('node-cron')

const port = process.env.PORT || 3000
const app = express()
app.use(express.json())

function decodeUnicodeEscapes(text) {
	return text.replace(/\\u([\d\w]{4})|\\/gi, function (match, grp) {
		if (match === '\\') {
			return ''
		} else {
			return String.fromCharCode(parseInt(grp, 16))
		}
	})
}
async function banlistLoad() {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto(
		'https://gta-trinity.com/forum/api/monitoring/?csrfKey=ed2e21b61c22a21e55e89e427ba4eafc&draw=21&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=desc&start=0&length=6300&search%5Bvalue%5D=&search%5Bregex%5D=false&server=1&monitoring=1rpban&_=1683791465568'
	)

	setTimeout(async () => {
		const content = await page.content()
		const decodedText = decodeUnicodeEscapes(content)
		const matches = decodedText.match(/\[(\d{2}:\d{2}:\d{4})\].*?\./g)
		const result = matches.map(match => match.slice(0, -1))
		console.log(result)
		await browser.close()
		fs.writeFile('banlist.json', JSON.stringify(result), err => {
			if (err) {
				console.error('Ошибка при записи файла:', err)
			} else {
				console.log('Запись в файл успешно выполнена.')
			}
		})
		return `<html><body>${JSON.stringify(result)}</body></html>`
	}, 6000)
}
app.get('/', async (req, res) => {
	const results = banlistLoad()
	res.send(results)
	// ;(async function banlistLoad() {
	// 	const browser = await puppeteer.launch()
	// 	const page = await browser.newPage()
	// 	await page.goto(
	// 		'https://gta-trinity.com/forum/api/monitoring/?csrfKey=ed2e21b61c22a21e55e89e427ba4eafc&draw=21&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=desc&start=0&length=6300&search%5Bvalue%5D=&search%5Bregex%5D=false&server=1&monitoring=1rpban&_=1683791465568'
	// 	)

	// 	setTimeout(async () => {
	// 		const content = await page.content()
	// 		const decodedText = decodeUnicodeEscapes(content)
	// 		const matches = decodedText.match(/\[(\d{2}:\d{2}:\d{4})\].*?\./g)
	// 		const result = matches.map(match => match.slice(0, -1))
	// 		console.log(result)
	// 		await browser.close()
	// 		fs.writeFile('banlist.json', JSON.stringify(result), err => {
	// 			if (err) {
	// 				console.error('Ошибка при записи файла:', err)
	// 			} else {
	// 				console.log('Запись в файл успешно выполнена.')
	// 			}
	// 		})
	// 		res.send(`<html><body>${JSON.stringify(result)}</body></html>`)
	// 	}, 6000)
	// })()
})
cron.schedule(
	'*/10 * * * * *',
	() => {
		banlistLoad()
	},
	{
		scheduled: true, // Включаем расписание
		timezone: 'Europe/Moscow', // Указываем часовой пояс, если необходимо
	}
)
// cron.schedule('0 */5 * * * *', () => {
// 	banlistLoad()
// })
app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

const express = require('express')
const puppeteer = require('puppeteer')
const mongoose = require('mongoose')
const cron = require('node-cron')
const Schema = require('./models/Schema')

mongoose
	.connect('mongodb+srv://aorl9048:1@banlists.1pjdhbt.mongodb.net/database', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Успешное подключение к базе данных!')
	})
	.catch(error => {
		console.error('Ошибка подключения к базе данных:', error)
	})

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
async function banlistLoad(server) {
	const browser = await puppeteer.launch({ headless: 'new' })
	const page = await browser.newPage() //
	await page.goto(
		`https://gta-trinity.com/forum/api/monitoring/?csrfKey=ed2e21b61c22a21e55e89e427ba4eafc&draw=21&columns%5B0%5D%5Bdata%5D=0&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=1&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=false&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=0&order%5B0%5D%5Bdir%5D=desc&start=0&length=6300&search%5Bvalue%5D=&search%5Bregex%5D=false&server=1&monitoring=${server}ban&_=1683791465568`
	)

	setTimeout(async () => {
		const content = await page.content()
		const decodedText = decodeUnicodeEscapes(content)
		const matches = decodedText.match(/\[(\d{2}:\d{2}:\d{4})\].*?\..*?/g)
		const result = matches.map(match => match.slice(0, -1) + '.')
		await browser.close()

		const checkData = await Schema.findOne({ server: server })
		if (checkData) {
			Schema.findOneAndUpdate({ server: server }, { results: result })
			return 0
		}

		const newData = new Schema({
			results: result,
			server: server,
		})
		newData.save()
	}, 6000)
}
app.get('/', async (req, res) => {
	res.send('go to the /banlist/web/ YOUR SERVER')
})
app.get('/banlist/web/:server', async (req, res) => {
	const banlist = await Schema.findOne({ server: req.params.server })
	if (banlist) {
		return res.send(banlist.results)
	}
	return res.send('DataBase id not found.')
})
cron.schedule(
	'0 */5 * * * *',
	() => {
		banlistLoad('rpg')
		banlistLoad('1rp')
		banlistLoad('2rp')
	},
	{
		scheduled: true,
		timezone: 'Europe/Moscow',
	}
)
app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

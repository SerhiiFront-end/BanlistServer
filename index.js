const express = require('express')
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
app.get('/', async (req, res) => {
	await fs.writeFile(`./public/banlist.json`, { hello: 'Lox' }, err => {
		if (err) {
			console.error('Error: ', err)
		} else {
			console.log(`File was saved succesfully: ${server}.`)
		}
	})
	res.send('go to /banlist/web/ ( 1rp / 2rp / rpg )' + test)
})
app.get('/banlist/web/:server', async (req, res) => {
	const banlist = require(`./public/banlists/${req.params.server}banlist.json`)
	console.log(test)
	res.json(banlist)
})
app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

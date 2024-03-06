const express = require('express')
const port = process.env.PORT || 3000
const app = express()
const test = require('./updatings')
app.use(express.json())

app.get('/', async (req, res) => {
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

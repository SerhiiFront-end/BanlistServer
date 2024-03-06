const express = require('express')
const port = process.env.PORT || 3000
const app = express()
const banlists = require('./updatings')
app.use(express.json())

app.get('/', async (req, res) => {
	res.send('go to /banlist/web/ ( 1rp / 2rp / rpg )')
})
app.get('/banlist/web/:server', async (req, res) => {
	res.json(banlists[req.params.server])
})
app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

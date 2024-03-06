const express = require('express')
const port = process.env.PORT || 3000
const { fullBans } = require('./updatings')
const app = express()
app.use(express.json())

app.get('/', async (req, res) => {
	res.send('go to /banlist/web/ ( 1rp / 2rp / rpg )')
})
app.get('/banlist/web/:server', async (req, res) => {
	// if (fullBans[req.params.server]){
	// 	answer
	// }
	res.json(fullBans[req.params.server])
})
app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

const { banlistLoad } = require('./updatings')

const rpg = banlistLoad('rpg')
const firstRP = banlistLoad('1rp')
const secondRP = banlistLoad('2rp')
const banlists = { rpg, firstRP, secondRP }
module.exports = { banlists }

let mongoose = require('mongoose')
let conifg = require('../config')

if(conifg.DEV_MODE) {
    mongoose.connect(conifg.MONGO_URL_DEV)
} else {
    mongoose.connect(conifg.MONGO_URL)
}


let PostTopListSchema = new mongoose.Schema({
    body: Object
})

module.exports = mongoose.model('PostTopList', PostTopListSchema)
let mongoose = require('mongoose')
let conifg = require('../config')

if(conifg.DEV_MODE) {
  mongoose.connect(conifg.MONGO_URL_DEV)
} else {
  mongoose.connect(conifg.MONGO_URL)
}

let PostSchema = new mongoose.Schema({
  title: String,
  ups: { type: Number, default: 0 },
  // downvote: { type: Number, default: 0 },
  timestamp : { type: Number, required: true, default: Math.round(new Date().getTime() / 1000 )},
  score: { type: Number, index: true , default: 0  },
  last_score_update : {type: Date , index: true, default: new Date() }
})


module.exports = mongoose.model('Post', PostSchema)


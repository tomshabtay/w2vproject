let PostModel = require('./models/post.model')
let config = require('./config')

module.exports.calcPostScore = (points, date, postId,forceUpdate) => {
    const GRAVITY = config.ALG_GRAVITY // The higher the value the lower older post will be ranked
    const UPDATE_EVERY_X_UPVOTES = config.ALG_UPDATE_EVERY_X_VOTES

    if(!forceUpdate && (points % UPDATE_EVERY_X_UPVOTES) != 0){
        console.log("Post don't need update")
        return
    }

    var diff = (date.getTime() - (new Date).getTime()) / 1000;
    diff /= (60 * 60);
    diff = Math.abs(Math.round(diff));

    // calc score
    let score = (points - 1) / Math.pow((diff + 2), GRAVITY)
    score = Math.round((score * 100))
    // return score
    PostModel.findOneAndUpdate({ _id: postId }, { $set: { score: score, last_score_update: new Date()} }, { new: true }, (err, doc) => {
        // console.log("Score updated: " + postId + " score = " + score)
    });
}


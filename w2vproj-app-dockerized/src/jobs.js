let PostModel = require('./models/post.model')
let PostTopListModel = require('./models/post-top-list.model')
let alg = require('./calc-score-alg')

module.exports.updateScoresJob = () => {
    setInterval(() => {
        console.log("Updating Scores")
        PostModel.find({}, ['title', 'score', 'timestamp', 'ups', 'last_score_update'], { limit: 40, sort: { last_score_update: 1 } }, function (err, posts) {

            posts.forEach(function (post) {
                // console.log(post.last_score_update)
                let date = new Date(post.timestamp * 1000)
                alg.calcPostScore(post.ups, date, post._id, true) //force update set to true!
            });
        });

    }, 10 * 1000)
}

module.exports.updateTopListJob = () => {
    setInterval(() => {
        PostModel.find({}, ['title', 'score', 'timestamp', 'ups'], { limit: 100, sort: { score: -1 } }, function (err, posts) {
            if (err) {
                return
            }
            var postArr = [];
            posts.forEach(function (post) {
                postArr.push(post)
            });

            PostTopListModel.findOneAndUpdate({}, { $set: { body: postArr } }, { new: true }, (err, doc) => {
                console.log("Top list updated.")
            })

        });
    }, 10 * 1000)
}

module.exports.initTopListJob = () => {
    PostTopListModel.remove({}, function (err, posts) {
        if(err) {
            console.log(err)
            return 
        }

        let model = new PostTopListModel({ body: "" })
        model.save()
            .then(doc => {
                if (!doc || doc.length === 0) {
                    return res.status(500).send(doc)
                }

                res.status(201).send(doc)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    })
}

module.exports.addStubPosts = () => {
    var arr = postStub.posts

    PostModel.insertMany(arr)
        .then((result) => {
            console.log("result ", result);

        })
        .catch(err => {
            console.error("error ", err);

        });
}

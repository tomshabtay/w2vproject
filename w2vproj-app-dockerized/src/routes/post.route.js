let PostModel = require('../models/post.model')
let PostTopListModel = require('../models/post-top-list.model')
let express = require('express')
let router = express.Router()
let alg = require('../calc-score-alg')
let postStub = require("../stub/post.stub")

// Serve the top list
// GET localhost:4000/post/toplist
router.get('/post/toplist', (req, res) => {
  PostTopListModel.find({}, ['body'], { limit: 1 }, function (err, posts) {
    console.log(posts.body)

    if (err) {
      res.status(500).json(err)
    }
    res.status(200).send(posts)

  })
})

// Downvote a post
// GET localhost:4000/post/downvote/:id
router.get('/post/downvote/:id', (req, res) => {
  let postId = req.params.id
  PostModel.findOneAndUpdate({ _id: postId }, { $inc: { ups: -1 } }, { new: true }, (err, doc) => {
    if (err) {
      res.status(500).json(err)
    }
    if (doc) {
      setTimeout(() => {
        let points = doc.ups
        let date = new Date(doc.timestamp * 1000)
        let score = alg.calcPostScore(points, date, doc._id, false) //force update set to false
      }, 1000)
    }
    res.status(200).send(doc)
  });

})

// Upvote a post
// GET localhost:4000/post/upvote/:id
router.get('/post/upvote/:id', (req, res) => {
  let postId = req.params.id
  PostModel.findOneAndUpdate({ _id: postId }, { $inc: { ups: 1 } }, { new: true }, (err, doc) => {
    if (err) {
      res.status(500).json(err)
    }
    if (doc) {
      setTimeout(() => {
        let points = doc.ups
        let date = new Date(doc.timestamp * 1000)
        let score = alg.calcPostScore(points, date, doc._id, false) //force update set to false
      }, 1000)
    }

    res.status(200).send(doc)
  });

})

// Create a new post
// POST localhost:4000/post
router.post('/post', (req, res) => {
  let model = new PostModel(req.body)
  model.save()
    .then(doc => {
      console.log(doc)
      if (!doc || doc.length === 0) {
        return res.status(500).send(doc)
      }

      res.status(201).send(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// Update a post
// PUT localhost:4000/post
router.put('/post', (req, res) => {
  if (!req.query.id) {
    return res.status(400).send('Missing URL parameter: id')
  }
  
  PostModel.findOneAndUpdate({
    _id: req.query.id
  }, req.body, {
      new: true
    })
    .then(doc => {
      res.json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// Delete a post
// DELETE localhost:4000/post
router.delete('/post', (req, res) => {
  if (!req.query.id) {
    return res.status(400).send('Missing URL parameter: id')
  }

  PostModel.findOneAndRemove({
    _id: req.query.id
  })
    .then(doc => {
      res.json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// Getting the top list realtime (for development only)
// GET localhost:4000/dev/post/toplist
router.get('/dev/post/toplist', (req, res) => {
  PostModel.find({}, ['title', 'score', 'timestamp', 'ups'], { limit: 100, sort: { score: -1 } }, function (err, posts) {
    if (err) {
      res.status(500).json(err)
    }

    var postArr = [];
    posts.forEach(function (post) {
      postArr.push(post);
    });
    res.status(200).send(postArr)
  });

})
// removing all posts
// GET localhost:4000/dev/post/removeall
router.get('/dev/post/removeall', (req, res) => {
  PostModel.remove({}, function (err, posts){
    res.status(200).send("ok")
  })
})


// adding random generated posts
// GET localhost:4000/dev/post/addposts
router.get('/dev/post/addposts', (req, res) => {
  var posts = []
  for (let i = 0; i < 25; i++) {
    var post = new Object();
    post.title = "test"
    post.ups = Math.floor(Math.random() * (1000 - 50) + 50)
    post.timestamp = parseInt(
      new Date(2018,Math.floor(Math.random() * (10 - 1) + 1),1).getTime() / 1000)
    post.score = Math.floor(Math.random() * (1000 - 50) + 50)
    posts.push(post)
    console.log(post)

  }

  PostModel.insertMany(posts)
    .then((result) => {
      console.log("result ", result);
      res.status(200).send({msg:"ok"}) 
    })
    .catch(err => {
      console.error("error ", err);
      res.status(200).send("failed")

    });

})

// adding random posts with real data
// GET localhost:4000/dev/post/addredditposts
router.get('/dev/post/addredditposts', (req, res) => {

  PostModel.insertMany(postStub.posts)
    .then((result) => {
      console.log("result ", result);
      res.status(200).send("ok") 
    })
    .catch(err => {
      console.error("error ", err);
      res.status(200).send("failed")

    });

})



// router.post('/post/init', (req, res) => {
//   if (!req.body) {
//     return res.status(400).send('Request body is missing')
//   }

//   let model = new PostTopListModel({ body: "adsf" })
//   model.save()
//     .then(doc => {
//       if (!doc || doc.length === 0) {
//         return res.status(500).send(doc)
//       }

//       res.status(201).send(doc)
//     })
//     .catch(err => {
//       res.status(500).json(err)
//     })
// })

module.exports = router
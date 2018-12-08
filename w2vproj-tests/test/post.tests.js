
const chai = require('chai');
const request = require("supertest-as-promised");
const { assert, expect } = chai;
chai.should();

const baseRequest = request('localhost:4000');
function getTopListDev() {
    return baseRequest
        .get('/dev/post/toplist')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function (result, err) {
            if (err) {
                assert.throws("Error thrown");
            }

        });
}

function getTopList() {
    return baseRequest
        .get('/post/toplist')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function (result, err) {
            if (err) {
                assert.throws("Error thrown");
            }

        });
}

function createPost() {
    return baseRequest
        .post('/post')
        .send({ title: "integration-test" })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .then(function (result, err) {
            if (err) {
                assert.throws("Error thrown");
            }
            return result.body._id
        });
}

function upvotePost(postId) {
    return baseRequest
        .get('/post/upvote/' + postId)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function (result, err) {
            if (err) {
                assert.throws("Error thrown");
            }
            return result.body.score
        });
}

function updatePost(postId) {
    return baseRequest
        .put('/post')
        .query({ id: postId })
        .send({ title: "hi" })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function (result, err) {
            
            if (err) {
                assert.throws("Error thrown");
            }
            
        });
}

function downvotePost(postId) {
    return baseRequest
        .get('/post/downvote/' + postId)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function (result, err) {
            if (err) {
                assert.throws("Error thrown");
            }
            return result.body.score
        });
}

function addBuckPostsDev() {
    return baseRequest
        .get('/dev/post/addposts')
        .set('Accept', 'application/json')
        .expect(200)
        .then(function (result, err) {
            if (err) {
                assert.throws("Error thrown");
            }
        });
}

function removeAllPostsDev() {
    return baseRequest
        .get('/dev/post/removeall')
        .set('Accept', 'application/json')
        .expect(200)
        .then(function (result, err) {
            if (err) {
                assert.throws("Error thrown");
            }
        });
}


describe("Post Tests", function () {
    this.timeout(10000);
    this.slow(1000);
    const state = {};
    state.passed = true;

    afterEach(function () {
        state.passed = state.passed &&
            (this.currentTest.state === "passed");
    });

    beforeEach(function () {
        if (!state.passed) {
            return this.currentTest.skip();
        }
    });

    it('remove all posts', function () {
        return removeAllPostsDev()
    });

    it('create new post', function () {
        return createPost().then((id) => {
            state.postId = id
            console.log("post created: " + state.postId)
        })
    });

    it('upvotes post', function () {
        for (let i = 0; i < 100; i++) {
            endScore = upvotePost(state.postId)
        }
    });

    it('downvotes post', function () {
        for (let i = 0; i < 100; i++) {
            endScore = downvotePost(state.postId)
        }
    });

    it('update post', function () {
        return updatePost(state.postId)
    });

    it('bulk posts adding', function () {
        return addBuckPostsDev()
    });

    it('get top list dev (realtime list)', function () {
        return getTopListDev()
    });


    it('get top list prod (cached list)', function () {
        return getTopList()
    });



    it('remove all posts', function () {
        return removeAllPostsDev()
    });


});
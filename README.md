
## w2vproj
API for posts based apps (like hackernews) using Node.js, Express.js, Mongodb.

### Run the app
```
cd w2vproj-app-dockerized
docker-compose up --build
```

### Run the test
```
cd w2vproj-tests
npm test
```

### Endpoints
| Type | Url | Description |
| ------ | ------ | ------ |
|GET|localhost:4000/post/toplist | Serve the top list|
|GET|localhost:4000/post/downvote/:id | Downvote a post|
|GET|localhost:4000/post/upvote/:id | Upvote a post|
|POST| localhost:4000/post | Create a new post|
|PUT| localhost:4000/post | Update a post|
|DELETE| localhost:4000/post | Delete a post|

#### Endpoints for development\tests
| Type | Url | Description |
| ------ | ------ | ------ |
|GET| localhost:4000/dev/post/toplist | Getting the top list realtime (for development only)|
|GET| localhost:4000/dev/post/addredditposts | adding some posts with real data|
|GET| localhost:4000/dev/post/addposts | adding random generated posts|
|GET| localhost:4000/dev/post/removeall | removing all posts|

### Postman Configuration
If you wish to explore the API with Postman
```
w2vproj-postman
```

### Calculate Post Score Algorithm
This algorithem will calculate a score based on upvotes number and creation date.
Newer post with larger upvotes number will result a greater score.
you can change the GRAVITY value for fine tuning the the way old post are ranked compared to newer post in the config file.
```
w2vproj-app-dockerized/src/config.js
```
this function is called by a scheduled job and by the upvote/downvote endpoint (after x number of upvotes/downvotes)

### Jobs

#### updateScoresJob
feching list of posts ordered by last score update date then updating posts scores.

#### updateTopListJob
feching list of top posts and saving to a diffrent table for better preformance with toplist endpoint.

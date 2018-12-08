
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
npm install
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
w2vproj-postman\wv.postman_collection.json
```

### Calculate Post Score Algorithm
This algorithem will calculate a score based on upvotes number and creation date.
New posts with many upvotes will result a higher score.
to fine tune how old post ranked compared to new posts change the 'gravity' value in the config file.
```
w2vproj-app-dockerized/src/config.js
```
the algorithm used by a scheduled job and by the upvote/downvote endpoint.

### Jobs

#### updateScoresJob
Getting from db a list of posts ordered by 'last_score_update_date' index. then updating posts scores using the algorithm.

#### updateTopListJob
Getting from db a list of top posts and saving them to a diffrent table. done to protect the database preformance when toplist endpoint traffic is high.

var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');
var apiController = require('./controllers/api.js');
var path = require('path');
// var superPrivateApi = function(accessKey, secretKey, bucket){
//     console.log("Don't put those values on the server");
// };

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bambinio2');

var app = express();
// app.set('view engine', 'jade');
app.set('view engine', 'html');
// app.set('views', __dirname + '/views');
// app.use(express.static(__dirname + '../client/public'));
app.use(express.static(path.join(__dirname, '../client', 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', indexController.index);

app.post('/api/posts', apiController.addPost);

app.get('/api/posts', apiController.getPosts);

app.put('/api/post/:id', apiController.putPost);

app.post('/api/uploads', apiController.uploadPost);

var server = app.listen(2002, function() {
    console.log('Express server listening on port ' + server.address().port);
});

// var keys;
//     if(process.env.API_KEY){
//         keys = {
//             accessKeyId: process.env.API_ACCESS_KEY_ID,
//             secretAccessKey: process.env.API_SECRET_ACCESS_KEY,
//             Bucket: process.env.API_BUCKET
//         };
//     } 
//     else {
//         keys = require('./private.js');
//     }

// superPrivateApi(keys.accessKeyId, keys.secretAccessKey, keys.Bucket);
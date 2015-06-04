var Post = require('../models/post.js');
var aws = require('aws-sdk');
var fs = require('fs');

var keys;
if(process.env.API_ACCESS_KEY_ID){
    keys = {
        accessKeyId: process.env.API_ACCESS_KEY_ID,
        secretAccessKey: process.env.API_SECRET_ACCESS_KEY,
        Bucket: process.env.API_BUCKET
    };
} 
else {
    keys = require('../../private.js');
}

var KEY = keys.accessKeyId;
var SECRET = keys.secretAccessKey;
var BUCKET = keys.Bucket;


aws.config.update({
  accessKeyId: KEY,
  secretAccessKey: SECRET
});
var s3 = new aws.S3();

var apiController = {
  addPost: function(req, res){
    console.log(req.body);
    if(!req.body.postedAt){
      req.body.postedAt = Date.now();
    }
    var newPost = new Post({postText: req.body.postText, s3Link: req.body.s3Link, postedAt: req.body.postedAt, milestone: req.body.milestone, postType: req.body.postType});
    console.log(newPost);

    newPost.save(function(err, results){
      console.log(results);
      res.send(results);
    });
  },

  getPosts: function(req, res){
    Post.find(function (err, results) {
      if (err) return console.error(err);
      res.send(results);
    });
  },

  putPost: function(req, res){
    console.log(req.body.comment);
    if(req.body.comment){
      Post.findByIdAndUpdate(req.params.id, { $push: { comments: {content: req.body.comment} }}, function(err, results){
        if(err){console.log(err);}
        res.send(results);
      });
    }
    else{
      Post.findByIdAndUpdate(req.params.id, { $inc: { score: 1 }}, function(err, results){
        if(err){console.log(err);}
        res.send(results);
      });
    }
  },

  uploadPost: function(req, res){
    var fName = req.files.file.name;
    var fPath = req.files.file.path;
    var cType = req.files.file.type;
    var size = req.files.file.size;
    console.log(req.body.postedAt);

    fs.readFile(fPath, function (err, data) {
      console.log(err);
      s3.putObject({
        Bucket: BUCKET,
        Key: fName,
        ContentType: cType,
        ACL: 'public-read',
        Body: data
      }, function (err, result) {
        // console.log(err, result);
        if(!req.body.postedAt){
          req.body.postedAt = Date.now();
        }
        var newPost = new Post({postText: req.body.postText, s3Link: fName, postedAt: req.body.postedAt, milestone: req.body.milestone, postType: "glyphicon glyphicon-picture"});
        console.log(newPost);
        fs.unlink(fPath);

        newPost.save(function(err, results){
          // console.log(results);
          res.send(results);
        });

      });
    });
    // console.log(req.body);
    // console.log(req.files);
    }
  // putComment: function(req, res){
  //   console.log('test');
  //   console.log(req.body.comment);
  //   // console.log(req.params.id);
  //   // console.log(req.body.comment);
  //   // try putting just req.body in where it says _id: req.body
  //   // Post.findByIdAndUpdate({_id: req.body}, {$set:{score: 3}}, function(err, result){
  //   Post.findByIdAndUpdate(req.params.id, { $push: { 'comments.content': req.body }}, function(err, results){
  //     if(err){console.log(err);}
  //     res.send(results);
  //   });
  // }

};

module.exports = apiController;
var Post = require('../models/post.js');

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
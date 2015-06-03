var mongoose = require('mongoose');

// Create a blueprint for the monsters
var postSchema = mongoose.Schema({
  postText: String,
  milestone: String,
  user: String,
  child: {
    type: String,
    default: 'Max'
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  // postedAt: Date,
  postType: {
    type: String,
    default: 'text'
  },
  score: {
    type: Number,
    default: 0
  },
  s3Link: String,
  webcamImage: String,
  comments: [{
    author: {
      type: String,
      default: 'User'
    },
    content: String,
    postedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

// Export the created model connection to our schema
module.exports = mongoose.model('post', postSchema);
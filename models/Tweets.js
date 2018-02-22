const mongoose = require("mongoose");
const { Schema } = mongoose;

const tweetSchema = new Schema({
  text: String,
  hashtags: [String],
  created_at: Date,
  id_str: String,
  // urls: [String],
  user_mentioned_screen_name: [String],
  user_mentioned_name: [String],
  text_lang: String,
  retweet_count: Number,
  favorite_count: Number,
  user_name: String,
  user_screen_name: String,
  user_followers_count: Number
});

mongoose.model("tweets", tweetSchema);

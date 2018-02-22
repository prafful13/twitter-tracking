const _ = require("lodash");
const Path = require("path-parser");
const { URL } = require("url");
const mongoose = require("mongoose");

const Tweet = mongoose.model("tweets");

module.exports = (app, Twitter) => {
  app.get("/api/hightrafficevents/:placeid", (req, res) => {
    const p = new Path("/api/hightrafficevents/:placeid");
    const match = p.test(req.path);

    Twitter.get(
      "trends/place",
      { id: match.placeid },
      (err, data, response) => {
        // console.log(JSON.stringify(data));
        res.send(data);
      }
    );
  });

  app.get("/api/search/:searchtext", (req, res) => {
    const p = new Path("/api/search/:searchtext");
    const match = p.test(req.path);
    if (match) {
      Twitter.get(
        "search/tweets",
        { q: match.searchtext, count: 100 },
        (err, data, response) => {
          _.forEach(data.statuses, async function(value) {
            var hashtags_intweet = [];
            _.forEach(value.entities.hashtags, hashtags => {
              hashtags_intweet.push(hashtags.text);
            });

            var user_mentioned_names = [];
            var user_mentioned_screen_names = [];
            _.forEach(value.entities.user_mentions, function(users) {
              user_mentioned_names.push(users.name);
              user_mentioned_screen_names.push(users.screen_name);
            });

            var fav_count = 0;
            if (value.retweeted_status)
              fav_count = value.retweeted_status.favorite_count;
            else fav_count = value.favorite_count;
            const newtweet = new Tweet({
              id_str: value.id_str,
              text: value.text,
              hashtags: hashtags_intweet,
              created_at: value.created_at,
              // urls: [String],
              user_mentioned_screen_name: user_mentioned_screen_names,
              user_mentioned_name: user_mentioned_names,
              text_lang: value.lang,
              retweet_count: value.retweet_count,
              favorite_count: fav_count,
              user_name: value.user.name,
              user_screen_name: value.user.screen_name,
              user_followers_count: value.user.followers_count
            });
            const existingTweet = await Tweet.findOne({ id_str: value.id_str });

            if (existingTweet) {
            } else {
              newtweet.save();
            }
          });
          res.send(data);
        }
      );
    }
  });
};

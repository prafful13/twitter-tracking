const express = require("express");
const mongoose = require("mongoose");
const twit = require("twit");
const keys = require("./config/keys");
const bodyParser = require("body-parser");

require("./models/Tweets");

//  Mongoose Connection
mongoose.connect(keys.mongoURI);

mongoose.connection.on("connected", function() {
  console.log("Mongoose connected");
});

mongoose.connection.on("open", function(err) {
  console.log("Mongoose open");
});

// If the connection throws an error
mongoose.connection.on("error", function(err) {
  console.log("Mongoose default connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", function() {
  console.log("Mongoose default connection disconnected");
});

//  Twitter Connection
const Twitter = new twit({
  consumer_key: keys.consumer_key,
  consumer_secret: keys.consumer_secret,
  access_token: keys.access_token,
  access_token_secret: keys.access_token_secret
});
const app = express();

app.use(bodyParser.json());

require("./routes/api1Routes")(app, Twitter);
require("./routes/api2Routes")(app, Twitter);

const PORT = process.env.PORT || 5000;
app.listen(PORT);

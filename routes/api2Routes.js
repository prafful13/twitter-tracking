const _ = require("lodash");
const Path = require("path-parser");
const { URL } = require("url");
const mongoose = require("mongoose");
const json2csv = require("json2csv");
const fs = require("fs");

const Tweet = mongoose.model("tweets");

const fields = [];

module.exports = (app, Twitter) => {
  app.get("/api/download", function(req, res) {
    var file = "./file.csv";
    res.download(file); // Set disposition and send it.
  });

  app.get("/api/filter/:field", (req, res) => {
    let flag = false;
    if (req.query.hasOwnProperty("export")) {
      let it = 0;
      _.forEach(req.query.export, value => {
        fields[it] = req.query.export[it];
        it++;
      });
      flag = true;
    }

    const p = new Path("/api/filter/:field");
    const match = p.test(req.path);

    var intField = [
      "retweet_count",
      "user_followers_count",
      "favorite_count",
      "created_at"
    ];
    var mapOperator = {
      gt: "$gt",
      gte: "$gte",
      lt: "$lt",
      lte: "$lte",
      eq: "$eq"
    };

    //  Integer Columns
    _.forEach(intField, async value => {
      if (value == match.field) {
        if (
          req.query.hasOwnProperty("operator") &&
          req.query.hasOwnProperty("value")
        ) {
          let query = {};
          query[match.field] = {};
          query[match.field][mapOperator[req.query.operator]] = req.query.value;

          if (
            req.query.hasOwnProperty("sortby") &&
            req.query.hasOwnProperty("order")
          ) {
            let sortquery = {};
            let itr = 0;
            if (req.query.sortby.length != req.query.order.length)
              return res.send("err");
            _.forEach(req.query.sortby, value => {
              sortquery[value] = req.query.order[itr];
              itr++;
            });
            await Tweet.find(query)
              .sort(sortquery)
              .exec((err, data) => {
                if (flag == true) {
                  let csv = json2csv.parse(data, { fields });
                  fs.writeFile("./file.csv", csv);
                }
                return res.json({
                  data: data
                });
              });
          } else {
            await Tweet.find(query)
              .sort("text")
              .exec((err, data) => {
                if (flag == true) {
                  const csv = json2csv(data, { fields });
                  fs.writeFile("./file.csv", csv);
                }
                return res.json({
                  data: data
                });
              });
          }
        } else {
          return res.send("err");
        }
      }
    });

    //  Text Columns
    var textField = [
      "user_name",
      "user_screen_name",
      "text_lang",
      "text",
      "hashtags",
      "user_mentioned_name",
      "user_mentioned_screen_name"
    ];
    _.forEach(textField, async value => {
      if (value == match.field) {
        if (
          req.query.hasOwnProperty("operator") &&
          req.query.hasOwnProperty("value")
        ) {
          if (
            req.query.hasOwnProperty("sortby") &&
            req.query.hasOwnProperty("order")
          ) {
            let sortquery = {};
            let itr = 0;
            if (req.query.sortby.length != req.query.order.length)
              return res.send("err");
            _.forEach(req.query.sortby, value => {
              sortquery[value] = req.query.order[itr];
              itr++;
            });

            if (req.query.operator == "startswith") {
              let query = {};
              query[match.field] = new RegExp("^" + req.query.value);

              await Tweet.find(query)
                .sort(sortquery)
                .exec((err, data) => {
                  if (flag == true) {
                    const csv = json2csv(data, { fields });
                    fs.writeFile("./file.csv", csv);
                  }
                  return res.json({
                    data: data
                  });
                });
            } else if (req.query.operator == "endswith") {
              let query = {};
              query[match.field] = new RegExp(req.query.value + "$");
              await Tweet.find(query)
                .sort(sortquery)
                .exec((err, data) => {
                  if (flag == true) {
                    const csv = json2csv(data, { fields });
                    fs.writeFile("./file.csv", csv);
                  }
                  return res.json({
                    data: data
                  });
                });
            } else if (req.query.operator == "contains") {
              let query = {};
              query[match.field] = new RegExp(req.query.value);
              await Tweet.find(query)
                .sort(sortquery)
                .exec((err, data) => {
                  if (flag == true) {
                    const csv = json2csv(data, { fields });
                    fs.writeFile("./file.csv", csv);
                  }
                  return res.json({
                    data: data
                  });
                });
            } else if (req.query.operator == "is") {
              let query = {};
              query[match.field] = req.query.value;
              await Tweet.find(query)
                .sort(sortquery)
                .exec((err, data) => {
                  if (flag == true) {
                    const csv = json2csv(data, { fields });
                    fs.writeFile("./file.csv", csv);
                  }
                  return res.json({
                    data: data
                  });
                });
            }
          } else {
            if (req.query.operator == "startswith") {
              let query = {};
              query[match.field] = new RegExp("^" + req.query.value);

              await Tweet.find(query).exec((err, data) => {
                if (flag == true) {
                  const csv = json2csv(data, { fields });
                  fs.writeFile("./file.csv", csv);
                }
                return res.json({
                  data: data
                });
              });
            } else if (req.query.operator == "endswith") {
              let query = {};
              query[match.field] = new RegExp(req.query.value + "$");

              await Tweet.find(query).exec((err, data) => {
                if (flag == true) {
                  const csv = json2csv(data, { fields });
                  fs.writeFile("./file.csv", csv);
                }
                return res.json({
                  data: data
                });
              });
            } else if (req.query.operator == "contains") {
              let query = {};
              query[match.field] = new RegExp(req.query.value);

              await Tweet.find(query).exec((err, data) => {
                if (flag == true) {
                  const csv = json2csv(data, { fields });
                  fs.writeFile("./file.csv", csv);
                }
                return res.json({
                  data: data
                });
              });
            } else if (req.query.operator == "is") {
              let query = {};
              query[match.field] = req.query.value;

              await Tweet.find(query).exec((err, data) => {
                if (flag == true) {
                  const csv = json2csv(data, { fields });
                  fs.writeFile("./file.csv", csv);
                }
                return res.json({
                  data: data
                });
              });
            }
          }
        } else {
          return res.send("err");
        }
      }
    });
  });
};

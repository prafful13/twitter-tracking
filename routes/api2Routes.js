const _ = require("lodash");
const Path = require("path-parser");
const { URL } = require("url");
const mongoose = require("mongoose");
const json2csv = require("json2csv");
const fs = require("fs");

const Tweet = mongoose.model("tweets");

function handleFilterQuery(req, res) {
  let flag = false;
  let fields = [];
  if (req.query.hasOwnProperty("export")) {
    let it = 0;
    _.forEach(req.query.export, value => {
      fields[it] = req.query.export[it];
      it++;
    });
    flag = true;
  }

  let pgno = 0;
  let limit = 10000;
  if (req.query.hasOwnProperty("limit") && req.query.hasOwnProperty("pgno")) {
    limit = parseInt(req.query.limit);
    pgno = parseInt(req.query.pgno);
  }

  let sortquery = {};
  if (req.query.hasOwnProperty("sortby") && req.query.hasOwnProperty("order")) {
    let itr = 0;
    if (req.query.sortby.length != req.query.order.length) return 2;
    _.forEach(req.query.sortby, value => {
      sortquery[value] = req.query.order[itr];
      itr++;
    });
  }

  let param_operator, param_value;
  if (
    req.query.hasOwnProperty("operator") &&
    req.query.hasOwnProperty("value")
  ) {
    param_operator = req.query.operator;
    param_value = req.query.value;
  } else {
    return 2;
  }

  const p = new Path("/api/filter/:field");
  const match = p.test(req.path);

  var intField = [
    "retweet_count",
    "user_followers_count",
    "favorite_count",
    "created_at"
  ];
  var textField = [
    "user_name",
    "user_screen_name",
    "text_lang",
    "text",
    "hashtags",
    "user_mentioned_name",
    "user_mentioned_screen_name"
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
      let query = {};
      query[match.field] = {};
      query[match.field][mapOperator[param_operator]] = param_value;

      await Tweet.find(query)
        .sort(sortquery)
        .skip(pgno > 0 ? (pgno - 1) * limit : 0)
        .limit(limit)
        .exec((err, data) => {
          if (flag == true && data.length != 0) {
            let csv = json2csv.parse(data, { fields });
            fs.writeFile("./file.csv", csv);
          }

          res.json({
            data: data
          });
          return true;
        });
    }
  });

  //  Text Columns
  _.forEach(textField, async value => {
    if (value == match.field) {
      if (param_operator == "startswith") {
        let query = {};
        query[match.field] = new RegExp("^" + param_value);
        await Tweet.find(query)
          .sort(sortquery)
          .skip(pgno > 0 ? (pgno - 1) * limit : 0)
          .limit(limit)
          .exec((err, data) => {
            if (flag == true && data.length != 0) {
              let csv = json2csv.parse(data, { fields });
              fs.writeFile("./file.csv", csv);
            }

            res.json({
              data: data
            });
            return true;
          });
      } else if (param_operator == "endswith") {
        let query = {};
        query[match.field] = new RegExp(param_value + "$");
        await Tweet.find(query)
          .sort(sortquery)
          .skip(pgno > 0 ? (pgno - 1) * limit : 0)
          .limit(limit)
          .exec((err, data) => {
            if (flag == true && data.length != 0) {
              let csv = json2csv.parse(data, { fields });
              fs.writeFile("./file.csv", csv);
            }

            res.json({
              data: data
            });
            return true;
          });
      } else if (param_operator == "contains") {
        let query = {};
        query[match.field] = new RegExp(param_value);
        await Tweet.find(query)
          .sort(sortquery)
          .skip(pgno > 0 ? (pgno - 1) * limit : 0)
          .limit(limit)
          .exec((err, data) => {
            if (flag == true && data.length != 0) {
              let csv = json2csv.parse(data, { fields });
              fs.writeFile("./file.csv", csv);
            }

            res.json({
              data: data
            });
            return true;
          });
      } else if (param_operator == "is") {
        let query = {};
        query[match.field] = param_value;
        await Tweet.find(query)
          .sort(sortquery)
          .skip(pgno > 0 ? (pgno - 1) * limit : 0)
          .limit(limit)
          .exec((err, data) => {
            if (flag == true && data.length != 0) {
              let csv = json2csv.parse(data, { fields });
              fs.writeFile("./file.csv", csv);
            }

            res.json({
              data: data
            });
            return true;
          });
      }
    }
  });
  return 3;
}

module.exports = (app, Twitter) => {
  app.get("/api/download", (req, res) => {
    var file = "./file.csv";
    res.download(file);
  });

  app.get("/api/filter/:field", async (req, res) => {
    let mainflag = 0;
    mainflag = await handleFilterQuery(req, res);
    if (mainflag == 2) return res.send("err in query");
  });
};

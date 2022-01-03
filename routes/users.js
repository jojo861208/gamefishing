var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var { mysqlPoolQuery } = require('../connection/mysql.js')

router.get('/', function (req, res, next) {
  //get的狀況form裡面的值要從query撈
  game_id = req.query.game_id;
  group_id = req.query.group_id;
  mysqlPoolQuery('SELECT * FROM group_info WHERE game_id = ? AND group_id=?', [game_id, group_id], function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "資料庫讀取失敗:\n" });
    } else {
      console.log("讀取資料庫成功")
      json_data = JSON.parse(JSON.stringify(result));

      //回傳json
      // return res.status(200).json({success: true, message: result}); 

      //回傳值直接渲染ejs
      console.log(json_data);
      res.render('users', {
        users: json_data
      });
    }
  });
});

router.post('/all', function (req, res, next) {
  //post的狀況form裡面的值要從body撈
  game_id = req.body.game_id;
  mysqlPoolQuery('SELECT * FROM group_info WHERE game_id = ?', game_id, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "資料庫讀取失敗:\n" });
    } else {
      console.log("讀取資料庫成功")
      json_data = JSON.parse(JSON.stringify(result));
      console.log(json_data);
      res.render('users', {
        users: json_data
      });
    }
  });
});

module.exports = router;
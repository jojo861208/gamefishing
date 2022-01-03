var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var { mysqlPoolQuery } = require('../connection/mysql.js')

router.get('/', function (req, res, next) {
  //get的狀況form裡面的值要從body撈
  game_id = req.query.game_id;
  client_id = req.query.client_id;
  mysqlPoolQuery('SELECT * FROM group_info WHERE game_id = ? AND client_id=?', [game_id,client_id] , function (err, result) {
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

router.post('/all', function (req, res, next) {
  //post的狀況form裡面的值要從body撈
  game_id = req.body.game_id;
  mysqlPoolQuery('SELECT * FROM group_info WHERE game_id = ?', game_id , function (err, result) {
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



//remain fixing
// router.post('/query_groupinfo', function (req, res, next) {
//   var sql = group_info;
//   mysqlPoolQuery('SELECT client_id FROM ?', sql, function (err, result) {
//     if (err) {
//       console.log(err);
//       return res.status(500).json({ success: "False", message: "資料庫讀取失敗:\n" });
//     } else {
//       console.log("讀取資料庫成功")
//       console.log(result)
//     }
//   });
// })
module.exports = router;
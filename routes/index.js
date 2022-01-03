var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var { mysqlPoolQuery } = require('../connection/mysql.js')


function get_col_from_group_info(colname){
  sql = 'SELECT' + colname + 'FROM group_info';
  mysqlPoolQuery('SELECT client_id FROM group_info', function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: "False", message: "資料庫讀取失敗:\n" });
    } else {
      console.log("讀取資料庫成功")
      json_format = JSON.parse(JSON.stringify(result))
      console.log(json_format)
      //results = json_format[0][colname]
      //console.log(results)
      return json_format
      
    }
  });
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/get_alluser', function (req, res, next) {
  game_id = req.body.game_id;
  console.log(game_id)
  mysqlPoolQuery('SELECT * FROM group_info WHERE game_id = ?', game_id , function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "資料庫讀取失敗:\n" });
    } else {
      console.log("讀取資料庫成功")
      console.log(result)
      res.render('result', {
        game_id: 'Final Fantasy VII'
      });
      //return res.status(200).json({ success: true, data: JSON.parse(JSON.stringify(result))});
      //results = json_format[0][colname]
      //console.log(results)
      //return json_format
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

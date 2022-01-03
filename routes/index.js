var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var { mysqlPoolQuery } = require('../connection/mysql.js')

var client = "peter";

mysqlPoolQuery('SELECT * FROM group_info WHERE client_id = ?', [client], function (err, result) {
  if (err) {
    console.log(err);
    return res.status(500).json({ success: "False", message: "資料庫讀取失敗:\n" });
  } else {
    console.log("讀取資料庫成功")
    console.log(result)
  }
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });

});

router.get('/query1', function (req, res, next) {
  console.log("屁眼")
})

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

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var { mysqlPoolQuery } = require('../connection/mysql.js')

// mysqlPoolQuery('SELECT * FROM group_info WHERE client_id = ?', [client], function (err, result) {
//   if (err) {
//     console.log(err);
//     return res.status(500).json({ success: "False", message: "資料庫讀取失敗:\n" });
//   } else {
//     console.log("讀取資料庫成功")
//     console.log(result)
//     return res.status(200).json({ success: "success", message: result });

//   }
// });

/* GET users listing. */

//查詢group_info此table可用此api
router.post('/query_group_info', function (req, res, next) {
  var client_id = req.body.client_id;
  console.log('This is group_info query API');

  mysqlPoolQuery('SELECT * FROM group_info WHERE client_id = ?', [client_id], function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: "False", message: "資料庫讀取失敗:\n" });
    } else {
      console.log("讀取資料庫成功")
      console.log(result)
      return res.status(200).json({ success: "success", message: result });
      //回傳為json格式，可以透過物件的方式調用裡面資料

    }
  });
})

module.exports = router;

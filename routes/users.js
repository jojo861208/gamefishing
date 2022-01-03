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
//   }
// });

/* GET users listing. */

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

    }
  });
})

module.exports = router;

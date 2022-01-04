var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var { mysqlPoolQuery } = require('../connection/mysql.js')

// api_2: register
// 將註冊的ID新增至資料庫裡
router.post('/register', function (req, res) {
  // post的狀況form裡面的值要從body撈
  group_id = req.body.group_id;
  mysqlPoolQuery('INSERT INTO group_info VALUE (?, ?, ?, ?)', [group_id, 1, 0, 1], function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "新增組別失敗(請換一個名字嘗試)" });
    } else {
      console.log("新增組別成功");
      return res.status(200).json({ success: true, message: "" });
    }
  });
});


// api_5: buy_ship
// 將買船的決定傳到資料庫並更新現有船數(固定+1)
router.post('/buy_ship', function (req, res) {
    //post的狀況form裡面的值要從body撈
    game_id = req.body.game_id;
    group_id = req.body.group_id;
    round = req.body.round;
    ship_count = req.body.ship_count;

    // 記錄買船
    mysqlPoolQuery('INSERT INTO group_ship_record (game_id, group_id, round, buy_or_not, ship_delta) \
                    VALUE (?, ?, ?, 1, 1)', [game_id, group_id, round], function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "買船記錄失敗，請重新嘗試" });
      } else {
        console.log("買船記錄成功")
      }
    });

    // 更新船數 & 回傳最大捕魚量 (怪：程式順序會先執行此查詢)
    mysqlPoolQuery('UPDATE group_info \
                    SET ship_count = ship_count + 1 \
                    WHERE game_id = ? AND group_id = ?', [game_id, group_id], function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "買船失敗，請重新嘗試" });
      } else {
        console.log("買船成功");
        max_buy_fish = (ship_count + 1) * 5;
        console.log("現在最多可以買"+max_buy_fish+"條魚");
        return res.status(200).json({ success: true, message: max_buy_fish});
      }
    });
});

module.exports = router;
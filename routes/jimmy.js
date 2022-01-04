var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var { mysqlPoolQuery } = require('../connection/mysql.js')

function generateRandomInt(min,max){
  return Math.floor((Math.random() * (max-min)) +min);
}

function check_buy_ship(fish_count, ship_count){
  if(fish_count>=6 && ship_count<4){
    return 1;
  }
  else{
    return 0;
  }
}

router.get('/check_buy_ship', function (req, res) {
  //get的狀況form裡面的值要從query撈
  let game_id = req.query.game_id;
  let group_id = req.query.group_id;
  mysqlPoolQuery('SELECT fish_count, ship_count FROM group_info WHERE game_id=? AND group_id=?',
  [game_id, group_id], function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "資料庫讀取失敗:\n" });
    } else {
      console.log("讀取資料庫成功")
      json_data = JSON.parse(JSON.stringify(result));
      let check_buy_ship_result;
      check_buy_ship_result = check_buy_ship(json_data[0].fish_count,json_data[0].ship_count)
      // 回傳json
      return res.status(200).json({ success: true, message: {'check_buy_ship':check_buy_ship_result}});
      //回傳值直接渲染ejs
      console.log(json_data);
      res.render('users', {
        users: json_data
      });
    }
  });
});

router.get('/breeding', function (req, res) {
  //get的狀況form裡面的值要從query撈
  let breeding_rate = 1 + (generateRandomInt(35,45)/100);
  let game_id = req.query.game_id;
  console.log(breeding_rate);
  mysqlPoolQuery('UPDATE ocean SET round=round+1, fish_total=ROUND(fish_total*?,0) WHERE game_id=?',
  [breeding_rate, game_id], function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "資料庫讀取失敗:\n" });
    } else {
      console.log("讀取資料庫成功")
      json_data = JSON.parse(JSON.stringify(result));
      // 回傳json
      return res.status(200).json({ success: true, message: '' });

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
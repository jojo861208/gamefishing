var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var { mysqlPoolQuery } = require('../connection/mysql.js')

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

router.get('/open_game', function (req, res, next) {
    var num_of_group = req.query.num_of_group;

    var r = getRandom(0.9, 1.1);
    var fish_total = r * (num_of_group * 16 + 4);
    fish_total = Math.round(fish_total, 1);
    console.log(fish_total);
    mysqlPoolQuery('INSERT INTO ocean VALUES (?,?)', [fish_total, 1], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: err });
        } else {
            json_data = JSON.parse(JSON.stringify(result));
            return res.status(200).json({ success: true, message: "" });
        }
    });
});

router.get('/check_rank', function (req, res, next) {
    game_id = req.query.game_id;
    mysqlPoolQuery('SELECT group_id, fish_count FROM group_info WHERE game_id = ?', [game_id], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "資料庫讀取失敗:\n" });
        } else {
            console.log("讀取資料庫成功")
            json_data = JSON.parse(JSON.stringify(result));
            // 回傳值是一array
            console.log(json_data);
            let map = new Map();
            for (const iterator of json_data) {
                map.set(iterator.group_id, iterator.fish_count);
            }
            console.log(map);
            let rankMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
            console.log("ranked map: ", rankMap);
            // convert map into object
            let obj = Object.fromEntries(rankMap);
            let groupRank = Object.keys(obj);
            // groupRank是一陣列，用groupRank[i]取值
            console.log(groupRank);
            // 回傳json
            return res.status(200).json({ success: true, message: groupRank });
        }
    });
});

router.post('/change_group_status', function (req, res, next) {
    var game_id = req.body.game_id;

    mysqlPoolQuery('UPDATE group_info SET status = 1 WHERE game_id =  ?', [game_id], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: err });
        } else {
            json_data = JSON.parse(JSON.stringify(result));
            return res.status(200).json({ success: true, message: "" });
        }
    });


});

router.get('/breeding', function (req, res) {
    //get的狀況form裡面的值要從query撈
    let breeding_rate = 1 + (generateRandomInt(35, 45) / 100);
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

module.exports = router;

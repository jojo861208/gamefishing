var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var { mysqlPoolQuery } = require('../connection/mysql.js')

router.get('/get_group_info', async function(req, res, next) {
    group_id = req.query.group_id;
    game_id = req.query.game_id;
    let round, fish_count, ship_count;

    function getCountPromise() {
        return new Promise((resolve, reject) => {
            mysqlPoolQuery('SELECT fish_count, ship_count FROM group_info WHERE group_id = ?', [group_id], function(err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                    return res.status(500).json({ success: false, message: "資料庫讀取失敗:\n" });
                } else {
                    if (result.length) {
                        console.log("讀取資料庫成功");
                        json_data = JSON.parse(JSON.stringify(result));
                        // 處理回傳格式
                        fish_count = json_data[0].fish_count;
                        ship_count = json_data[0].ship_count;
                        resolve(json_data[0]);
                    } else {
                        return res.status(400).json({ success: false, message: err});
                    }
                }
            });
        })
    }

    function getRoundPromise() {
        return new Promise((resolve, reject) => {
            mysqlPoolQuery('SELECT round FROM ocean WHERE game_id = ?', [game_id], function(err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                    return res.status(500).json({ success: false, message: "資料庫讀取失敗:\n" });
                } else {
                    if (result.length) {
                        console.log("讀取資料庫成功");
                        json_data = JSON.parse(JSON.stringify(result));
                        // 處理回傳格式
                        console.log(json_data[0]);
                        round = json_data[0].round;
                        resolve(json_data[0]);
                    } else {
                        return res.status(400).json({ success: false, message: err});
                    }
                }
            });
        })
    }
    try {
        await getCountPromise();
        await getRoundPromise();
    
        return res.status(200)
                    .json({ 
                        success: true, 
                        message: {
                            'round': round, 'fish_count': fish_count, 'ship_count': ship_count 
                        }
                    })
    } catch (error) {
        return res.status(400).json({ success: false, message: error});
    }
})

router.get('/get_all_group', function(req, res, next) {
    game_id = req.query.game_id;
    
})

router.get('/check_rest_fish', function (req, res, next) {
    //get的狀況form裡面的值要從query撈
    game_id = req.query.game_id;
    mysqlPoolQuery('SELECT fish_total FROM ocean WHERE game_id = ?', [game_id], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "資料庫讀取失敗:\n" });
        } else {
            console.log("讀取資料庫成功")
            json_data = JSON.parse(JSON.stringify(result));
            // 回傳json
            return res.status(200).json({ success: true, message: json_data[0] });
        //回傳值直接渲染ejs
        res.render('users', {
            users: json_data
        });
        }
    });
});

module.exports = router;
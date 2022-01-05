var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var { mysqlPoolQuery } = require('../connection/mysql.js')

router.get('/get_group_info', async function(req, res, next) {
    let group_id = req.query.group_id;
    let game_id = req.query.game_id;
    let round, fish_count, ship_count;
    console.log(group_id, game_id);

    function getCountPromise(group_id) {
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
                        return res.status(400).json({ success: false, message: `查無${group_id}資料`});
                    }
                }
            });
        })
    }

    function getRoundPromise(game_id) {
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
                        return res.status(400).json({ success: false, message: `查無${game_id}資料`});
                    }
                }
            });
        })
    }
    try {
        await getCountPromise(group_id);
        await getRoundPromise(game_id);
    
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
    mysqlPoolQuery('SELECT group_id FROM group_info WHERE game_id = ?', [game_id], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "資料庫讀取失敗:\n" });
        } else {
            console.log("讀取資料庫成功")
            json_data = JSON.parse(JSON.stringify(result));
            // 回傳值是一array, 使用json_data[i].group_id取值
            console.log(json_data);
            let groupArr = [];
            for (const iterator of json_data) {
                groupArr.push(iterator.group_id);
            }
            // groupArr是一陣列，用groupArr[i]取值
            console.log(groupArr);
            // 回傳json
            return res.status(200).json({ success: true, message: groupArr });
        }
    });
})

router.get('/check_rank', function(req, res, next) {
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
            let rank;
            let map = new Map();
            for (const iterator of json_data) {
                map.set(iterator.group_id, iterator.fish_count);
            }
            console.log(map);
            let rankMap = new Map([...map.entries()].sort((a, b) => a[1] - b[1]));
            console.log("ranked map: ", rankMap);
            let obj = Object.fromEntries(rankMap);
            let groupRank = Object.keys(obj);
            // groupRank是一陣列，用groupRank[i]取值
            console.log(groupRank);
            // 回傳json
            return res.status(200).json({ success: true, message: groupRank });
        }
    });
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
        }
    });
});

module.exports = router;
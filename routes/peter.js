var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var { mysqlPoolQuery } = require('../connection/mysql.js')

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


router.get('/openGame', function (req, res, next) {
    var num_of_group = req.query.num_of_group;
    var r = getRandom(0.9, 1.1);
    var fish_total = r * (num_of_group * 16 + 4);
    fish_total = Math.round(fish_total, 1);
    console.log(fish_total);
    mysqlPoolQuery('INSERT INTO ocean SET game_id = 3, round = 1 ,fish_total = ?', [fish_total], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: err });
        } else {
            json_data = JSON.parse(JSON.stringify(result));
            return res.status(200).json({ success: true, message: "" });
        }
    });
});



router.get('/catch_fish', function (req, res, next) {
    var group_id = req.query.group_id;
    var game_id = req.query.game_id;
    var round = req.query.round;
    var decision = req.query.decision;
    var fish_delta = req.query.fish_delta;
    var max_buy_fish = req.query.max_buy_fish;

    fish_delta = parseInt(fish_delta);

    // get current group fish count
    mysqlPoolQuery('SELECT fish_count FROM group_info WHERE group_id = ?', [group_id], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: err });
        } else {
            json_data = JSON.parse(JSON.stringify(result));
            fish_count = json_data[0].fish_count;
            fish_count = parseInt(fish_count);
            return fish_count;
        }
    });
    console.log(fish_count);
    // get current total fish in ocean
    mysqlPoolQuery('SELECT fish_total FROM ocean WHERE game_id = ?', [game_id], function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: err });
        } else {
            console.log('');
            json_data = JSON.parse(JSON.stringify(result));
            fish_total = json_data[0].fish_total;
            fish_total = parseInt(fish_total);
            return fish_total;
        }
    });

    // decision1 = 捕魚
    if (decision == 1) {
        // 檢查捕魚數量
        if (fish_delta <= max_buy_fish) {
            // 插入購買紀錄
            mysqlPoolQuery('INSERT INTO group_fish_record SET group_id=?, round = ? ,decision = 1,fish_delta = ?', [group_id, round, fish_delta], function (err, result) {
                if (err) {
                    console.log('-----插入購買記錄失敗-----');
                    console.log(err);
                    return err;
                } else {
                    console.log('-----插入購買記錄成功-----');
                    // 更新group_info中組內魚數量
                    fish_count = fish_count + fish_delta;
                    mysqlPoolQuery('UPDATE group_info SET fish_count = ? WHERE group_id = ?', [fish_count, group_id], function (err, result) {
                        if (err) {
                            console.log('-----更新魚數失敗-----');
                            console.log(err);
                            return err;
                        } else {
                            console.log('-----更新魚數成功-----');
                            // 更新魚池數目
                            fish_total = fish_total - fish_delta;
                            mysqlPoolQuery('UPDATE ocean SET fish_total = ? WHERE game_id = ?', [fish_total, game_id], function (err, result) {
                                if (err) {
                                    console.log('-----更新魚池總數失敗-----');
                                    console.log(err);
                                    return err;
                                } else {
                                    console.log('-----更新魚池總數成功-----');
                                }
                            });
                        }
                    });
                }
            });

            return res.status(200).json({ success: true, message: "" })
        }
        else {
            return res.status(200).json({ success: false, message: "捕魚超出可補上限，請購買船隻" });
        }
    }
    // decision2 = 休息
    else if (decision == 2) {
        mysqlPoolQuery('UPDATE group_fish_record SET decision = 2 WHERE group_id = ?', [group_id], function (err, result) {
            if (err) {
                console.log('-----紀錄休息失敗-----');
                console.log(err);
                return res.status(500).json({ success: false, message: err });
            } else {
                console.log('-----紀錄休息成功-----');
                json_data = JSON.parse(JSON.stringify(result));
                return res.status(200).json({ success: true, message: "" });
            }
        });
    }

    // decision3 = 回饋海洋
    else if (decision == 3) {
        // 檢查回饋數量
        if (fish_count + fish_delta >= 0) {
            // 插入回饋紀錄
            mysqlPoolQuery('INSERT INTO group_fish_record SET group_id=?, round = ? ,decision = 1,fish_delta = ?', [group_id, round, fish_delta], function (err, result) {
                if (err) {
                    console.log('-----插入回饋記錄失敗-----');
                    console.log(err);
                    return err;
                } else {
                    console.log('-----插入回饋記錄成功-----');
                    // 更新group_info中組內魚數量
                    fish_count = fish_count + fish_delta;
                    mysqlPoolQuery('UPDATE group_info SET fish_count = ? WHERE group_id = ?', [fish_count, group_id], function (err, result) {
                        if (err) {
                            console.log('-----更新魚數失敗-----');
                            console.log(err);
                            return err;
                        } else {
                            console.log('-----更新魚數成功-----');
                            // 更新魚池數目
                            fish_total = fish_total - fish_delta;
                            mysqlPoolQuery('UPDATE ocean SET fish_total = ? WHERE game_id = ?', [fish_total, game_id], function (err, result) {
                                if (err) {
                                    console.log('-----更新魚池總數失敗-----');
                                    console.log(err);
                                    return err;
                                } else {
                                    console.log('-----更新魚池總數成功-----');
                                }
                            });
                        }
                    });
                }
            });
            return res.status(200).json({ success: true, message: "" })
        }
        else {
            return res.status(200).json({ success: false, message: "沒有這麼多魚可以回饋唷!" });
        }


    }
})

module.exports = router;
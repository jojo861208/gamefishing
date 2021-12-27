var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var conn = mysql.createConnection({
  host: 'us-cdbr-east-05.cleardb.net',
  user: 'b8228822a37ac5',
  password: 'e26c1c18',
  database: 'heroku_e783206b1d51501',
  port: 3306
});

conn.connect();

conn.query('SELECT client_id FROM group_info', function (err, rows, fields) {
  if (err) throw err;
  console.log('The result is: ', rows[0]);
});
conn.end();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

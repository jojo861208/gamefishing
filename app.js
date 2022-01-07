var express = require('express');
const http = require("http");
const io = require('socket.io')(http);
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var adminRouter = require('./routes/admin');
var clientRouter = require('./routes/client');

var app = express();

// create http server for socket server at port 3001
var port = 3001;
var server = http.createServer(app);
server.listen(port, () => {
    console.log(`socket server listen at: ${port}`);
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/users', usersRouter);
// app.use('/eddie', testRouter);
// app.use('/rita', ritaRouter);
// app.use('/peter', peterRouter);
// app.use('/jimmy', jimmyRouter);

app.use('/admin', adminRouter);
app.use('/client', clientRouter);


app.set('view engine', 'ejs');


// socket server listening to port 3001
var servIo = io.listen(server);
servIo.on('connection', function (socket) {
    console.log('user connected!');
    setInterval(function () {
        socket.emit('second', { 'second': new Date().getSeconds() });
    }, 1000);
    socket.on('client_data', function (data) {
        console.log(data);
    });
    socket.on('disconnect', function () {
        console.log('a user disconnected!');
    });
});

module.exports = app;

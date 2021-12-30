var socket = io.connect('http://localhost:3001');
socket.on('second', function (second) {
    $('#second').text(second.second);
});

$(document).ready(function () {
    $('#text').keypress(function (e) {
        socket.emit('client_data', String.fromCharCode(e.charCode));
    });
});
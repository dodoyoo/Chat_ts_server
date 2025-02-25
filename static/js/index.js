var socket = io();

socket.on('connect', function () {
  var name = prompt('반갑습니다.', '');

  if (!name) {
    name = '익명';
  }

  socket.emit('newUser', name);
});

socket.on('update', function (data) {
  console.log(`${data.name}: ${data.message}`);
});

function send() {
  var message = document.getElementById('test').value;

  document.getElementById('test').value = '';

  socket.emit('send', { msg: message });
}

// socket.on('connect', function () {
//   var input = document.getElementById('test');
//   input.value = '접속 됨';
// });

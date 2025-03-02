var socket = io();
var chat = document.getElementById('chat');

function scrollToBottom() {
  if (chat) {
    chat.scrollTop = chat.scrollHeight;
  }
}
/* 접속 되었을 때 실행 */
socket.on('connect', function () {
  /* 이름을 입력받고 */
  var name = prompt('반갑습니다!', '') || '익명';

  /* 이름이 빈칸인 경우 */
  if (!name) {
    name = '익명';
  }

  /* 서버에 새로운 유저가 왔다고 알림 */
  socket.emit('newUser', name);
});

/* 서버로부터 데이터 받은 경우 */
socket.on('update', function (data) {
  var chat = document.getElementById('chat');

  // 접속 및 연결 해제 메시지는 표시하지 않음
  if (data.type === 'connect' || data.type === 'disconnect') {
    return; // 함수 실행 중단
  } else if (data.type === 'message') {
    var message = document.createElement('div');
    message.classList.add('other');
    message.textContent = `${data.name}: ${data.message}`;
    chat.appendChild(message);
    scrollToBottom();
  }

  // 타입에 따라 적용할 클래스를 다르게 지정
  // switch (data.type) {
  //   case 'message':
  //     className = 'other';
  //     message.textContent = `${data.name}: ${data.message}`;
  //     break;

  //   case 'connect':
  //     className = 'connect';
  //     message.textContent = data.message;
  //     break;

  //   case 'disconnect':
  //     className = 'disconnect';
  //     message.textContent = data.message;
  //     break;
  // }
});

/* 메시지 전송 함수 */
function send() {
  // 입력되어있는 데이터 가져오기
  var message = document.getElementById('test').value;

  if (message.trim() === '') {
    return;
  }

  // 가져왔으니 데이터 빈칸으로 변경
  document.getElementById('test').value = '';

  // 내가 전송할 메시지 클라이언트에게 표시
  var chat = document.getElementById('chat');
  var msg = document.createElement('div');
  msg.textContent = message;
  msg.classList.add('me');
  chat.appendChild(msg);

  // 서버로 message 이벤트 전달 + 데이터와 함께
  socket.emit('message', { type: 'message', message: message });
  scrollToBottom();
}

document.addEventListener('DOMContentLoaded', function () {
  var input = document.getElementById('test');
  input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      send();
    }
  });

  input.focus();
});

var socket = io();

socket.on('connect', function () {
  var name = prompt('반갑습니다.', '');

  if (!name) {
    name = '익명';
  }

  socket.emit('newUser', name);
});

socket.on('update', function (data) {
  console.log('받은 데이터:', data); // 데이터 확인용 콘솔 출력

  // 채팅 메시지를 화면에 추가하는 함수 호출
  appendMessage(`${data.name}: ${data.message}`);
});

function appendMessage(message) {
  var chatBox = document.getElementById('chatBox'); // 채팅 메시지를 표시할 div 찾기
  if (!chatBox) return; // chatBox가 없으면 아무것도 안 함

  var messageElement = document.createElement('p'); // 새로운 <p> 태그 생성
  messageElement.textContent = message; // 메시지 내용 추가
  chatBox.appendChild(messageElement); // chatBox에 추가
}

function send() {
  var message = document.getElementById('test').value;

  document.getElementById('test').value = '';

  socket.emit('message', { msg: message });
}

// // // socket.on('connect', function () {
// // //   var input = document.getElementById('test');
// // //   input.value = '접속 됨';
// // // });

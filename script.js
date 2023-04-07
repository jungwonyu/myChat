$(function () {
  const socket = io.connect();

  // 처음 화면
  $('#msgArea').hide();

  // 로그인 상태의 화면
  $('#userForm').on('submit', function (e) {
    e.preventDefault(); // submit 막기

    let userName = $('#username').val();
    socket.emit('newUser', userName); // 이벤트 발생

    $('#userArea').hide();
    $('#msgArea').show();
  });

  // 메세지 입력
  $('#msgForm').on('submit', function (e) {
    e.preventDefault();

    let msg = $('#msg').val();
    socket.emit('newMsg', msg);
  });

  socket.on('allUser', function (users) {
    // 로그인 사용자목록을 갱신
    let html = '';

    users.map((user) => {
      html += `<li class="list-group">${user}</li>`;
    });
    $('#users').html(html);
  });
});

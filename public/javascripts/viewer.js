$(() => {
  var socket = io();
  socket.on('game_start', function (data) {
    console.log(`Game starting: ${data.url}`);
    $("#board").attr("src", data.url)
  });
})
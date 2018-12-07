$(() => {
  //var socket = io.connect('http://127.0.0.1:5000'); //FIXME
  var socket = io();
  socket.on('game_start', function (data) {
    console.log(data);
    $("#board").attr("src", data.url);
  });

  socket.on('state', function (data) {
    console.log(data);
    $("#snake-list").empty();
    data.snake_queue.forEach(function(entry){
      $("#snake-list").append(`<li>${entry.name}</li>`)
    })
    $("#game-id").html(data.game_id);
    if(data.game_state === 'countdown'){
      $("#game-state").html(`${data.game_state} (${data.seconds_to_start})`);
    } else {
      $("#game-state").html(data.game_state);
    }
  });

  $("#add-snake-btn").click(event => {
    event.preventDefault()

    snakename = $("#snake-name").val()
    snakeurl = $("#snake-url").val()

    $.post(`/queue?name=${snakename}&url=${snakeurl}`, function() {
      $("#snake-name").val("")
      $("#snake-url").val("")
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      alert(jqXHR.responseText);
    })
  })

  $("#start-game-btn").click(event => {
    console.log("start-game")
    $("#errors").text("")
    event.preventDefault()
    const height = parseInt($("#height").val())
    const width = parseInt($("#width").val())
    const food = parseInt($("#food").val())
    
    //TODO: start the game...
  })
})
$(() => {
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
    $("#min-snakes").html(data.min_snakes);
    $("#game-auto-start").html(`${data.auto_start}`);
    $("#auto-start-chk").prop('checked', data.auto_start);
    if(data.game_state === 'countdown'){
      $("#game-state").html(`${data.game_state} (${data.seconds_to_start})`);
    } else {
      $("#game-state").html(data.game_state);
    }
    $('#start-game-btn').prop('disabled', data.game_state != 'waiting');
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

  $("#apply-config").click(event => {
    var autoStart = $('#auto-start-chk').is(':checked');

    $.post(`/config?autostart=${autoStart}`, function() {
      $('#apply-config').removeClass('pure-button-primary');
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      alert(jqXHR.responseText);
    })
  });

  $('.config').change(function(){
    $('#apply-config').addClass('pure-button-primary');
  });

  $("#start-game-btn").click(event => {
    console.log("start-game")
    $("#errors").text("")
    event.preventDefault()

    $.post(`/start`, function() {
      //
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      alert(jqXHR.responseText);
    })
  })
})
$(() => {
  //var socket = io.connect('http://127.0.0.1:5000'); //FIXME
  var socket = io();
  socket.on('game_start', function (data) {
    console.log(data);
    $("#board").attr("src", data.url);
  });

  socket.on('state', function (data) {
    console.log(data);
  });

  $("#add-snake-btn").click(event => {
    console.log("add-snake")
    event.preventDefault()

    snakename = $("#snake-name").val()
    snakeurl = $("#snake-url").val()

    socket.emit('queue_snake', {name: snakename, url: snakeurl});

    $("#snake-name").val("")
    $("#snake-url").val("")
  })

  $("#start-game-btn").click(event => {
    console.log("start-game")
    $("#errors").text("")
    event.preventDefault()
    const height = parseInt($("#height").val())
    const width = parseInt($("#width").val())
    const food = parseInt($("#food").val())
    const snakes = []

    $(".snake-group").each(function() {
      const url = $(".snake-url", $(this)).val()
      if (!url) {
        return
      }
      snakes.push({
        name: $(".snake-name", $(this)).val(),
        url
      })
    })
    if (snakes.length === 0) {
      $("#errors").text("No snakes available")
    }
    fetch("http://localhost:3005/games", {
      method: "POST",
      body: JSON.stringify({
        width,
        height,
        food,
        "snakes": snakes,
      })
    }).then(resp => resp.json())
      .then(json => {
        const id = json.ID
        console.debug(`http://localhost:3000?engine=http://localhost:3005&game=${id}`);
        fetch(`http://localhost:3005/games/${id}/start`, {
          method: "POST"
        }).then(_ => {
          $("#board").attr("src", `http://localhost:3000?engine=http://localhost:3005&game=${id}`)
        }).catch(err => $("#errors").text(err))
      })
      .catch(err => $("#errors").text(err))
  })
})
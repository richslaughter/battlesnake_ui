console.log("loading...")

$(() => {
  $("#add-snake-btn").click(event => {
    console.log("add-snake")
    event.preventDefault()

    const snakeGroup = $(".snake-group")
    const newGroup = snakeGroup.first().clone()
    const newNum = snakeGroup.length + 1
    const legend = $("legend", newGroup)
    legend.text("Snake " + newNum)
    $(".snake-name-label", newGroup).attr("for", "snake-name-" + newNum)
    $(".snake-name", newGroup).attr("id", "snake-name-" + newNum)
    $(".snake-url-label", newGroup).attr("for", "snake-url-" + newNum)
    $(".snake-url", newGroup).attr("id", "snake-url-" + newNum)
    snakeGroup.first().parent().append(newGroup)
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
  console.log("ready!")
})
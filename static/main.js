// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getPlayers() {
    const request = new Request("http://localhost:3000/getplayers", {method: "GET"});
    return fetch(request)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Something went wrong on API server!");
        }
      })
      .then((players) => {
        return players;
      })
      .catch((error) => {
        console.error(error);
      })
}

var all_players;
window.addEventListener("load", function(){
    let h1 = document.querySelector("h1");
    getPlayers().then((players) => {
        let player_str = ""
        for(let player of players){
            player_str += player.name + ", ";
        }
        h1.innerHTML = player_str;
        all_players = players;

        shuffleArray(all_players); 
        let team_table = document.querySelector("table#team_table");
        let table_body = team_table.querySelector("tbody")

        for(let i = 0; i < all_players.length / 2; i++){
            let row = document.createElement("tr");
            team_table.appendChild(row);

            let label = document.createElement("th");
            label.scope = "row";
            row.appendChild(label)

            let member1 = document.createElement("td") 
            let member2 = document.createElement("td") 
            
            member1.innerHTML = all_players[i*2].name;
            member2.innerHTML = all_players[i*2+1].name;
            row.appendChild(member1);
            row.appendChild(member2);

            table_body.appendChild(row)
        }

    }).catch((error) => {
        console.log("error fetching players", error)
    })
})

document.getElementById("randomizeButton").onclick = function(){
    shuffleArray(all_players)
    let team_table = document.querySelector("table#team_table");
    let table_body = document.querySelector("tbody");
    let rows = table_body.querySelectorAll("tr");
    console.log(rows.length)
    for(let i = 0; i < rows.length; i++){
        team_members = rows[i].querySelectorAll("td");
        console.log(team_members)
        team_members[0].innerHTML = all_players[i*2].name;
        team_members[1].innerHTML = all_players[i*2+1].name;
    }
}

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

function getPresentPlayersNames(){
    let players_dropdown = document.querySelector("div#players_dropdown_div");
    let dropdown_menu = players_dropdown.querySelector("ul");
    let dropdown_players = players_dropdown.querySelectorAll("a")
    let present_players = []
    for(let item of dropdown_players){
        let checkbox = item.querySelector("input");
        if(checkbox.checked){
            present_players.push(checkbox.value);
        }
    }
    return present_players
}

function addTeamRow(tbody, team1, team2){
    let row = document.createElement("tr");
    tbody.appendChild(row);

    let label = document.createElement("th");
    label.scope = "row";
    row.appendChild(label)

    let team1_member1 = document.createElement("td") 
    let team1_member2 = document.createElement("td") 
    let score_input = document.createElement("input")
    score_input.type = "text";
    score_input.id = "scoreboard";
    let team2_member1 = document.createElement("td") 
    let team2_member2 = document.createElement("td") 

    
    team1_member1.innerHTML = team1[0];
    team1_member2.innerHTML = team1[1];
    team2_member1.innerHTML = team2[0];
    team2_member2.innerHTML = team2[1];

    row.appendChild(team1_member1);
    row.appendChild(team1_member2);
    row.appendChild(score_input)
    row.appendChild(team2_member1);
    row.appendChild(team2_member2);

    tbody.appendChild(row)
}

window.addEventListener("load", function(){
    document.querySelector("h1").innerHTML = "Welcome to Badminton Team Assignment Website";
    
    getPlayers().then((players) => {
        let player_str = ""
        for(let player of players){
            player_str += player.name + ", ";
        }
        all_players = players;

        // setup dropdown menu
        let players_dropdown = document.querySelector("div#players_dropdown_div");
        let dropdown_menu = players_dropdown.querySelector("ul");
        for(let player of players){
            let li = document.createElement("li");
            dropdown_menu.appendChild(li);

            let dropdown_item = document.createElement("a");
            dropdown_item.class = "dropdown-item";
            li.appendChild(dropdown_item)

            let checkbox = document.createElement("input")
            checkbox.type = "checkbox";
            checkbox.class = "form-check-input me-2";
            checkbox.value = player.name;
            checkbox.checked="yes";

            let checkbox_label = document.createElement("label");
            checkbox_label.appendChild(checkbox)
            checkbox_label.appendChild(document.createTextNode(" " + player.name))
            
            dropdown_item.appendChild(checkbox_label);
        }

        // setup initial teams and table structure
        shuffleArray(players); 

        let team_table = document.querySelector("table#team_table");
        let table_body = team_table.querySelector("tbody")
        
        for(let i = 0; i < players.length / 2 - 1; i += 2){
            team1 = [players[i*2].name, players[i*2+1].name]
            team2 = [players[(i+1)*2].name, players[(i+1)*2+1].name]
            addTeamRow(table_body, team1, team2);
        }

    }).catch((error) => {
        console.log("error fetching players", error)
    })
})

document.getElementById("randomizeButton").onclick = function(){
    const present_players_names = getPresentPlayersNames();
    shuffleArray(present_players_names)

    let team_table = document.querySelector("table#team_table");
    let table_body = document.querySelector("tbody");
    let rows = table_body.querySelectorAll("tr");
    
    // TODO: use existing rows not deleting all 
    for(let i = 0; i < rows.length; i++){
        table_body.removeChild(rows[i])
    }
    
    // TODO: this currently will write out of bound and handled by the next for 
    for(let i = 0; i < present_players_names.length; i+=4){
        let team1 = [present_players_names[i], present_players_names[i+1]]
        let team2 = [present_players_names[i+2], present_players_names[i+3]]
        addTeamRow(table_body, team1, team2);
    }

    rows = table_body.querySelectorAll("tr")
    for (let col of rows[rows.length-1].querySelectorAll("td")){
        if(col.innerHTML == "undefined"){
            col.innerHTML = "";
        }
    }
}

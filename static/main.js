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

function addRow(tbody, name1, name2){
    let row = document.createElement("tr");
    tbody.appendChild(row);

    let label = document.createElement("th");
    label.scope = "row";
    row.appendChild(label)

    let member1 = document.createElement("td") 
    let member2 = document.createElement("td") 
    
    member1.innerHTML = name1;
    member2.innerHTML = name2;
    row.appendChild(member1);
    row.appendChild(member2);

    tbody.appendChild(row)
}

window.addEventListener("load", function(){
    let h1 = document.querySelector("h1");
    getPlayers().then((players) => {
        let player_str = ""
        for(let player of players){
            player_str += player.name + ", ";
        }
        h1.innerHTML = player_str;
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
        
        for(let i = 0; i < all_players.length / 2; i++){
            addRow(table_body, players[i*2].name, players[i*2+1].name);
        }

    }).catch((error) => {
        console.log("error fetching players", error)
    })
})

document.getElementById("randomizeButton").onclick = function(){
    const present_players_names = getPresentPlayersNames();
    shuffleArray(present_players_names)
    /* TODO: only compute on present players, remove extra rows */
    let team_table = document.querySelector("table#team_table");
    let table_body = document.querySelector("tbody");
    let rows = table_body.querySelectorAll("tr");
    for(let i = 0; i < rows.length; i++){
        if(i * 2 >= present_players_names.length){
            table_body.removeChild(rows[i])
        } else{
            team_members = rows[i].querySelectorAll("td");
            team_members[0].innerHTML = present_players_names[i*2];
            team_members[1].innerHTML = present_players_names[i*2+1];
        }
    }
    for(let i = 0; i < (present_players_names.length - rows.length * 2)/2; i++){
        addRow(table_body, present_players_names[(rows.length + i) * 2], present_players_names[(rows.length + i) * 2 + 1])
    }
}

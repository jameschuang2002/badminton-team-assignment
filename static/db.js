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


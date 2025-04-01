const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs')

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

app.use('/', express.static(path.join(__dirname, 'static')));

const players_list = require("./players.json")
// endpoints 
app.get('/getplayers', (req, res) => {
    res.send(players_list)
})

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



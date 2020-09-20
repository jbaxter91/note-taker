// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

// Code to make read and write file async
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


const app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.listen(PORT, function() {
    console.log("App listening at http://localhost:" + PORT);
  });

//   server path for sending the user the noted.html page
app.get("/notes", (req,res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// api call to get the current list of notes
app.get("/api/notes", async (req,res) => {
    let rawData = await readFileAsync(path.join(__dirname, "db/db.json"));
    let notesJson = JSON.parse(rawData);
    return res.json(notesJson);
});

// Base catch all for returning the index
app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

//Server path for adding a note via api call
app.post("/api/notes", async (req,res) => {
    let rawData = await readFileAsync(path.join(__dirname, "db/db.json"));
    console.log(req.body);
    let notesJson = JSON.parse(rawData);
    req.body.id = crypto.randomBytes(10).toString("hex");
    notesJson.push(req.body);
    await writeFileAsync(path.join(__dirname, "db/db.json"),JSON.stringify( notesJson));
    
    return res.send(notesJson);
});

//Server pathing for deleting a note via api call
app.delete("/api/notes/:id", async (req,res) => {
    var chosen = req.params.id;
    let rawData = await readFileAsync(path.join(__dirname, "db/db.json"));
    let notesJson = JSON.parse(rawData);
    var removeIndex = notesJson.map(item => item.id)
                       .indexOf(chosen);
    ~removeIndex && notesJson.splice(removeIndex, 1);
    await writeFileAsync(path.join(__dirname, "db/db.json"),JSON.stringify( notesJson));

    return res.send(notesJson);
});
  

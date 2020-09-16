// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");


const app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.listen(PORT, function() {
    console.log("App listening at localhots:" + PORT);
  });

app.get("/notes", (req,res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/api/notes", (req,res) => {
    let rawData = fs.readFileSync(path.join(__dirname, "db/db.json"));
    let notesJson = JSON.parse(rawData);
    return res.json(notesJson);
});

app.post("/api/notes", (req,res) => {
    let rawData = fs.readFileSync(path.join(__dirname, "db/db.json"));
    console.log(req.body);
    let notesJson = JSON.parse(rawData);
    req.body.id = crypto.randomBytes(16).toString("hex");
    notesJson.push(req.body);
    fs.writeFileSync(path.join(__dirname, "db/db.json"),JSON.stringify( notesJson));
    
    return res.send(notesJson);
});

app.delete("/api/notes/:id", (req,res) => {
    var chosen = req.params.id;
    let rawData = fs.readFileSync(path.join(__dirname, "db/db.json"));
    let notesJson = JSON.parse(rawData);
    var removeIndex = notesJson.map(item => item.id)
                       .indexOf(chosen);
    console.log(removeIndex);
    ~removeIndex && notesJson.splice(removeIndex, 1);
    fs.writeFileSync(path.join(__dirname, "db/db.json"),JSON.stringify( notesJson));

    return res.send(notesJson);
});
  

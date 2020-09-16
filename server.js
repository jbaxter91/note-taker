// Dependencies
const express = require("express");
const path = require("path");


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
});

app.post("/api/notes", (req,res) => {
});

app.delete("/api/notes/:id", (req,res) => {
});
  

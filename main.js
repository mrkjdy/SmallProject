const express = require("express");
const mysql = require("mysql");
const PORT = process.env.PORT || 5000;

var con = mysql.createConnection({
  host: "smallproject.com",
  user: "Group4UCF",
  password: "Cop4331ucf"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

var app = express();

app.use(express.static(__dirname));

app.listen(PORT, function()
{
	console.log("Listening on " + PORT)
});

// app.get('/', function(req, res)
// { 
// 	res.sendFile(__dirname + "/index.html");
// });

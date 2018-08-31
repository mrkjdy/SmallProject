const express = require("express");
const mysql = require("mysql");
const PORT = process.env.PORT || 5000;

var connection = mysql.createConnection({
  host     : 'us-cdbr-iron-east-01.cleardb.net',
  user     : 'b0e7c31b916c42',
  password : '04f5efab',
  database : 'heroku_883b37654a02d69'
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

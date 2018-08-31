const express = require("express");
const PORT = process.env.PORT || 5000;

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

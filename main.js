const express = require("express");
const mysql = require("mysql");
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const PORT = process.env.PORT || 5000;


// // mysql stuff
// var db_config = {
//   host     : 'us-cdbr-iron-east-01.cleardb.net',
//   user     : 'b0e7c31b916c42',
//   password : '04f5efab',
//   database : 'heroku_883b37654a02d69'
// };

// var connection;

// function handleDisconnect() 
// {
//   connection = mysql.createConnection(db_config);

//   connection.connect(function(err) 
//   {
//     if(err) 
//     {
//       console.log('error when connecting to db:', err);
//       setTimeout(handleDisconnect, 2000);
//     }
//     console.log("Connected to mysql database!")
//   });

//   connection.on('error', function(err) 
//   {
//     console.log('db error', err);
//     if(err.code === 'PROTOCOL_CONNECTION_LOST') 
//     {
//       handleDisconnect();
//     }
//     else 
//     {
//       throw err;
//     }
//   });
// }

// handleDisconnect();


// Express stuff
var app = express();

app.use(express.static(__dirname));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser());
// app.use(passport.initialize());
// app.use(passport.session({secret: '7i5mnQZjPSqL924rQvxG'}));

app.listen(PORT, function()
{
	console.log("Listening on " + PORT)
});

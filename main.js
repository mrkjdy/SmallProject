const express = require("express");
const mysql = require("mysql");
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const favicon = require('serve-favicon');
const PORT = process.env.PORT || 5000;


// mysql stuff
var db_config = {
	host     : 'us-cdbr-iron-east-01.cleardb.net',
	user     : 'b0e7c31b916c42',
	password : '04f5efab',
	database : 'heroku_883b37654a02d69'
};

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

// favicon server
app.use(favicon(__dirname + '/favicon.ico'));

// body-parser initialization
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser());

// passport initialization
passport.use(new LocalStrategy(function(username, password, done) {
	
	if(validateString('username', username) === true && validateString('password', password) === true) {
		
		db.query("SELECT * FROM /*insert user table*/ WHERE /*user name*/ = '" + username + "';", function(err, result) {
			
			if(err) {
				/*database error handling*/
			} else {
				if(result.length === 0) return done(null, false, {message: 'Incorrect username'});
				if(result[0].password.localeCompare(password) !== 0) return done(null, false, { message: 'Incorrect password'});
				
				return done(null, result[0]);
			}
		});
	} else {
		
		/*string validation error handling*/
	}
}));
passport.serializeUser(function(user, done) {
	done(null, user.id);
});
passport.deserializeUser(function(id, done) {
	
	if(validateString('id', id) === true) {
	
		db.query("SELECT * FROM /*insert user table*/ WHERE /*id name*/ = " + id + ";", function(err, result) {
			
			if(err) {
				/*database error handling*/
			} else {
				done(null, result[0]);
			}
		});
	} else {
	
		/*string validation error handling*/
	}
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session({secret: '7i5mnQZjPSqL924rQvxG'}));

// login function
app.post('/login', function(req, res) {
	
	passport.authenticate('local', function(err, user, info) {
		
		if(err) {/*authentication error handling*/}
		if(!user) {
		
			/*code that informs user*/
		}
		
		req.logIn(user, function(err) {
			
			if(err) {/*login error handling*/}
			
			return res.redirect('/contacts');
		});
	})(req, res);
});

// logout function
app.post('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.listen(PORT, function()
{
	console.log("Listening on " + PORT)
});

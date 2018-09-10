const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const PORT = process.env.PORT || 5000;
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const favicon = require('serve-favicon');
var app = express();
var path = require('path');
// const app = express();

// body-parser initialization
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/favicon.ico'));

app.listen(PORT, function()
{
	console.log("Listening on " + PORT)
});

// Login to database
var db = mysql.createPool({
	connectionLimit: 10,
	host     : 'us-cdbr-iron-east-01.cleardb.net',
  	user     : 'b0e7c31b916c42',
  	password : '04f5efab',
  	database : 'heroku_883b37654a02d69'

});

// passport initialization
passport.use(new LocalStrategy(function(username, password, done) {
	
	if(checkInput(username, 'username') === true/* && checkInput(password, 'password') === true*/) {
		
		db.query("SELECT * FROM users WHERE Login = '" + username + "' AND Password = '" + password + "';", function(err, result) {
			
			if(err) {
				return done(true, false);
			} else {
				if(result.length === 0) return done(null, false);
				
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
	
	db.query("SELECT * FROM users WHERE UserId = " + id + ";", function(err, result) {
			
		if(err) {
			/*database error handling*/
		} else {
			done(null, result[0]);
		}
	});
});

app.use(passport.initialize());
app.use(passport.session({secret: '7i5mnQZjPSqL924rQvxG'}));


app.post('/login', function(req, res) {
	
	passport.authenticate('local', function(err, user, info) {
		

		console.log('authentication complete');
		if(err) {
			return res.status(404).send('Database Error');
		}
		if(!user) {
		
			return res.send(JSON.stringify([{ "UserId": 0 }]));
		}
		
		req.logIn(user, function(err) {
			
			if(err) {
				return res.status(404).send('Login Error');
			}
			
			return res.send(JSON.stringify([{ "UserId": 1 }]));
		});
	})(req, res);
});

// logout function
app.post('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

// Login page
/*app.post('/login', function(req, res) {
	console.log('form submitted');
	// Create connection to database
	db.getConnection(function(err, tempCont){
			
		// Check if correct format
		if(checkInput(req.body.value, "username")) {
						
			// Search for username and password in database
			tempCont.query("SELECT UserId FROM users WHERE Login = ? AND Password = ?", [req.body.username, req.body.password], function(err, result) { //Check why bolded
				
				res.setHeader('Content-Type', 'application/json');

				// Check if query works
				if (err) {
					res.status(400).send('Query Fail');
				} else {
						
					// Check if username and password is in the database
					if(result == "") {
						res.send(JSON.stringify([{ "UserId": 0 }]));
					} else {
						res.send(result);
					}	
				}				        
			});				
				
		} else {
			res.status(400).send('Invalid Values');
		}
			
		// End connection
		tempCont.release();
	
	});
});*/

// Register page
app.post('/register', function(req, res) {
	
	// Check if correct format
	if(checkInput(req.body.username, "username")) {
		
		// Create connection to database
		db.getConnection(function(err, tempCont){
			
			// Error if connection is not established
			if(err) {
				res.status(400).send('Connetion Fail');
				
			} else {
				
				// Check if username exists
				tempCont.query("SELECT * FROM users WHERE Login = ?", [req.body.username], function(err, result){
					
					// Check if query works
					if(err) {
						res.status(400).send('Query fail');
					} else {
						
						// Return if username exists
						if(result != ""){
							res.status(400).send('Username taken');
					
						} else {			
							// Add user to database
							const sqlAddUser = "INSERT INTO users (DateCreated, DateLastLoggedIn, Login, Password) VALUES (";
							tempCont.query(sqlAddUser + "NOW(), NOW(), '" + req.body.username + "', '" + req.body.password + "')", function(err, result) {
							
								// Check if query works
								if(err) {
									res.status(400).send('Query Fail');
								} else {
									res.status(200).send('Query Success');	
								}
							
								// End connection
								tempCont.release();
							
							});
						}
					} 	
				});	
			}
		});
	
	} else {
		res.status(400).send('Invalid Values');
	}

});

// Add contact page
app.post('/addcontact', function(req, res) { 
	
	// Check if correct format
	if(checkInput(req.body.firstname, "name") && checkInput(req.body.lastname, "name") && checkInput(req.body.phone, "phone") && checkInput(req.body.email, "email")) {
			
		// Create connection to database
		db.getConnection(function(err, tempCont){
			
			// Error if connection is not established
			if(err) {
				res.status(400).send('Connection Fail');
			
			} else {
				
				// Add contact to database, Might need a parseInt method if UserId is parsed as a string
				const sqlAddContact = "INSERT INTO contact (UserID, FirstName, LastName, PhoneNumber, Email) VALUES (";
				tempCont.query(sqlAddContact + req.user.UserID + ", '" + req.body.firstname + "', '" + req.body.lastname + "', '" + req.body.phone + "', '" + req.body.email + "')", function(err, result){
					
					// Check if query works
					if (err) {
						res.status(400).send('Query Fail');				
					} else {
						res.status(200).send('Query Success');					
					}
					
					// End connection
					tempCont.release();
       
				});        
			}
		});
			
	} else {
		res.status(400).send('Invalid Values');
	}
});

// Delete Contact
app.post('/deletecontact', function(req, res) {

	// Create connection to database
	db.getConnection(function(err, tempCont){
			
		// Error if connection is not established
		if(err) {
			res.status(400).send('Connection fail');
				
		} else { 
			
			// Delect contact from database, Might need a parseInt method if UserID and ContactId is parsed as a string
			const sqlDeleteContact = "Delete FROM contact WHERE UserID = ? AND ContactID = ?";
			tempCont.query(sqlDeleteContact,[req.user.UserID, req.body.contactid], function(err, result) {
					
				// Check if query works
				if (err) {
					res.status(400).send('Query Fail');
				} else {
					res.status(200).send('Query Success');		
				}
					
				// End connection
				tempCont.release();
			
			});
				
		}

	});
});

// Search Contact
app.post('/searchcontact', function(req, res) {

	// Create connection to database
	db.getConnection(function(err, tempCont){
			
		// Error if connection was not established
		if(err) {
			res.status(400).send('Connection fail');
				
		} else {
				
			switch(req.body.type) {
					
				// Searching by first name
				case "firstname":
					
					// Check if correct format
					if(checkInput(req.body.value, "name")) {
							
						// Search for first name in database
						tempCont.query("SELECT * FROM contact WHERE UserID = ? AND FirstName LIKE '%" + req.body.value + "%'",[req.user.UserID], function(err, result) {
								
							// Check if query works
							if (err) {
								res.status(400).send('Query Fail');
							} else {
								res.send(result);
							}				        
						});				
					
					} else {
						res.status(400).send('Invalid Values');
					}	
						
					break;
						
				// Searching by last name
				case "lastname":
					
					// Check if correct format
					if(checkInput(req.body.value, "name")) {
							
						// Search for last name in database
						tempCont.query("SELECT * FROM contact WHERE UserID = ? AND LastName LIKE '%" + req.body.value + "%'",[req.user.UserID], function(err, result) {
								
							// Check if query fail
							if (err) {
								res.status(400).send('Query Fail');
							} else {
								res.send(result);
							}			        
						});	
					
					} else {
						res.status(400).send('Invalid Values');
					}
						
					break;
						
				// Searching by phone number
				case "phone":
					
					// Check if correct format
					if(checkInput(req.body.value, req.body.type)) {
							
						// Search for phone number in database
						tempCont.query("SELECT * FROM contact WHERE UserID = ? AND PhoneNumber LIKE '%" + req.body.value + "%'",[req.user.UserID], function(err, result){
								
							// Check if query works
							if (err) {
								res.status(400).send('Query Fail');
							} else {
								res.send(result);
							}
						});
					
					} else {
						res.status(400).send('Invalid Values');
					}
						
					break;
						
				// Searching by email
				default:
					
					// Check if correct format
					if(checkInput(req.body.value, "emailsearch")) {
							
						// Search for email in database
						tempCont.query("SELECT * FROM contact WHERE UserID = ? AND Email LIKE '%" + req.body.value + "%'",[req.user.UserID], function(err, result) {
								
							// Check if query works
							if (err) {
								res.status(400).send('Query Fail');
							} else {
								res.send(result);
							}      
						});
					
					} else {
						res.status(400).send('Invalid Values');
					}
						
					break;
			}
		}
			
		// End connection
		tempCont.release();
	});
});

//Check for valid inputs
var checkInput = function(input, type, callback) {
	
	var returnVal = null;
	
	switch(type) {
		
		case "username":
			var re = /^[a-z|\d]{5,20}$/i; // Format 5-20 characters and digit
			returnVal = re.test(input);
			break;

		case "password":
			 var re= /[a-z\d]{32}$/;
			 returnVal= re.test(input);
			
		case "email":
			var re = /^[a-z\d]{1,20}@[a-z]{1,10}(.[a-z]{3}){1,2}$/i; // Format 1-20 character @ 1-10 characters . extension
			returnVal = re.test(input);
			break;

		case "emailsearch":
			var re = /[[a-z\d]*@*(\.{0,1}[a-z]*)*$/i;
			returnVal = re.test(input);
			break;
			
		case "name":
			var re = /^[a-z]{1,20}$/i; // Format 20 characters
			returnVal = re.test(input);
			break;
			
		case "phone":
			var re = /(1){0,1}\d{10}$/i; // Format 18004445555 | 4074445555
			var number = input.replace(/[^\d]/g, '');
			
			returnVal = re.test(number);
			break;
		
		default:
			returnVal = null;
			break;
	}
	
	if(callback == undefined) {	
		return returnVal;
		
	} else {
		callback(returnVal);
	}
}

//app.listen(PORT);
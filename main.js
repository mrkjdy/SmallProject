const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const PORT = process.env.PORT || 5000;
const session = require('express-session');
var app = express();
var path = require('path');
// const app = express();

// body-parser initialization
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

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


// Login page
app.post('/login', function(req, res) {
	console.log('form submitted');
	// // Create connection to database
	// db.getConnection(function(err, tempCont){
			
	// 	// Check if correct format
	// 	if(checkInput(req.body.value, "username")) {
						
	// 		// Search for username and password in database
	// 		tempCont.query("SELECT UserId FROM users WHERE Login = ? AND Password = ?", [req.body.username, req.body.password], function(err, result) { //Check why bolded
						
	// 			// Check if query works
	// 			if (err) {
	// 				res.status(400).send('Query Fail');
	// 			} else {
						
	// 				// Check if username and password is in the database
	// 				if(result == "") {
	// 					res.send({ "UserId": 0 });
	// 				} else {
	// 					res.send(result);
	// 				}	
	// 			}				        
	// 		});				
				
	// 	} else {
	// 		res.status(400).send('Invalid Values');
	// 	}
			
	// 	// End connection
	// 	tempCont.release();
	
	// });
});


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
	
	// Check if user is logged on
	if(req.body.userid < 1){
		res.status(400).send('User not logged in');
	} else {
	
		// Check if correct format
		if(checkInput(req.body.firstname, "name") && checkInput(req.body.lastname, "name") && checkInput(req.body.phone, "phone") && checkInput(req.body.email, "email")) {
			
			// Create connection to database
			db.getConnection(function(err, tempCont){
			
				// Error if connection is not established
				if(err) {
					res.status(400).send('Connection Fail');
			
				} else {
				
					// Add contact to database, Might need a parseInt method if UserId is parsed as a string
					const sqlAddContact = "INSERT INTO contact (UserId, FirstName, LastName, PhoneNumber, Email) VALUES (";
					tempCont.query(sqlAddContact + req.body.userid + ", '" + req.body.firstname + "', '" + req.body.lastname + "', '" + req.body.phone + "', '" + req.body.email + "')", function(err, result){
					
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
	}
});

// Delete Contact
app.post('/deletecontact', function(req, res) {
	
	// Check if user is logged on
	if(req.body.userid < 1){
		res.status(400).send('User not logged in');
	} else {
	
		// Create connection to database
		db.getConnection(function(err, tempCont){
			
			// Error if connection is not established
			if(err) {
				res.status(400).send('Connection fail');
				
			} else { 
			
				// Delect contact from database, Might need a parseInt method if UserId and ContactId is parsed as a string
				const sqlDeleteContact = "Delete FROM contact WHERE UserID = ? AND ContactId = ?";
				tempCont.query(sqlDeleteContact,[req.body.userid, req.body.contactid], function(err, result) {
					
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
	}
});

// Search Contact
app.post('/searchcontact', function(req, res) {
	
	// Check if user is logged on
	if(req.body.userid < 1){
		res.status(400).send('User not logged in');
	} else {
	
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
							tempCont.query("SELECT * FROM contact WHERE FirstName = ?",["'" + req.body.firstname + "'"], function(err, result) {
								
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
							tempCont.query("SELECT * FROM contact WHERE UserId = ? AND LastName = ?",[req.body.userid, req.body.lastname], function(err, result) {
								
								// Check if query fail
								if (err) {
									res.status(400).send('Query Fail');
								} else {
									res.send(result);
								}			        
							});	
						} 

						else {
							res.status(400).send('Invalid Values');
						}
						
						break;
						
					// Searching by phone number
					case "phone":
					
						// Check if correct format
						if(checkInput(req.body.value, req.body.type)) {
							
							// Search for phone number in database
							tempCont.query("SELECT * FROM contact WHERE UserId = ? AND PhoneNumber = ?",[req.body.userid, req.body.phone], function(err, result){
								
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
						if(checkInput(req.body.value, req.body.type)) {
							
							// Search for email in database
							tempCont.query("SELECT * FROM contact WHERE UserId = ? AND Email = ?",[req.body.userid, req.body.email], function(err, result) {
								
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
	}
});

//Check for valid inputs
var checkInput = function(input, type, callback) {
	
	var returnVal = null;
	
	switch(type) {
		
		case "username":
			var re = /^[a-z|\d]{5,20}$/i; // Format 5-20 characters and digit
			returnVal = re.test(input);
			break;
			
		case "email":
			var re = /^[a-z\d]{1,20}@[a-z]{1,10}(.[a-z]{3}){1,2}$/i; // Format 1-20 character @ 1-10 characters . extension
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
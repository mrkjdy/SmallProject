var APIRoot; // Url
var fileExtension; // .php example
var contactsURL;
var loginURL;

var userID = 0;
var firstName = "";
var lastName = "";

function login()
{
	userID = 0;
	firstName = 0;
	lastName = 0;

	var user = document.getElementById("uName").value;
	var pass = document.getElementById("pWord").value;

	// Hash Password
	// End

	//TODO: add an error message element to login page
	document.getElementById("submitMessage").innerHTML = "";

	// Create JSON pacage 
	var jsonPayload = '{"login" : "' + user + '", "password" : "' + pass + '"}';
	var url = APIRoot + '/login.' + fileExtension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		// send pacage to API
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse(xhr.responseText);

		userID = jsonObject.id;

		//check wether login was succesfull
		if (userID < 1)
		{
			document.getElementById("submitMessage").innerHTML = "User or Password incorrect";
			return;
		}

		// firstName = jsonObject.firstName;
		// lastName = jsonObject.lastName;

		document.getElementById("uName").value = "";
		document.getElementById("pWord").value = "";

		// redirection code
		document.location.href = contactsURL;
	}
	catch(err)
	{
		document.getElementById("submitMessage").innerHTML = err.message;
	}
	// End

	// test the function is running: alert("Login()");
}

function addContact()
{
	var fName = document.getElementById("fName").value;
	var lName = document.getElementById("lName").value;
	var eMail = document.getElementById("eMail").value;
	var pNum = document.getElementById("pNum").value;

	// document.getElementById("contactAddResult").innerHTML = "";

	// Create JSON pacage and send it to API
	var jsonPayload = '{"firstname" : "' + fName + '", "lastname" : "'
						+ lName + '", "email" : "' + eMail 
						+ '", "phone" : "' + pNum + '"userid" : "' 
						+ userID + '"}';

	var url = APIRoot + '/AddContact.' + fileExtension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				//document.getElementById("contactAddResult").innerHTML = "Contact succesfully added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("contactAddResult").innerHTML = err.message;
	}
	// End

	// test the function is running: alert("addContact()");
}

function searchContact()
{
	var fName = document.getElementById("fName").value;
	var lName = document.getElementById("lName").value;

	// document.getElementById("colorSearchResult").innerHTML = "";

	var contactTable = document.getElementById("cTable");
	// Clear the table

	// Create JSON pacage and send it to API
	var jsonPayload = '{"firstname" : "' + fName + '", "lastname" : "'
						+ lName + '"}';
	var url = urlBase + '/SearchContact' + fileExtension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
			}
		};
		xhr.send(jsonPayload);
	}
	catch
	{
		
	}
	// End

	// Update the table on the website
	// End

	// test the function is running: alert("searchContact()");
}

function deleteContact(index)
{
	// I think this is how you would acces each element on the
	// specific row we want to delete
	var fName = document.getElementById("cTable").rows[index].cells[0].value;
	var lName = document.getElementById("cTable").rows[index].cells[1].value;
	var eMail = document.getElementById("cTable").rows[index].cells[2].value;
	var pNum = document.getElementById("cTable").rows[index].cells[3].value;

	// Create JSON pacage and send it to API
	// End

	// Update the table on the website
	// End

	// test the function is running: alert("deleteContact()");
}

function logout()
{
	// Return to login page and end the session
	userID = 0;
	firstName = "";
	lastName = "";

	document.location.href = loginURL;
	// End

	// test the function is running: alert("logout()");
}

function createAccount()
{
	var newPWord1 = document.getElementById("newPWord1").value;
	var newPWord2 = document.getElementById("newPword2").value;
	
	// Check if username available

		// if not available print status message
		// document.getElementById("submitMessage").innerHTML = "Username not available";
		// return;

	// Check if passwords match
	if (newPWord1 != newPWord2)
	{
		document.getElementById("submitMessage").innerHTML = "Passwords don't match";
		return;
	}


	// Create the account

	// set username and password then login
	document.getElementById("uName").value = document.getElementById("newUName").value;
	document.getElementById("pWord").value = newPWord1;
	login();
}

function showCreateAccount()
{
	document.getElementById("loginForm").style.display = "none";
	document.getElementById("createAccountPrompt").style.display = "none";
	document.getElementById("createAccountForm").style.display = "block";
	document.getElementById("loginPrompt").style.display = "block";
	document.getElementById("newUName").focus();
}

function showLogin()
{
	document.getElementById("loginForm").style.display = "block";
	document.getElementById("createAccountPrompt").style.display = "block";
	document.getElementById("createAccountForm").style.display = "none";
	document.getElementById("loginPrompt").style.display = "none";
	document.getElementById("uName").focus();
}

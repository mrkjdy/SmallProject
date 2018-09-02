var APIRoot; // Url
var fileExtension; // .php example
var userID = 0;
var firstName = '', lastName = '';

function login()
{
	var user = document.getElementById("uName").value;
	var pass = document.getElementById("pWord").value;

	// Create JSON pacage and send it to API
	// End

	// Check wether the credentials were correct, manage redirection and
	// store user id name and pass for later addition or deletion of contacts
	// End

	// test the function is running: alert("Login()");
}

function addContact()
{
	var fName = document.getElementById("fName").value;
	var lName = document.getElementById("lName").value;
	var eMail = document.getElementById("eMail").value;
	var pNum = document.getElementById("pNum").value;

	// Create JSON pacage and send it to API
	// End

	// test the function is running: alert("addContact()");
}

function searchContact()
{
	var fName = document.getElementById("fName").value;
	var lName = document.getElementById("lName").value;

	// Create JSON pacage and send it to API
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
	var lName = document.getElementById("cTable").rows[index].cells[0].value;
	var eMail = document.getElementById("cTable").rows[index].cells[0].value;
	var pNum = document.getElementById("cTable").rows[index].cells[0].value;

	// Create JSON pacage and send it to API
	// End

	// Update the table on the website
	// End

	// test the function is running: alert("deleteContact()");
}

function logout()
{
	// Return to login page and end the session
	// End

	// test the function is running: alert("logout()");
}
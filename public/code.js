var APIRoot = 'https://small-project-cop4331.herokuapp.com'; 
var fileExtension = '.js'; 
var contactsURL = 'contacts.html';
var loginURL = 'index.html';

var userID = 0;
var firstName = "";
var lastName = "";

function login()
{

	var user = document.getElementById("uName").value;
	var pass = document.getElementById("pWord").value;

	// Hash Password
	pass = calcMD5(pass);
	// End

	//TODO: add an error message element to login page
	document.getElementById("submitMessage").innerHTML = "";

	// Create JSON pacage 
	var jsonPayload = '{"username" : "' + user + '", "password" : "' + pass + '"}';
	var url = "/login" //+ 'small-project-cop4331.herokuapp.com:5000'; //+ fileExtension;

	//alert(jsonPayload);

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		console.log("test!");

		console.log("test1");

		xhr.onreadystatechange = function() {
    		if (this.readyState == 4 && this.status == 200) {
        		var jsonObject = JSON.parse(this.responseText);
        		//console.log("woooooo");
    		
    			//console.log("test2");

				userID = jsonObject.UserID;

				//localStorage.setItem(jsonObject.UserID, userID);

				console.log(userID);

				//check wether login was succesfull
				if (userID == 0)
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
		};

		// send pacage to API
		xhr.send(jsonPayload);
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
	var fName = document.getElementById("newFirstName").value;
	var lName = document.getElementById("newLastName").value;
	var eMail = document.getElementById("newEmail").value;
	var pNum = document.getElementById("newPhone").value;

	// document.getElementById("contactAddResult").innerHTML = "";

	console.log(userID);

	// Create JSON pacage and send it to API
	var jsonPayload = '{"firstname" : "' + fName + '", "lastname" : "'
						+ lName + '", "email" : "' + eMail 
						+ '", "phone" : "' + pNum + '", "userid" : ' 
						+ userID + '}';

	console.log(jsonPayload);

	var url = '/addcontact';

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
	var sString = document.getElementById("searchString").value;
	var sValue = document.getElementById("sBox").value;

	// document.getElementById("colorSearchResult").innerHTML = "";

	var contactTable = document.getElementById("cTable");
	// Clear the table

	// Create JSON pacage and send it to API
	var jsonPayload = '{"value" : "' + sString + '", "type" : "' + sValue + '", "userid" : ' 
						+ userID + '}';
	var url = APIRoot + '/searchcontact' + fileExtension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var table = document.getElementById("cTable");

				// clear the table
				while (table.length > 1)
				{
					table.deleteRow(table.length - 1);
				}

				var jsonObject = JSON.parse(xhr.responseText);

				// create the fields in the table 
				for(var i = 0; i < jsonObject.length; i++)
				{
					// create a new row
					var newRow = table.insertRow(table.length);

					// create a new cell
					var cell = newRow.insertCell(0);
					// add value to the cell
					cell.innerHTML = jsonObject[i].firstname;

					cell = newRow.insertCell(1);
					cell.innerHTML = jsonObject[i].lastname;
					cell = newRow.insertCell(2);
					cell.innerHTML = jsonObject[i].email;
					cell = newRow.insertCell(3);
					cell.innerHTML = jsonObject[i].phone;
					cell = newRow.insertCell(4);

					// Creates the X button to delete the contact TODO: revise
					cell.innerHTML = '<li class="w3-display-container">ListItem1 <span onclick="this.parentElement.style.display=\'none\'" class="w3-button w3-display-right">&times;</span> </li>';
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		
	}
	// End

	// test the function is running: alert("searchContact()");
}

function deleteContact(index)
{
	// I think this is how you would acces each element on the
	// specific row we want to delete
	var fName = document.getElementById("cTable").rows[index].cells[0].innerHTML;
	var lName = document.getElementById("cTable").rows[index].cells[1].innerHTML;
	var eMail = document.getElementById("cTable").rows[index].cells[2].innerHTML;
	var pNum = document.getElementById("cTable").rows[index].cells[3].innerHTML;

	// Create JSON pacage and send it to API
	var jsonPayload = '{"firstname" : "' + fName + '", "lastname" : "'
						+ lName + '", "email" : "' + eMail 
						+ '", "phone" : "' + pNum + '", "userid" : ' 
						+ userID + '}';

	var url = APIRoot + '/deletecontact' + fileExtension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.send(jsonPayload);
	}
	catch(err)
	{

	}
	// End

	// Update the table on the website
	table.deleteRow(index);
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
	var user = document.getElementById("newUName").value;
	var newPWord1 = document.getElementById("newPWord1").value;
	var newPWord2 = document.getElementById("newPword2").value;

	if (user == "")
	{
		document.getElementById("submitMessage").innerHTML = "Enter a user name";
		return;
	}

	// Check if passwords match
	if (newPWord1 !== newPWord2)
	{
		document.getElementById("submitMessage").innerHTML = "Passwords don't match";
		return;
	}

	newPWord1 = calcMD5(newPWord1);

	// Check if username available
	var jsonPayload = '{"username" : "' + user + '", "password" : "' + newPWord1 + '"}';
	var url = '/register'; //+ fileExtension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{

		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("uName").value = user;
				document.getElementById("pWord").value = newPWord2;
				login();
			}
			else if (this.status == 400)
			{
				document.getElementById("submitMessage").innerHTML = "Username already used";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		// return error mesage
	}

	// set username and password then login
}

function showCreateAccount()
{
	document.getElementById("loginForm").style.display = "none";
	document.getElementById("createAccountPrompt").style.display = "none";
	document.getElementById("createAccountForm").style.display = "block";
	document.getElementById("loginPrompt").style.display = "block";
	document.getElementById("newUName").focus();
	document.getElementById("submitMessage").innerHTML = "";
}

function showLogin()
{
	document.getElementById("loginForm").style.display = "block";
	document.getElementById("createAccountPrompt").style.display = "block";
	document.getElementById("createAccountForm").style.display = "none";
	document.getElementById("loginPrompt").style.display = "none";
	document.getElementById("uName").focus();
	document.getElementById("submitMessage").innerHTML = "";
}


/*----------------------------------*/
/* JavaScript implementation of MD5 */
/*----------------------------------*/

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * Updated by Greg Holt 2000 - 2001.
 * See http://pajhome.org.uk/site/legal.html for details.
 */

/*
 * Convert a 32-bit number to a hex string with ls-byte first
 */
var hex_chr = "0123456789abcdef";
function rhex(num)
{
  str = "";
  for(j = 0; j <= 3; j++)
    str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
           hex_chr.charAt((num >> (j * 8)) & 0x0F);
  return str;
}

/*
 * Convert a string to a sequence of 16-word blocks, stored as an array.
 * Append padding bits and the length, as described in the MD5 standard.
 */
function str2blks_MD5(str)
{
  nblk = ((str.length + 8) >> 6) + 1;
  blks = new Array(nblk * 16);
  for(i = 0; i < nblk * 16; i++) blks[i] = 0;
  for(i = 0; i < str.length; i++)
    blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
  blks[i >> 2] |= 0x80 << ((i % 4) * 8);
  blks[nblk * 16 - 2] = str.length * 8;
  return blks;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally 
 * to work around bugs in some JS interpreters.
 */
function add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * These functions implement the basic operation for each round of the
 * algorithm.
 */
function cmn(q, a, b, x, s, t)
{
  return add(rol(add(add(a, q), add(x, t)), s), b);
}
function ff(a, b, c, d, x, s, t)
{
  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t)
{
  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t)
{
  return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t)
{
  return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Take a string and return the hex representation of its MD5.
 */
function calcMD5(str)
{
  x = str2blks_MD5(str);
  a =  1732584193;
  b = -271733879;
  c = -1732584194;
  d =  271733878;

  for(i = 0; i < x.length; i += 16)
  {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;

    a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i+10], 17, -42063);
    b = ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = ff(d, a, b, c, x[i+13], 12, -40341101);
    c = ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = ff(b, c, d, a, x[i+15], 22,  1236535329);    

    a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = gg(c, d, a, b, x[i+11], 14,  643717713);
    b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = gg(c, d, a, b, x[i+15], 14, -660478335);
    b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = gg(b, c, d, a, x[i+12], 20, -1926607734);
    
    a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = hh(b, c, d, a, x[i+14], 23, -35309556);
    a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = hh(d, a, b, c, x[i+12], 11, -421815835);
    c = hh(c, d, a, b, x[i+15], 16,  530742520);
    b = hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i+10], 15, -1051523);
    b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = ii(d, a, b, c, x[i+15], 10, -30611744);
    c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = add(a, olda);
    b = add(b, oldb);
    c = add(c, oldc);
    d = add(d, oldd);
  }
  return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}

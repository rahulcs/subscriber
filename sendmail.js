var email = require("emailjs/email");
var http = require('http');
var url = require('url');
var path = require('path');
var querystring = require('querystring');
var usrName = '';
var passWrd = '';
var toAdd = '';
var argLength = process.argv.length;

if(argLength <= 3 || argLength > 5 || argLength === 4){
    console.log("Usage: node sendmail.js <username> <password> <to: address>");
    process.exit(1);
}

process.argv.forEach(function (val, index, array) {
    if(index === 2){
	usrName = val;
    } else if(index === 3){
	passWrd = val;
    } else if(index === 4){
	toAdd = val;
    }
});

var server = email.server.connect({
    user: usrName,
    password: passWrd,
    host: "smtp.gmail.com",
    ssl: true
});

http.createServer(function(req, res) {
    var uri = url.parse(req.url).pathname;
    res.writeHead(200, {'Content-Type': 'text/json'});
    if(uri === "/subscribe"){
	if(req.method === "POST"){
	    console.log('post');
	    var body = '';
	    req.on('data', function(chunk){
		body += chunk;
	    });
	    req.on('end', function(){
		console.log(body);
		var postData = querystring.parse(body);
		console.log(postData);
		var  mailText = 'New User Email ID: ' + postData.email;
		console.log(server, mailText, usrName, toAdd);
		server.send({
		    text: mailText,
		    from: "<"+usrName+">",
		    to: "<"+toAdd+">",
		    subject: "New User Notification",
		    attachment: [{
			data: "<html>"+mailText+"</html>",
			alternative: true
		    }]
		}, function(err, message){
		    if(err === null){
			res.end('_mailer(\'{"message": "Mail Sent successfully", "success": true}\')');
		    } else {
			res.end('_mailer(\'{"message": "Mail sending failed", "success": false}\')');
		    }
		});
	    });
	} else if(req.method === "GET"){
	    console.log('get');
	    var url_parts = url.parse(req.url, true);
	    var mailText = '';
	    mailText += 'New User Email ID: '+ url_parts.query.email;
	    mailText += '<br>' + 'First Name: ' + url_parts.query.firstName;
	    mailText += '<br>' + 'Last Name: ' + url_parts.query.lastName;
	    mailText += '<br>' + 'Phone: ' + url_parts.query.phone;
	    mailText += '<br>' + 'Organization: ' + url_parts.query.organization;
	    if(mailText !== ''){
		server.send({
		    text: mailText,
		    from: "<"+usrName+">",
		    to: "<"+toAdd+">",
		    subject: "New User Notification",
		    attachment: [{
			data: "<html>"+mailText+"</html>",
			alternative: true
		    }]
		}, function(err, message){
		    if(err === null){
			res.end('_mailer(\'{"message": "Mail Sent successfully", "success": true}\')');
		    } else {
			res.end('_mailer(\'{"message": "Mail sending failed", "success": false}\')');
		    }
		});
	    }
	}
    } else {
	res.end('_mailer(\'{"message": "Wrong URL", "success": false}\')');
    }
}).listen(6969);

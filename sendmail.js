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
	if(req.method === "POST" || req.method === "GET"){
	    console.log('post');
	    var body = '';
	    req.on('data', function(chunk){
		body += chunk;
	    });
	    req.on('end', function(){
		var postData = querystring.parse(body);
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
	}
    } else {
	res.end('_mailer(\'{"message": "Wrong URL", "success": false}\')');
    }
}).listen(6969);

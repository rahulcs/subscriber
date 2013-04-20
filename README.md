Subscriber
==========

A lightweight nodejs server for notifying new subscribers to your website.

Usage
=====

Usage: node sendmail.js <username> <password> <to: address>

Browser Action
==============

$.ajax({
        url: 'http://localhost:6969/subscribe',
        dataType: 'jsonp',
        jsonpCallback: '_mailer',
        cache: false,
        type: 'POST',
        data: {"email": "john.doe@gmail.com"}
}).always(function(data){
        console.log(data);
});

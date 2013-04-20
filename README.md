Subscriber
==========

A lightweight nodejs module for notifying new subscribers to your website.

Usage
=====

TO-DO

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

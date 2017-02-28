// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve your chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};


/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var url = require('url');
var fs = require('fs');
var qs = require('querystring');
// var data = require('./data');
console.log('Request Handler File');

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // Default status code
  var statusCode = 404;

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  
  if (parsedUrl.pathname !== '/classes/messages') {
    statusCode = 404;
    response.writeHead(statusCode);
    response.end();
  } else {
    // The outgoing status.
    if (request.method === 'GET') {
      statusCode = 200;
      
      // Read the messages
      fs.readFile('./data.json', function(err, contents) {
        var messages = JSON.parse(contents);
        console.log('Current Messages', messages);
        
        response.writeHead(statusCode, headers);  
        response.end(JSON.stringify(messages));
      });
    } else if (request.method === 'OPTIONS') {
      statusCode = 200;
      response.writeHead(statusCode, headers);

      response.end();
    } else if (request.method === 'POST') {
      
      var body = [];
      request.on('error', function(err) {
        console.error(err);
      }).on('data', function(chunk) {
        body.push(chunk);
      }).on('end', function() {

        // Set successful status code
        statusCode = 201;

        // Get full body text
        body = Buffer.concat(body).toString();
        
        // Parse it to a message object
        var newMessage = qs.parse(body);

        // Read the file
        fs.readFile('./data.json', function(err, contents) {
          // Parse the file
          var messages = JSON.parse(contents);
          
          console.log('Current Messages', messages);
          
          // Push the messages array
          messages.results.push(newMessage);

          // Stringify the object
          var updatedMessages = JSON.stringify(messages);
          console.log(updatedMessages);

          // Overwrite the current file
          fs.writeFile('./data.json', updatedMessages, err => {
            if (err) {
              throw err;
            }
            // Send the response with the messages
            response.writeHead(statusCode, headers);  
            response.end(JSON.stringify(messages));
          });
        });
      });
    }    
  }

  // console.log(statusCode);



  // Craft Header
  // Excuted before async code
  // var headers = defaultCorsHeaders;
  // headers['Content-Type'] = 'application/json';
  // response.writeHead(statusCode, headers);

  //response.end(console.log('Hello world'));

  // fs.readFile('./data.json', function(err, contents) {
  //   var messages = JSON.parse(contents);
  //   console.log('Testing if message was pushed', messages.results);
  //   console.log(messages, 1);
  //   // console.log(newMessage);
  //   response.end(JSON.stringify(messages));
  // });

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.


  // response.end(JSON.stringify(data));
};


exports.requestHandler = requestHandler;

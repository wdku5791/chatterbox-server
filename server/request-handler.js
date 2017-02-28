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
  var parsedUrl = url.parse(request.url);

  console.log('Path name', parsedUrl.pathname);
  console.log('Query', parsedUrl.search);
  console.log('url', request.url);
  // HANDLING REQUEST
  // var body = [];
  // request.on('error', function(err) {
  //   console.error(err);
  // }).on('data', function(chunk) {
  //   body.push(chunk);
  // }).on('end', function() {
  //   body = Buffer.concat(body).toString();
  //   // At this point, we have the headers, method, url and body, and can now
  //   // do whatever we need to in order to respond to this request.
  // });



  var statusCode = 404;

  if (parsedUrl.pathname !== '/classes/messages') {
    statusCode = 404;
  } else {
    // The outgoing status.
    if (request.method === 'GET') {
      statusCode = 200; 
    } else if (request.method === 'OPTIONS') {
      statusCode = 200;
    } else if (request.method === 'POST') {
      statusCode = 201;
    }    
  }

  console.log(statusCode);

  var body = [];
  request.on('error', function(err) {
    console.error(err);
  }).on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();
    console.log('Body', body);
    var newMessage = qs.parse(body);
    console.log(newMessage);
  });


  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // var responseBody = {
  //   headers: headers,
  //   method: request.method,
  //   url: request.url,
  //   body: JSON.stringify(data)
  // };

  fs.readFile('./data.json', function(err, contents) {
    var messages = JSON.parse(contents);
    console.log('Testing if message was pushed', messages.results);
    console.log(messages, 1);
    // console.log(newMessage);
    response.end(JSON.stringify(messages));
  });

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

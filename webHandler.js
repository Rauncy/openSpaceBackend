const http = require('http');
const fs = require('fs');

var server;
var configs = {};

function onRequest(request, response){
  console.log();
  console.log("User made a request for " + request.url);
  if (request.url.startsWith("/_get/")) {

    //for data
    //http://site.com/_db?id=dwhdbwabdaw&data=23
    console.log(`database access with raw of ${request.url}`);
  } else if (request.url.startsWith("/_set")) {
      var query = request.url.substring(request.url.indexOf("?"));
      console.log(`tried to set ${query}`)
  } else{

    //Asset is Javascript or CSS
    console.log(`Loading asset with directory of ${request.url}`);
    var page = "/site";
    if(request.url.endsWith(".css")){
      response.setHeader('Content-Type', 'text/css');
      console.log("CSS");
    } else if(request.url.endsWith(".js")){
      console.log("JS");
      response.setHeader('Content-Type', 'application/javascript');
    } else {
      console.log("HTML");
      page = loadHTML(request.url, response);
      response.write(page);
      response.end();
      return;
    }

    var path = request.url//request.url.substring(7, request.url.length);
    try {
      page = fs.readFileSync(`./site${path}`, "UTF-8");
      response.writeHead(200);
    } catch(err) {
      console.log("Asset Error");
      console.log(`./site${path}`)
      page = "Asset does not exist";
      response.setHeader('Content-Type', 'text/plain');
      response.writeHead(404);
    }
    //Is HTML page
  }
  response.write(page);
  response.end();
}

function loadHTML(url, res){
  var page;

  res.setHeader('Content-Type', 'text/html');

  var path;

  //If has with illegal characters
  if (url.includes("^") || url.includes("_")) {
    res.writeHead(404);
    path = fs.readFileSync("./_assets/404.html", "UTF-8");
    console.log(`Data404 : ${url}`);
  } else {
    //Check for non index Files
    try {
      console.log(`/site${url}/index.html : ${url}`);
      path = fs.readFileSync(`./site${url}/index.html`, "UTF-8");
      res.writeHead(200);
    } catch(nie) {
      //Check for index files
      try{
        console.log(`/site${url}.html : ${url}`);
        path = fs.readFileSync(`./site${url}.html`, "UTF-8");
        res.writeHead(200);
      }catch(err){
        //Return 404;
        res.writeHead(404);
        path = fs.readFileSync("./_assets/404.html");
        console.log(`DNE404 : ${url}`);
      }
    }
  }
  return path;
}


server = http.createServer(onRequest);
server.listen(3000);
console.log("Server is now running...");

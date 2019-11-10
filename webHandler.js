const http = require('http');
const fs = require('fs');
const crypto = require('crypto');
const hash = crypto.createHash('md5');

var approvedUsers = fs.readFileSync("approvedUsers.json");
approvedUsers = JSON.parse(approvedUsers);

var server;
var configs = {};

function onRequest(request, response){
  console.log();
  console.log("User made a request for " + request.url);
  var content = "/site";
  if (request.url.startsWith("/_get/")) {
    var data = fs.readFileSync("data.json");
    content = data;
    response.setHeader('Content-Type', 'text/json');
    response.write(content);
    response.end();
    return;

    console.log(`Database access with raw of ${request.url}`);
  } else if (request.url.startsWith("/_set?")) {
      var query = request.url.split("?")[1].split("&");
      var id = q2[0].split("=")[1];
      var newValue = q2[1].split("=")[1];

      if (approvedUsers[id]) {
        var user = approvedUsers[id];
        var data = JSON.parse(fs.readFileSync("data.json"));
        data[user["building"]][user["room"]] = newValue;
        fs.writeFileSync("data.json", JSON.stringify(data));
      }
  } else{
    //Asset is Javascript or CSS
    console.log(`Loading asset with directory of ${request.url}`);
    if(request.url.endsWith(".css")){
      response.setHeader('Content-Type', 'text/css');
      console.log("CSS");
    } else if(request.url.endsWith(".js")){
      console.log("JS");
      response.setHeader('Content-Type', 'application/javascript');
    } else {
      console.log("HTML");
      content = loadHTML(request.url, response);
      response.write(content);
      response.end();
      return;
    }

    var path = request.url//request.url.substring(7, request.url.length);
    try {
      content = fs.readFileSync(`./site${path}`, "UTF-8");
      response.writeHead(200);
    } catch(err) {
      console.log("Asset Error");
      console.log(`./site${path}`)
      content = "Asset does not exist";
      response.setHeader('Content-Type', 'text/plain');
      response.writeHead(404);
    }
    //Is HTML content
  }
  response.write(content);
  response.end();
}

function loadHTML(url, res){
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

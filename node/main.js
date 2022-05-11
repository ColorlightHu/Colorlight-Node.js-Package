/*var express = require("express");
var app = express();
var fs = require("fs");
var request = require("request");

app.get("/", function(req, res) {
 //calling request function
 request("https://www.google.com", function(error, response, body) {
   if (!error && response.statusCode == 200) {
     // writing the response to a file named data.html
     // fs.writeFileSync("data.html", body);
   }
 });
});

app.listen(3000, function() {
 console.log("Node server is running..");
});*/

var colorlightController = require('./colorlight-node')
var colorlightConnector = new colorlightController.colorlightConnector("asd");
console.log(colorlightConnector.getStatus().version)

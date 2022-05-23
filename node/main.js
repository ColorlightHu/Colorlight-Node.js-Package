/* ColorlightConnector = require('./colorlight-node')

const connector = ColorlightConnector.connect("192.168.1.37",()=>{console.log("Connected")},()=>{console.log("Error")})


console.log(connector)*/

/*var colorlightController = require('./colorlight-node')
var colorlightConnector = new colorlightController.colorlightConnector("192.168.1.37");

const onConnected = (status)=>{
	console.log(colorlightConnector)
}

colorlightConnector.connect(
	onConnected,
	()=>{console.log("Connection failed")},
	()=>{console.log("Connection lost")})*/


const ColorlightConnection = require('./colorlight-node').connection;
const connection = new ColorlightConnection("192.168.8.127");
const controller = connection.controller;

console.log(controller.info.serial)
console.log(controller.status.memory)
console.log(controller.program.activeProgram)

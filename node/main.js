const Connection = require('./colorlight-node').todotestConnection
const testConnection = new Connection();
const testController = testConnection.controller;

console.log(testController.info.model)
console.log(testController.info.serial)
console.log(testController.info.version)

console.log(testController.status.uptime)
console.log(testController.status.memory.usage)
console.log(testController.status.storage.usage)

console.log(testController.program.activeProgram.name)
const programNameList = testController.program.programNameList
for(let i = 0; i < programNameList.length; i++){
    console.log(programNameList[i])
}
console.log(testController.program.programList)

/*var colorlightController = require('./colorlight-node')
var colorlightConnector = new colorlightController.colorlightConnector("192.168.1.37");

const onConnected = (status)=>{
	console.log(colorlightConnector)
}

colorlightConnector.connect(
	onConnected,
	()=>{console.log("Connection failed")},
	()=>{console.log("Connection lost")})*/
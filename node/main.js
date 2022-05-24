const ColorlightConnection = require('./colorlight-node').connection;
const controller1 = new ColorlightConnection("192.168.8.134").controller;
const controller2 = new ColorlightConnection("192.168.8.133").controller;


console.log("active: " + controller1.program.activeProgram.name)
const programList = controller1.program.programList
controller1.program.activeProgram = programList[0]
console.log("active: " + controller1.program.activeProgram.name)

console.log(controller1.program.programNameList)
console.log(controller2.program.programNameList)



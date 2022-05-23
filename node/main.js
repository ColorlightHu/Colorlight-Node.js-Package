const ColorlightConnection = require('./colorlight-node').connection;
const connection = new ColorlightConnection("192.168.8.127");
const controller = connection.controller;


console.log("active: " + controller.program.activeProgram.name)
const programList = controller.program.programList
controller.program.activeProgram = programList[1]
console.log("active: " + controller.program.activeProgram.name)



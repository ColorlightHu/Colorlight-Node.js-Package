const ColorlightConnection = require('./colorlight-node').connection;
const controller = new ColorlightConnection("192.168.8.133").controller;

console.log(controller.program.activeProgram)

controller.program.activeProgram = controller.program.programList[1];





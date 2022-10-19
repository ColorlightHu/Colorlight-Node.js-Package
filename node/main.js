const ColorlightConnection = require('./colorlight-node');
const controller = new ColorlightConnection("192.168.1.37").controller;

console.log(controller.program.activeProgram)

controller.program.activeProgram = controller.program.programList[1];





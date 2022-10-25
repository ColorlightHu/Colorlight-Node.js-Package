const Colorlight = require('./colorlight-node');
const controller = Colorlight.connect("192.168.1.37");

const activeProgram = controller.program.activeProgram
const programList = controller.program.programList
controller.program.activeProgram = programList[2];

console.log(controller.program.activeProgram)
console.log(controller.program.programNameList)

controller.program.activeProgram = controller.program.programList[1];

const Colorlight = require('./colorlight-node');
const controller = Colorlight.connect("192.168.1.37");

const activeProgram = controller.program.activeProgram
const programList = controller.program.programList

console.log(controller.program.programNameList)

for (let i=0; i<programList.length; i++){
    controller.program.delete(programList[i])
}

const singleLineTextProgram = new Colorlight.SingleLineText("ASD",0,0,900,80);

controller.program.singleLineProgram = singleLineTextProgram;

const ColorlightConnection = require('../colorlight-node').connection;
const controller = new ColorlightConnection("192.168.8.134").controller;


describe("Status processing",() =>{
    test("Uptime",() =>{
        expect(controller.status.uptime).toBeGreaterThan(0)
    })
    test("Memory",() =>{
        const memory = controller.status.memory;
        const free = memory.free;
        const total = memory.total;
        const usage = memory.usage;
        expect(total).toBeGreaterThan(0);
        expect(free).toBeLessThan(total);
        const calcUsage = free / total;
        expect(usage).toEqual(calcUsage);
    })
})

describe("Program list processing",() =>{
    test("Active program name",() =>{
        expect(controller.program.activeProgram.name).toBe("TestProgram0.vsn")
    })
    test("Active program type",() =>{
        expect(controller.program.activeProgram.type).toBe("lan")
    })
    test("ProgramNameList",() =>{
        expect(controller.program.programNameList).toEqual(["TestProgram0.vsn","TestProgram1.vsn"])
    })
    /*test("",() =>{
        expect(controller.program.).toBe()
    })*/
})
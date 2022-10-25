const ColorlightControllerConnection = require("./colorlight-node").Connection;

const ip = "192.168.1.37"

const hwcontroller = new ColorlightControllerConnection(ip).controller

describe("HIL tests",() =>{
    test("Version",() =>{
        expect(hwcontroller.info.version).toMatch(/\d+\.\d+\.\d+/)
    })
    test("Serialno",() =>{
        expect(hwcontroller.info.serial).toMatch(/CLC........./)
    })
    test("Model",() =>{
        expect(hwcontroller.info.model).toMatch(/.+/)
    })
    test("Uptime",() =>{
        expect(hwcontroller.status.uptime).toBeGreaterThan(0)
    })
    test("Memory",() =>{
        const memory = hwcontroller.status.memory;
        const total = memory.total;
        const free = memory.free;
        const usage = memory.usage;

        expect(total).toBeGreaterThan(0)
        expect(free).toBeLessThan(total)
        expect(usage).toBeCloseTo(1-(free/total))
    })
    test("Storage",() =>{
        const storage = hwcontroller.status.storage;
        const total = storage.total;
        const free = storage.free;
        const usage = storage.usage;

        expect(total).toBeGreaterThan(0)
        expect(free).toBeLessThan(total)
        expect(usage).toBeCloseTo(1-(free/total))
    })
    test("Active program",() =>{
        const activeProgram = hwcontroller.program.activeProgram;
        expect(activeProgram.name).toMatch(/.+\.vsn/)
        //expect(activeProgram.type).toDO
    })
    test("Active program type",() =>{
        expect(hwcontroller.program.activeProgram.type).toBe("lan")
    })
})

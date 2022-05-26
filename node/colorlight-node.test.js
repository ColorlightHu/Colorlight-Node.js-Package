const ip = "192.168.8.133"

const ColorlightControllerConnection = require('./colorlight-node')

class DummyColorlightControllerConnection extends ColorlightControllerConnection{
    constructor() {
        super(null);
    }
    get infoJSON(){
        return JSON.parse(
            '{\n' +
            '		"info": {' +
            '			"vername": "1.64.6", ' +
            '			"serialno": "CLCC4000A008", ' +
            '			"model": "c4", ' +
            '			"up": 9989856, ' +
            '			"mem": {\n' +
            '				"total": 1073741824, ' +
            '				"free": 778567680\n' +
            '			}, ' +
            '			"storage": {\n' +
            '				"total": 5878841344, ' +
            '				"free": 5878644736\n' +
            '			},' +
            '			"playing": {\n' +
            '				"name": "new.vsn", ' +
            '				"path": "/mnt/sdcard/Android/data/com.color.home/files/Ftp/program", ' +
            '				"source": "lan" ' +
            '			}\n' +
            '		}' +
            '	}'
        );
    }
    get programStatusJSON(){
        return JSON.parse(
            "{\n" +
            "    \"contents\": [\n" +
            "        {\n" +
            "            \"content\": [\n" +
            "                {\n" +
            "                    \"ableToEdit\": false,\n" +
            "                    \"lastModifiedTime\": 1653232459000,\n" +
            "                    \"md5\": \"\",\n" +
            "                    \"name\": \"TestProgram0.vsn\",\n" +
            "                    \"publishedmd5\": \"\",\n" +
            "                    \"size\": 9030\n" +
            "                },\n" +
            "                {\n" +
            "                    \"ableToEdit\": false,\n" +
            "                    \"lastModifiedTime\": 1653232433000,\n" +
            "                    \"md5\": \"\",\n" +
            "                    \"name\": \"TestProgram1.vsn\",\n" +
            "                    \"publishedmd5\": \"\",\n" +
            "                    \"size\": 6015\n" +
            "                }\n" +
            "            ],\n" +
            "            \"type\": \"lan\"\n" +
            "        },\n" +
            "        {\n" +
            "            \"content\": [],\n" +
            "            \"ressize\": 0,\n" +
            "            \"type\": \"internet\",\n" +
            "            \"unused\": 0\n" +
            "        }\n" +
            "    ],\n" +
            "    \"playing\": {\n" +
            "        \"name\": \"TestProgram0.vsn\",\n" +
            "        \"type\": \"lan\"\n" +
            "    }\n" +
            "}"
        )
    }

    set activeProgram(program){
        return true;
    }

    deleteProgram = jest.fn((program)=>{
        return true;
    });

}
const controller = new DummyColorlightControllerConnection().controller;

describe("Info processing",() =>{
    test("Version",() =>{
        expect(controller.info.version).toBe("1.64.6")
    })
    test("Serialno",() =>{
        expect(controller.info.serial).toBe("CLCC4000A008")
    })
    test("Model",() =>{
        expect(controller.info.model).toBe("c4")
    })
})

describe("Status processing",() =>{
    test("Uptime",() =>{
        expect(controller.status.uptime).toBe(9989856)
    })
    test("Free Memory",() =>{
        expect(controller.status.memory.free).toBe(778567680)
    })
    test("All Memory",() =>{
        expect(controller.status.memory.total).toBe(1073741824)
    })
    test("Memory %",() =>{
        expect(controller.status.memory.usage).toEqual(0.27490234375)
    })
    test("Free Storage",() =>{
        expect(controller.status.storage.free).toBe(5878644736)
    })
    test("All Storage",() =>{
        expect(controller.status.storage.total).toBe(5878841344)
    })
    test("Storage %",() =>{
        expect(controller.status.storage.usage).toEqual(0.00003344332471238741)
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
    test("Program Delete",()=>{
        controller.program.programList[0].delete();
        expect(controller.connection.deleteProgram.mock.calls.length).toBe(1)
    })
})

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
        const memory = controller.status.memory;
        const total = memory.total;
        const free = memory.free;
        const usage = memory.usage;

        expect(total).toBeGreaterThan(0)
        expect(free).toBeLessThan(total)
        expect(usage).toBeCloseTo(1-(free/total))
    })
    test("Storage",() =>{
        const storage = controller.status.storage;
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
        expect(controller.program.activeProgram.type).toBe("lan")
    })
})

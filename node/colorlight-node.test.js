const ColorlightController = require('./colorlight-node').ColorlightController

class DummyColorlightControllerConnection{
    constructor() {
        this.controller = new ColorlightController(this)
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
    get toastStatusJSON(){
        return JSON.parse("{\"showProgramToast\": 1}")
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
    get networkStatusJSON(){
        //TODO
    }
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
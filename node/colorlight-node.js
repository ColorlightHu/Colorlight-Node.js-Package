class ColorlightResource{
	constructor(total,free){
		this.t = total;
		this.f = free;
	}
	get total(){
		return this.t;
	}
	get free(){
		return this.f;
	}
	get used(){
		return this.t-this.f;
	}
	get usage(){
		return this.used/this.t;
	}

}

class ColorlightControllerConnection{ //TODO dummy
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
		return JSON.parse("{\n" +
			"\"playing\": {\n" +
			"\"type\": \"lan\", \"name\": \"new.vsn\" }, \"contents\": [\n" +
			"{\n" +
			"\"type\": \"lan\", \"content\": [\n" +
			"{\n" +
			"\"name\": \"12345.vsn\"\n" +
			"\"size\": 7665246, \"md5\": \"882024f3d5869aad992a58fec123a19c\"\n" +
			"\"publishedmd5\": \"8B2E1E8BE7588F7862A47DA9D7C7F670\" }, {\n" +
			"\"name\": \"256256.vsn\"\n" +
			"\"size\": 7665246, \"md5\": \"882024f3d5869aad992a58fec123a19c\"\n" +
			"\"publishedmd5\": \"8B2E1E8BE7588F7862A47DA9D7C7F670\" }\n" +
			"]\n" +
			"}, {\n" +
			"\"type\": \"usb-synced\", \"content\": [\n" +
			"{\n" +
			"\"name\": \"new.vsn\", \"size\": 7665246, \"md5\": \"882024f3d5869aad992a58fec123a19c\"\n" +
			"\"publishedmd5\": \"8B2E1E8BE7588F7862A47DA9D7C7F670\" }\n" +
			"]\n" +
			"}, {\n" +
			"\"type\": \"usb\", \"content\": [\n" +
			"{\n" +
			"\"name\": \"new.vsn\", \"size\": 7665246, \"md5\": \"882024f3d5869aad992a58fec123a19c\"\n" +
			"\"publishedmd5\": \"8B2E1E8BE7588F7862A47DA9D7C7F670\" }\n" +
			"]\n" +
			"}, {\n" +
			"\"type\": \"lan\", \"content\": [\n" +
			"{\n" +
			"\"name\": \"new.vsn\", \"size\": 11454370, \"md5\": \"eb896b2c17d5638f7fbd18db7d3e0c4\"\n" +
			"\"publishedmd5\": \"8B2E1E8BE7588F7862A47DA9D7C7F670\"\n" +
			"9\n" +
			"}\n" +
			"]\n" +
			"}\n" +
			"]\n" +
			"}")
	}
	get networkStatusJSON(){
		//TODO
	}
}
class ColorlightControllerInfo{
	constructor(controller) {
		this.controller = controller;
	}

	get version(){				//Version number of the device firmware
		return this.controller.connection.infoJSON.info.vername
	}
	get serial(){				//Serial number of the device
		return this.controller.connection.infoJSON.info.serialno
	}
	get model(){				//Model of the device
		return this.controller.connection.infoJSON.info.model
	}
}
class ColorlightControllerStatus{
	constructor(controller) {
		this.controller = controller;
	}

	get uptime(){				//Device uptime in milliseconds
		return this.controller.connection.infoJSON.info.up
	}
	get memory(){				//Device memory data objet
		const total = this.controller.connection.infoJSON.info.mem.total
		const free = this.controller.connection.infoJSON.info.mem.free
		return new ColorlightResource(total,free);
	}
	get storage(){				//Device storage data object
		const total = this.controller.connection.infoJSON.info.storage.total
		const free = this.controller.connection.infoJSON.info.storage.free
		return new ColorlightResource(total,free);
	}
}
class ColorlightControllerProgram{
	constructor(controller) {
		this.controller = controller;
	}
}
class ColorlightControllerSettings{
	constructor(controller) {
		this.controller = controller;
	}
}
class ColorlightController{
	constructor(connection) {
		this.connection = connection;
	}
	get info(){
		return new ColorlightControllerInfo(this)
	}
	get status(){
		return new ColorlightControllerStatus(this)
	}
	get program(){
		return new ColorlightControllerProgram(this)
	}
	get settings(){
		return new ColorlightControllerSettings(this)
	}
}

class ColorlightConnector{
	constructor(ip){
		this.ip=ip;
		this.laststatus = new ColorlightStatus(null);
		
		this.onlostc = null;
	}
	set onLostConnection(callback){
		this.onlostc = callback
	}
	connect(onConnected,onError,onLostConnection){
		var ststus = ""
		var firstpong = function(statusm){
			//this.laststatus = statusm;
			onConnected(statusm)
		}
		var pong = function(statusm){
			console.log(statusm.timestamp)
		}
		var err = ()=>{
			console.log("ERR")
		}
		var pingfactory = function(ip,onConnect,onError){
			return function(){
				const request = require("request");
				request("http://"+ip + "/api/info.json",
					function(error, response, body) {
					if (!error && response.statusCode == 200) {
						onConnect(new ColorlightStatus(body))
					}
					else{
						onError()
					}
				});
				return true;	//TODO
			}
		}
		const success = pingfactory(this.ip,firstpong,onError)()
		if(success){
			setInterval(pingfactory(this.ip,pong,err), 5000);
		}
	}
	disconnect(){
		
	}
	get status(){
		return this.laststatus;
	}
	
	
}
class ColorlightProgramStatus{
	//TODO
}

class ColorlightStatus{
	constructor(jsonText){
		this.statusJSON = JSON.parse(jsonText);
	}
	get version(){				//Version number of the device firmware
		try{
			var ret = this.statusJSON.info.vername;
		} catch(e){
			console.error(e)
			var ret = null;
		} finally {
			return ret
		}
	}
	get serial(){				//Serial number of the device
		try{
			var ret = this.statusJSON.info.serialno;
		} catch(e){
			console.error(e)
			var ret = null;
		} finally {
			return ret
		}
	}
	get model(){				//Model of the device
		try{
			var ret = this.statusJSON.info.model;
		} catch(e){
			console.error(e)
			var ret = null;
		} finally {
			return ret
		}
	}
	get millis(){				//Device uptime in milliseconds
		try{
			var ret = this.statusJSON.info.up
		} catch(e){
			console.error(e)
			var ret = 0;
		} finally {
			return ret
		}
	}
	get timestamp(){				//Device uptime in milliseconds
		try{
			var ret = require('pretty-ms')(this.statusJSON.info.up)
		} catch(e){
			console.error(e)
			var ret = 0;
		} finally {
			return ret
		}
	}
	get memory(){
		try{
			var ret = new ColorlightResource(this.statusJSON.info.mem.total,this.statusJSON.info.mem.free)
		} catch(e){
			console.error(e)
			var ret = new ColorlightResource();
		} finally {
			return ret
		}
	}
	get storage(){
		try{
			var ret = new ColorlightResource(this.statusJSON.info.storage.total,this.statusJSON.info.storage.free)
		} catch(e){
			console.error(e)
			var ret = new ColorlightResource();
		} finally {
			return ret
		}
	}
	get program(){
		//TODO
	}
}

module.exports.colorlightConnector = ColorlightConnector;

module.exports.todotestConnection = ColorlightControllerConnection;
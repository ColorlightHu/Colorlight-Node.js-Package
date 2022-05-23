const request = require("request");

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
class ColorlightProgramType{
	constructor(name) {
		this.name = name;
	}

	static stop = new ColorlightProgramType("stop")
	static lan = new ColorlightProgramType("lan")
	static internet = new ColorlightProgramType("internet")
	static usb = new ColorlightProgramType("usb")
	static usb_synced = new ColorlightProgramType("usb_synced")

	static read(text){
		switch (text){
			case "stop":
				return this.stop;
			case "lan":
				return this.lan;
			case "internet":
				return this.internet;
			case "usb":
				return this.usb;
			case "usb-synced":
				return this.usb_synced;
		}
	}

}
class ColorlightProgram{
	constructor(programJSON,type) {
		this.programJSON = programJSON
		this.programJSON.type = type;
	}

	get type(){
		return ColorlightProgramType.read(this.programType)
	}
	get name(){
		return this.programJSON.name
	}
	/*get path(){

	}
	get size(){

	}*/

}

class ColorlightControllerConnection{ //TODO dummy
	constructor() {
		this.controller = new ColorlightController(this)
		this.statusJSONText = ""
		this.programJSONText = ""
	}
	get infoJSON(){
		return JSON.parse()		//TODO
	}
	get toastStatusJSON(){
		return JSON.parse()		//TODO
	}
	get programStatusJSON(){
		return JSON.parse()		//TODO
	}
	get networkStatusJSON(){
								//TODO
	}

	pong(body){
		//this.statusJSONText = "body";
		console.log(this)
	}

	static connect(ip,onConnected,onError){
		/*const pingfactory = function(ip,onConnect,onError){
			return function(){
				const request = require("request");
				request("http://"+ip + "/api/info.json", responseHandlerFactory(onConnect,onError));
			}
		}*/

		const connector = new ColorlightControllerConnection();

		const firstpong = function(body){
			onConnected()
		}
		const error = ()=>{
			console.log("ERR")
		}
		requestFactory(ip,"info.json",responseHandlerFactory(connector.pong,onError))
		//pingfactory(ip,connector.pong,onError)()
		return connector
	}
}
class ColorlightControllerInfo{		// Static information about the controller device (firmware, serial, model)
	constructor(controller) {
		this.controller = controller;
	}

	get version(){					// Version number of the device firmware
		return this.controller.connection.infoJSON.info.vername
	}
	get serial(){					// Serial number of the device
		return this.controller.connection.infoJSON.info.serialno
	}
	get model(){					// Model of the device
		return this.controller.connection.infoJSON.info.model
	}
}
class ColorlightControllerStatus{	// Dynamic status information about the device (uptime, memory, storage)
	constructor(controller) {
		this.controller = controller;
	}

	get uptime(){					// Device uptime in milliseconds
		return this.controller.connection.infoJSON.info.up
	}
	get memory(){					// Device memory data objet
		const total = this.controller.connection.infoJSON.info.mem.total
		const free = this.controller.connection.infoJSON.info.mem.free
		return new ColorlightResource(total,free);
	}
	get storage(){					// Device storage data object
		const total = this.controller.connection.infoJSON.info.storage.total
		const free = this.controller.connection.infoJSON.info.storage.free
		return new ColorlightResource(total,free);
	}
}
class ColorlightControllerProgram{
	constructor(controller) {
		this.controller = controller;
	}

	get activeProgram(){
		return new ColorlightProgram(this.controller.connection.programStatusJSON.playing)
	}
	get programList(){
		const programListListJSON = this.controller.connection.programStatusJSON.contents

		const programList = [];

		for(let i=0; i<programListListJSON.length;i++){
			const programListJSON = programListListJSON[i].content
			const type = programListListJSON[i].type
			for (let j=0; j<programListJSON.length;j++){
				programList.push(new ColorlightProgram(programListJSON[j],type))
			}
		}
		return programList
	}
	get programNameList(){
		const pl = this.programList;
		const nameList = []
		for(let i = 0; i < pl.length; i++){
			nameList.push(pl[i].name);
		}
		return nameList;
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


/*
* @deprecated replaced with ColorlightControllerConnection
* */
/*class ColorlightConnector{
	constructor(ip){
		console.error("deprecated replaced with ColorlightControllerConnection")
		this.ip=ip;
		this.laststatus = new ColorlightStatus(null);
		
		this.onlostc = null;
	}
	set onLostConnection(callback){
		this.onlostc = callback
	}
	connect(onConnected,onError,onLostConnection){
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
	
	
}*/

/*
* @deprecated replaced with ColorlightControllerStatus
* */
class ColorlightStatus{
	constructor(jsonText){
		console.error("deprecated replaced with ColorlightControllerStatus")
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

//module.exports.colorlightConnector = ColorlightConnector;

function responseHandlerFactory(onOk,onError){
	return new Promise((error,response,body)=>{
		if (!error && response.statusCode == 200) {
			onOk(body);

		}
		else{
			onError(error)
		}
	})
}
function requestFactory(ip,api,responseHandler){
	return new Promise(()=>{
		const request = require("request");
		request("http://"+ip + "/api/"+api, responseHandler);
	})
}

function getInfoJSON(){
	
	return new Promise
}

module.exports.connection = ColorlightControllerConnection;
module.exports.controller = ColorlightController;
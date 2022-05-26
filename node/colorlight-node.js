const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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
	constructor(controller,programJSON,type) {
		this.controller = controller;
		this.programJSON = programJSON
		if(type !== undefined) {
			this.programJSON.type = type
		}
	}

	get type(){
		return this.programJSON.type
	}
	get name(){
		return this.programJSON.name
	}
	delete(){
		this.controller.connection.deleteProgram(this);
	}
}

function syncGetRequest(url){
	const request = new XMLHttpRequest();
	request.open('GET', url, false);  // `false` makes the request synchronous
	request.send(null);
	return request;
}
function syncPutRequest(url){
	const request = new XMLHttpRequest();
	request.open('PUT', url, false);  // `false` makes the request synchronous
	request.send(null);
	return request;
}
function syncPostRequest(url,body){
	const request = new XMLHttpRequest();
	request.open('POST', url, false);  // `false` makes the request synchronous
	request.send(body);
	return request;
}
function syncDeleteRequest(url) {
	const request = new XMLHttpRequest();
	request.open('DELETE', url, false);  // `false` makes the request synchronous
	request.send(null);
	return request;
}

class ColorlightControllerConnection{
	constructor(ip) {
		this.ip = ip;
		this.controller = new ColorlightController(this)
	}
	get infoJSON(){
		const request = syncGetRequest('http://'+this.ip+'/api/info.json')
		if (request.status === 200) {
			return JSON.parse(request.responseText);
		}else {
			//TODO
		}
	}
	get programStatusJSON(){
		const request = syncGetRequest('http://'+this.ip+'/api/vsns.json')
		if (request.status === 200) {
			return JSON.parse(request.responseText);
		}else {
			//TODO
		}
	}

	set activeProgram(program){
		const url = 'http://'+this.ip+'/api/vsns/sources/'+program.type+'/vsns/'+program.name+'/activated';
		const request = syncPutRequest(url)
		if (request.status === 200) {
			return true; //TODO
		}else {
			//TODO
		}
	}

	deleteProgram(program){
		const url = 'http://'+this.ip+'/api/vsns/sources/'+program.type+'/vsns/'+program.name;
		const request = syncDeleteRequest(url)
		if (request.status === 200) {
			return true; //TODO
		}else {
			//TODO
		}
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
		return new ColorlightProgram(this.controller,this.controller.connection.programStatusJSON.playing)
	}
	set activeProgram(program){
		this.controller.connection.activeProgram = program;
	}
	get programList(){
		const programListListJSON = this.controller.connection.programStatusJSON.contents

		const programList = [];

		for(let i=0; i<programListListJSON.length;i++){
			const programListJSON = programListListJSON[i].content
			const type = programListListJSON[i].type
			for (let j=0; j<programListJSON.length;j++){
				programList.push(new ColorlightProgram(this.controller,programListJSON[j],type))
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
}

module.exports = ColorlightControllerConnection;
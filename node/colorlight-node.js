class colorlightConnector{
	constructor(ip){
		this.ip=ip;
		console.log("colorlightConnector")
	}
	
	connect(){
		
	}
	disconnect(){
		
	}
	get status(){
		return new colorlightStatus('{"info": {"vername": "1.64.6", "serialno": "CLCC4000A008", "model": "c4", "up":9989856,"mem": {"total": 1073741824, "free": 778567680}}}')
	}
	
}

class Uptime{
	constructor(ms){
		this.ms = ms
	}
	get milis(){
		return this.ms;
	}
	get timestamp() {
		var dms = this.ms % 1000
		var s = (this.ms - dms)/1000 
		var ds = s % 60
		var min = (s-ds)/60
		var dmin = min % 60
		var hr = (min-dmin)/60
		return hr + ":" + dmin + ":" + ds + "." + dms
	}
}

class Resource{
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

class colorlightStatus{
	constructor(jsonText){
		this.statusJSON = JSON.parse(jsonText);
	}
	get version(){				//Version number of the device firmware
		return this.statusJSON.info.vername;
	}
	get serial(){				//Serial number of the device
		return this.statusJSON.info.serialno;
	}
	get model(){				//Model of the device
		return this.statusJSON.info.model;
	}
	get uptime(){				//Device uptime in miliseconds
		return new Uptime(this.statusJSON.info.up)
	}
	get memory(){
		return new Resource(this.statusJSON.info.mem.total,this.statusJSON.info.mem.free)
	}/*
	this.program = {
		get name(){
			
		}
		get path(){
			
		}
		get source(){
			
		}
	}*/
}

module.exports.colorlightConnector = colorlightConnector;
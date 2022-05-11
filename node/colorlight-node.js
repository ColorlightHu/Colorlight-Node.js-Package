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
class ProgramStatus{
	//TODO
}

class colorlightStatus{
	constructor(jsonText){
		this.statusJSON = JSON.parse(jsonText);
	}
	get version(){				//Version number of the device firmware
		try{
			return this.statusJSON.info.vername;
		} catch(e){
			console.error(e)
		} finally {
			return null
		}
	}
	get serial(){				//Serial number of the device
		try{
			return this.statusJSON.info.serialno;
		} catch(e){
			console.error(e)
		} finally {
			return null
		}
	}
	get model(){				//Model of the device
		try{
			return this.statusJSON.info.model;
		} catch(e){
			console.error(e)
		} finally {
			return null
		}
	}
	get uptime(){				//Device uptime in miliseconds
		try{
			return new Uptime(this.statusJSON.info.up)
		} catch(e){
			console.error(e)
		} finally {
			return new Uptime();
		}
	}
	get memory(){
		try{
			return new Resource(this.statusJSON.info.mem.total,this.statusJSON.info.mem.free)
		} catch(e){
			console.error(e)
		} finally {
			return new Resource();
		}
	}
	get storage(){
		try{
			return new Resource(this.statusJSON.info.storage.total,this.statusJSON.info.storage.free)
		} catch(e){
			console.error(e);
		} finally {
			return new Resource();
		}
	}
	get program(){
		//TODO
	}
}

module.exports.colorlightConnector = colorlightConnector;
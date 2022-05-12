class colorlightConnector{
	constructor(ip){
		this.request = require("request");
		this.ip=ip;
		this.laststatus = null;
	}
	
	connect(callback){
		this.request("http://"+this.ip + "/api/info.json", function(error, response, body) {
			if (!error && response.statusCode == 200) {
				this.laststatus = new colorlightStatus(body)
				callback(this.laststatus)
			}
		});
	}
	disconnect(){
		
	}
	get status(){
		return this.laststatus;
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
	get uptime(){				//Device uptime in miliseconds
		try{
			var ret = new Uptime(this.statusJSON.info.up)
		} catch(e){
			console.error(e)
			var ret = new Uptime();
		} finally {
			return ret
		}
	}
	get memory(){
		try{
			var ret = new Resource(this.statusJSON.info.mem.total,this.statusJSON.info.mem.free)
		} catch(e){
			console.error(e)
			var ret = new Resource();
		} finally {
			return ret
		}
	}
	get storage(){
		try{
			var ret = new Resource(this.statusJSON.info.storage.total,this.statusJSON.info.storage.free)
		} catch(e){
			console.error(e)
			var ret = new Resource();
		} finally {
			return ret
		}
	}
	get program(){
		//TODO
	}
}

module.exports.colorlightConnector = colorlightConnector;
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
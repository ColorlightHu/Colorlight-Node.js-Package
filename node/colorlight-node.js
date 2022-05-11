class colorlightConnector{
	constructor(ip){
		this.ip=ip;
		console.log("colorlightConnector")
	}
	
	connect(){
		
	}
	disconnect(){
		
	}
	getStatus(){
		
		return new colorlightStatus('{"info": {"vername": "1.64.6", "serialno": "CLCC4000A008", "model": "c4"}}')
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
		
	}
	get model(){				//Model of the device
		
	}
	get uptime(){				//Device uptime in miliseconds
		console.log("milis getter")
	}
	/*this.memory = {
		get free(){
			
		}
		get total(){
			
		}
		get usage(){
			
		}
	}
	this.storage = {
		get free(){
			
		}
		get total(){
			
		}
		get usage(){
			
		}
	}
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
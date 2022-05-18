var colorlightController = require('./colorlight-node')
var colorlightConnector = new colorlightController.colorlightConnector("192.168.1.37");

colorlightConnector.connect(
	(status)=>{console.log(status.model)},
	()=>{console.log("Connection failed")},
	()=>{console.log("Connection lost")})
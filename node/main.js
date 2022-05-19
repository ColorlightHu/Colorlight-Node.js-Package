var colorlightController = require('./colorlight-node')
var colorlightConnector = new colorlightController.colorlightConnector("192.168.1.37");

const onConnected = (status)=>{
	console.log(colorlightConnector)
}

colorlightConnector.connect(
	onConnected,
	()=>{console.log("Connection failed")},
	()=>{console.log("Connection lost")})
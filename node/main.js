var colorlightController = require('./colorlight-node')
var colorlightConnector = new colorlightController.colorlightConnector("192.168.1.37");

colorlightConnector.connect(function(status){
	console.log(status.model)
})
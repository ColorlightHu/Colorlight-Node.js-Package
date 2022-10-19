# Colorlight-Node.js-Package

Connecting to a Colorlight controller:
```js
const Colorlight = require("colorlight-node.js-package");
const controllerIP = "192.168.0.123"
const controller = Colorlight.connect(controllerIP);
```

```js
controller.info.version
```

```js
controller.info.serial
```

```js
controller.info.model
```


```js
controller.status.uptime
```
```js
controller.status.memory.free
controller.status.memory.total
controller.status.memory.usage
```
```js
controller.status.storage.free
controller.status.storage.total
controller.status.storage.usage
```


```js
const activeProgram = controller.program.activeProgram
const programList = controller.program.programList
controller.program.activeProgram = programList[2];
```

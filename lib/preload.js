// preload.js// Get the ipcRenderer of electron
const { ipcRenderer } = require('electron')

// Do something according to a request of your mainview
ipcRenderer.on('reset', function () {
  //ipcRenderer.sendToHost(getScripts());
  //alert("reset");
  console.log('todo')
})

if(!window.LIA) {
  window.LIA = {}
}

ipcRenderer.on('show', function (e, line) {
  window.LIA.gotoLine(line)
})

ipcRenderer.on('jit', function (e, code) {
  window.LIA.jit(code)
})

window.onload = function () {

  window.LIA.lineGoto = function (line) {
    ipcRenderer.sendToHost('gotoLine', line)
  }

  /*
  window.LIA.log = function (type, ...msg) {
    ipcRenderer.sendToHost('log', msg)
  }
  */

  window.LIA.onReady = function () {
    ipcRenderer.sendToHost('ready')
  }

  window.LIA.injectResposivevoice('blVZszUw')
}

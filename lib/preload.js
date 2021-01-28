// preload.js// Get the ipcRenderer of electron
const {
  ipcRenderer
} = require('electron');

// Do something according to a request of your mainview
ipcRenderer.on('reset', function() {
  //ipcRenderer.sendToHost(getScripts());
  //alert("reset");
  console.log("todo");
});

ipcRenderer.on("show", function(e, line) {
  window.gotoLia(line);
});

ipcRenderer.on("jit", function(e, code) {
  window.jitLia(code);
});

window.liaGoto = function(line) {
  ipcRenderer.sendToHost("goto", line);
};

window.liaLog = function(msg) {
  ipcRenderer.sendToHost("log", msg);
}

window.liaReady = function() {
  ipcRenderer.sendToHost("ready");
}

window.onload = function() {
  var script = document.createElement("script");
  script.src = "https://code.responsivevoice.org/responsivevoice.js?key=blVZszUw";
  document.body.appendChild(script);

  script.onload = () => {
    window.responsiveVoice.init()
  };
};

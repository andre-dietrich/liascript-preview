'use babel';

const { shell } = require('electron');

import { CompositeDisposable, Point } from 'atom';

var zoomLevel = 100;


const debounce = (func, delay) => {
    let debounceTimer
    return function() {
        const context = this
        const args = arguments
            clearTimeout(debounceTimer)
                debounceTimer
            = setTimeout(() => func.apply(context, args), delay)
    }
}

class LiascriptPreviewView  {

  getElement() {
    return this.webview;
  }

  constructor (uri, editorId, base_url) {
    this.uri = uri;
    this.editorId = editorId;
    this.subscriptions = new CompositeDisposable();

    this.base_url = base_url;
    this.path = path;

    this.resolve = () => {
      if (!this.editor) {
        this.editor = getEditorForId(editorId);
      }
    };

    if (atom.workspace)
      this.resolve();
    else
      this.subscriptions.add(atom.packages.onDidActivateInitialPackages(this.resolve));

    this.webview = document.createElement('webview');
    //this.iframe = this.webview//document.createElement('iframe')

    //this.webview.appendChild(this.iframe)

    this.webview.className = 'native-key-bindings';
    this.webview.allowpopups = true;
    this.webview.id = "lia"
    this.webview.style = "height: 100%; width: 100%"
    this.webview.preload = __dirname + "/preload.js";
    this.webview.disablewebsecurity = true;
    //this.webview.nodeintegration = true;

    let path = this.getPath().replace(/\\/g, "/");

    this.webview.src = base_url+"?file://"+path;
    //this.iframe.style = "height: 100%; width: 100%; border:none;"
    //this.iframe.id = "iframe_" + editorId


    /*
    const win = new remote.BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: __dirname + "/preload.js",
        webSecurity: false,
        allowRunningInsecureContent: true
      }
    })
    win.loadURL(base_url+"?file://"+path)
    */
    this.webview.partition = "persist:liascript";
    this.webview.webpreferences = "allowRunningInsecureContent, javascript=yes";

    console.log("check in browser: ",this.webview.src);

    this.webview.addEventListener('console-message', (e) => {
      console.log('LIA: ', e)
    });

    let editor_ = this.editor;
    //let iframe_ = this.iframe
    let send = this.webview

    let jit = function () {
      if (atom.config.get('liascript-preview.experimental_jit'))
        send.contentWindow.postMessage({cmd: "jit", param: editor_.getText()});
        //send.contentWindow.jitLia(editor_.getText())
    }

    /*
    window.top.liaGoto = function(e) {
      const position = new Point(e, 0);
      editor_.setCursorBufferPosition(position);
      atom.workspace.paneForItem(editor_).activate();
    }*/

    /*
    this.webview.addEventListener('message', event => {

      switch(event.data.cmd) {
        case "goto": {
          const position = new Point(event.data.param, 0);
          editor_.setCursorBufferPosition(position);
          atom.workspace.paneForItem(editor_).activate();
          break;
        } case "log": {
          if (atom.config.get('liascript-preview.debug'))
            console.log("LIA-LOG:", event.data.param)
          break;
        } case "ready": {
          jit()
          break;
        } default: {
          console.warn("LIA unknown ipc-message:", event)
        }
      }

    });
    */

    this.webview.addEventListener('ipc-message',function(event){
      switch(event.channel) {
        case "goto": {
          const position = new Point(event.args[0], 0);
          editor_.setCursorBufferPosition(position);
          atom.workspace.paneForItem(editor_).activate();
          break;
        } case "log": {
          if (atom.config.get('liascript-preview.debug'))
            console.log("LIA-LOG:", event.args[0])
          break;
        } case "ready": {
          jit()
          break;
        } default: {
          console.warn("LIA unknown ipc-message:", event)
        }
      }
    });


    this.subscriptions.add(
      this.editor.getBuffer().onDidSave(
        () => {
          if (!atom.config.get('liascript-preview.experimental_jit'))
            this.reload();
        }
      )
    );

    this.subscriptions.add(
      this.editor.getBuffer().onDidChange(
        debounce(jit, 500)
        //(x) => console.warn(x)
      )
    );

    atom.views.getView(this.editor).addEventListener("dblclick", (e) => {
      try {
        let line = editor_.getCursorBufferPosition().row + 1;
        //this.webview.send("show", line);

        send.contentWindow.postMessage({cmd: "goto", param: line});
      } catch (e) {

      }
    });

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'liascript-preview:reload': () => {
        if(this.editor != null)
          this.reload();
      },
      'liascript-preview:go-back': () => {
        if(this.editor != null)
          this.webview.goBack();
      },
      'liascript-preview:go-forward': () => {
        if(this.editor != null)
          this.webview.goForward();
      },
      'liascript-preview:zoom-in': () => {
        if(this.editor != null){
          zoomLevel = zoomLevel + 10;
          this.webview.setZoomFactor(zoomLevel/100);
        }
      },
      'liascript-preview:zoom-out': () => {
        if(this.editor != null){
          zoomLevel = zoomLevel - 10;
          this.webview.setZoomFactor(zoomLevel/100);
        }
      },
      'liascript-preview:reset-zoom': () => {
        if(this.editor != null){
          zoomLevel = 100;
          this.webview.setZoomFactor(1);
        }
      },
      'liascript-preview:reset': () => {
        if(this.editor != null){
          //this.webview.executeJavaScript("lia.reset();");
          this.webview.send("reset");
          //this.reload();
        }
      },
      'liascript-preview:open-in-browser': () => {
        //if(this.editor != null){
          console.log("open", this.webview.src);
          //shell.openExternal(this.webview.src);
          window.open(this.webview.src, '_blank')
          //shell.openExternal(this.webview.src);
        //}
      },
      'liascript-preview:toggle-dev-tools': () => {
        if(this.editor != null){
          if(this.webview.isDevToolsOpened()) {
            this.webview.closeDevTools()
          } else {
            this.webview.openDevTools()
          }
        }
      },
    }));
  }

  reload() {
    if (this.webview.src.endsWith("index.html")) {
      this.webview.goBack();
    } else {
      //this.iframe.contentWindow.location.reload(true);//src = this.iframe.contentWindow.location.href;
      this.webview.contentWindow.postMessage({cmd: "reload", param: null});
    }
  }

  serialize () {
    return {
      deserializer: 'LiascriptPreviewView',
      editorId: this.editorId
    };
  }

  destroy () {
    this.subscriptions.dispose();
    atom.views.getView(this.editor).removeEventListener("dblclick", (e) => {
      try {
        let line = editor_.getCursorBufferPosition().row + 1;
        this.webview.send("show", line);
      } catch (e) {

      }
    });
  }

  getTitle () {
    let title = 'Liascript';
    if (this.editor) {
      title = this.editor.getTitle();
    }
    return title + ' Preview';
  }

  getURI () {
    return this.uri;
  }

  getPath () {
    return this.editor.getPath();
  }

  isEqual (other) {
    return other instanceof LiascriptPreviewView &&
      this.getURI() === other.getURI();
  }
}

function getEditorForId (editorId) {
  const editors = atom.workspace.getTextEditors();
  for (const i in editors) {
    const editor = editors[i];
    if (editor.id.toString() === editorId.toString())
      return editor;
  }
}


export default LiascriptPreviewView;

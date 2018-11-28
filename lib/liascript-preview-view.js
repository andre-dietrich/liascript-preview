'use babel';

const { shell } = require('electron');

import { CompositeDisposable } from 'atom';

var zoomLevel = 100;

class LiascriptPreviewView  {

  getElement() {
    return this.webview;
  }

  constructor (uri, editorId, base_url) {
    this.uri = uri;
    this.editorId = editorId;
    this.subscriptions = new CompositeDisposable();

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
    this.webview.className = 'native-key-bindings';
    this.webview.allowpopups = true;
    this.webview.disablewebsecurity = true;
    this.webview.src = base_url+"?file://"+(this.getPath());
    this.webview.partition = "persist:liascript";
    this.webview.webpreferences = "allowRunningInsecureContent, javascript=yes";

    console.log("check in browser: ",this.webview.src);

    this.subscriptions.add(
      this.editor.getBuffer().onDidSave(
        () => {
          this.reload();
        }
      )
    );

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
          this.webview.executeJavaScript("lia.reset();");
          this.reload();
        }
      },
      'liascript-preview:open-in-browser': () => {
        if(this.editor != null){
          console.log("open", this.webview.src);
          shell.openExternal(this.webview.src);
        }
      }
    }));
  }

  reload() {
    this.webview.reload();
  }

  serialize () {
    return {
      deserializer: 'LiascriptPreviewView',
      editorId: this.editorId
    };
  }

  destroy () {
    this.subscriptions.dispose();
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

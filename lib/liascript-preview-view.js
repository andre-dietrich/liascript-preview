'use babel';

import { CompositeDisposable } from 'atom';

import { startServer, stopServer } from './server.js';

var zoomLevel = 100;

class LiascriptPreviewView  {

  getElement() {
    return this.webview;
  }

  constructor (uri, editorId, base_url, port) {
    this.startLocalServer(port);

    this.uri = uri;
    this.editorId = editorId;
    this.subscriptions = new CompositeDisposable();

    console.log(atom.project.getDirectories()[0]);

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
    this.webview.src = base_url+"?http://127.0.0.1:"+port+(this.getPath().replace(atom.project.getPaths()[0], ""));

    console.log(this.webview.src);

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
      }
    }));
  }

  reload() {
    this.webview.reload();
  }

  startLocalServer(port) {
    if(this.server == null) {
      let path = atom.project.getPaths()[0];
      this.server = startServer(path, port);
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
    stopServer(this.server);
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

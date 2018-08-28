'use babel';

import { CompositeDisposable } from 'atom';

import startServer from './server.js';

class LiascriptPreviewView  {

  getElement() {
    return this.webview;
  }

  constructor (uri, editorId, base_url) {
    this.startLocalServer();

    this.uri = uri;
    this.editorId = editorId;
    this.subscriptions = new CompositeDisposable();

    console.log(atom.project.getDirectories()[0]);

    this.resolve = () => {
      if (!this.editor) {
        this.editor = getEditorForId(editorId);
      }
    };

    if (atom.workspace) this.resolve();
    else this.subscriptions.add(atom.packages.onDidActivateInitialPackages(this.resolve));

    this.webview = document.createElement('webview');
    this.webview.className = 'native-key-bindings';
    this.webview.src = base_url;//+"/?http://127.0.0.1:"+4444+(this.getPath().replace(atom.project.getPaths()[0], ""));

    console.log(this.webview.src);

  }

  startLocalServer() {
    this.server = startServer(atom.project.getPaths()[0], 4444);
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

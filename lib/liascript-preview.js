'use babel';

import LiascriptPreviewView from './liascript-preview-view';
import { CompositeDisposable } from 'atom';

var connect = require('connect');
var serveStatic = require('serve-static');

var devServer = null;

export default {

  config: {
    developmentServerPort: {
      title: 'Development Server Port',
      type: 'integer',
      default: 4891,
      order: 1,
    }
  },

  liascriptPreviewView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.liascriptPreviewView = new LiascriptPreviewView(state.liascriptPreviewViewState);
/*    this.modalPanel = atom.workspace.addModalPanel({
      item: this.liascriptPreviewView.getElement(),
      visible: false
    });
*/
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.startDevServer();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'liascript-preview:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    //this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.liascriptPreviewView.destroy();
  },

  serialize() {
    return {
      liascriptPreviewViewState: this.liascriptPreviewView.serialize()
    };
  },

  toggle() {
    console.log('LiascriptPreview was toggled!');
    //return (
      //this.modalPanel.isVisible() ?
      //this.modalPanel.hide() :
      //this.modalPanel.show()
    //);
  },

  startDevServer() {
    console.log(__dirname+"/../web");

    if(devServer == null) {
      let port = atom.config.get('liascript-preview.developmentServerPort');

      devServer = connect().use(serveStatic(__dirname+"/../web")).listen(port, function(){
          console.log('Server running on port ' + port);
      });
    }
  }

};

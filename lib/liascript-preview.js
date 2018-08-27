'use babel';

import LiascriptPreviewView from './liascript-preview-view';
import { CompositeDisposable } from 'atom';

export default {

  liascriptPreviewView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.liascriptPreviewView = new LiascriptPreviewView(state.liascriptPreviewViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.liascriptPreviewView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'liascript-preview:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
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
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};

'use babel'

import LiascriptPreviewView from './liascript-preview-view'
import { CompositeDisposable } from 'atom'

import url from 'url'

const LIASCRIPT_PREVIEW_URI_PROTOCOL = 'liascript-viewer:'

export default {
  config: {
    debug: {
      title: 'Show debug information in the developer console',
      type: 'boolean',
      default: false,
      order: 1,
    },
    experimental_jit: {
      title:
        'Experimental just-in-time interpreter that updates the preview on every update',
      type: 'boolean',
      default: false,
      order: 1,
    },
  },

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'liascript-preview:toggle': () => this.toggle(),
      }),
    )

    this.subscriptions.add(
      atom.workspace.addOpener(this.liascriptPreviewOpener),
    )
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  serialize() {},

  toggle() {
    console.log('Liascript Preview was toggled!')

    if (this.isLiascriptPreviewView(atom.workspace.getActivePaneItem())) {
      atom.workspace.destroyActivePaneItem()
      console.log('Viewer destroyed')
      return
    }

    const editor = atom.workspace.getActiveTextEditor()
    if (!editor) return

    const uri = this.createLiascriptPreviewUri(editor)
    const viewer = atom.workspace.paneForURI(uri)

    if (!viewer) {
      this.addPreviewForUri(uri)
    } else {
      console.log('Viewer destroyed')
      viewer.destroyItem(viewer.itemForURI(uri))
    }
  },

  addPreviewForUri(uri) {
    const prevActivePane = atom.workspace.getActivePane()
    const options = {
      searchAllPanes: true,
      split: 'right',
    }

    atom.workspace.open(uri, options).then((viewerView) => {
      if (this.isLiascriptPreviewView(viewerView)) {
        prevActivePane.activate()
      }
    })
  },

  createLiascriptPreviewUri(editor) {
    return LIASCRIPT_PREVIEW_URI_PROTOCOL + '//editor/' + editor.id
  },

  liascriptPreviewOpener(uri) {
    try {
      var parsedUri = url.parse(uri)
    } catch (err) {
      return
    }

    if (parsedUri.protocol !== LIASCRIPT_PREVIEW_URI_PROTOCOL) return

    console.log('Create new Preview')
    const editorId = parsedUri.pathname.substring(1)

    return new LiascriptPreviewView(
      uri,
      editorId,
      'file://' +
        __dirname +
        '/../web/index.html',
    )
  },

  isLiascriptPreviewView(object) {
    return object instanceof LiascriptPreviewView
  },
}

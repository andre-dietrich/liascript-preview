'use babel'

const { shell } = require('electron')

import { CompositeDisposable, Point } from 'atom'

var zoomLevel = 100

const debounce = (func, delay) => {
  let debounceTimer
  return function () {
    const context = this
    const args = arguments
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(context, args), delay)
  }
}

class LiascriptPreviewView {
  getElement() {
    return this.webview
  }

  constructor(uri, editorId, base_url) {
    this.browser = null
    this.uri = uri
    this.editorId = editorId
    this.subscriptions = new CompositeDisposable()

    this.base_url = base_url
    this.path = path

    this.resolve = () => {
      if (!this.editor) {
        this.editor = getEditorForId(editorId)
      }
    }

    if (atom.workspace) this.resolve()
    else
      this.subscriptions.add(
        atom.packages.onDidActivateInitialPackages(this.resolve),
      )

    this.webview = document.createElement('webview')

    this.webview.className = 'native-key-bindings'
    this.webview.allowpopups = true
    this.webview.id = 'lia'

    this.webview.preload = __dirname + '/preload.js'
    this.webview.disablewebsecurity = true

    let path = this.getPath().replace(/\\/g, '/')

    this.webview.src = base_url + '?file://' + path

    this.webview.partition = 'persist:liascript'
    this.webview.webpreferences = 'allowRunningInsecureContent, javascript=yes'

    console.log('check in browser: ', this.webview.src)

    this.webview.addEventListener('console-message', (e) => {
      console.log('LIA: ', e)
    })

    let editor_ = this.editor
    let send = this.webview

    let jit = function () {
      if (atom.config.get('liascript-preview.experimental_jit'))
        send.contentWindow.postMessage({
          cmd: 'jit',
          param: editor_.getText(),
        })
    }

    this.webview.addEventListener('ipc-message', function (event) {
      switch (event.channel) {
        case 'goto': {
          const position = new Point(event.args[0], 0)
          editor_.setCursorBufferPosition(position)
          atom.workspace.paneForItem(editor_).activate()
          break
        }
        case 'log': {
          if (atom.config.get('liascript-preview.debug'))
            console.log('LIA-LOG:', event.args[0])
          break
        }
        case 'ready': {
          jit()
          break
        }
        default: {
          console.warn('LIA unknown ipc-message:', event)
        }
      }
    })

    this.subscriptions.add(
      this.editor.getBuffer().onDidSave(() => {
        if (!atom.config.get('liascript-preview.experimental_jit'))
          this.reload()
      }),
    )

    this.subscriptions.add(
      this.editor.getBuffer().onDidChange(debounce(jit, 500)),
    )

    atom.views.getView(this.editor).addEventListener('dblclick', (e) => {
      try {
        let line = editor_.getCursorBufferPosition().row + 1

        send.contentWindow.postMessage({
          cmd: 'goto',
          param: line,
        })
      } catch (e) {}
    })

    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'liascript-preview:reload': () => {
          if (this.editor != null) this.reload()
        },
        'liascript-preview:go-back': () => {
          if (this.editor != null) this.webview.goBack()
        },
        'liascript-preview:go-forward': () => {
          if (this.editor != null) this.webview.goForward()
        },
        'liascript-preview:zoom-in': () => {
          if (this.editor != null) {
            zoomLevel = zoomLevel + 10
            this.webview.setZoomFactor(zoomLevel / 100)
          }
        },
        'liascript-preview:zoom-out': () => {
          if (this.editor != null) {
            zoomLevel = zoomLevel - 10
            this.webview.setZoomFactor(zoomLevel / 100)
          }
        },
        'liascript-preview:reset-zoom': () => {
          if (this.editor != null) {
            zoomLevel = 100
            this.webview.setZoomFactor(1)
          }
        },
        'liascript-preview:reset': () => {
          if (this.editor != null) {
            this.webview.send('reset')
          }
        },
        'liascript-preview:open-in-browser': () => {
          this.browser = window.open('', 'liascript-browser', '', true);

          // if the "target" window was just opened, change its url
          if(this.browser.location.href === 'about:blank'){
            this.browser.location.href = this.webview.src;
          }
        },
        'liascript-preview:toggle-dev-tools': () => {
          if (this.editor != null) {
            if (this.webview.isDevToolsOpened()) {
              this.webview.closeDevTools()
            } else {
              this.webview.openDevTools()
            }
          }
        },
      }),
    )
  }

  reload() {
    if (this.webview.src.endsWith('index.html')) {
      if (this.webview){
        this.webview.goBack()
      }
    } else {
      if (this.webview) {
        this.webview.contentWindow.postMessage({
          cmd: 'reload',
          param: null,
        })
      }

      if (this.browser) {
        this.browser.postMessage({
          cmd: 'reload',
          param: null,
        })
      }
    }
  }

  serialize() {
    return {
      deserializer: 'LiascriptPreviewView',
      editorId: this.editorId,
    }
  }

  destroy() {
    this.subscriptions.dispose()
    atom.views.getView(this.editor).removeEventListener('dblclick', (e) => {
      try {
        let line = editor_.getCursorBufferPosition().row + 1
        this.webview.send('show', line)
      } catch (e) {}
    })
  }

  getTitle() {
    let title = 'Liascript'
    if (this.editor) {
      title = this.editor.getTitle()
    }
    return title + ' Preview'
  }

  getURI() {
    return this.uri
  }

  getPath() {
    return this.editor.getPath()
  }

  isEqual(other) {
    return (
      other instanceof LiascriptPreviewView && this.getURI() === other.getURI()
    )
  }
}

function getEditorForId(editorId) {
  const editors = atom.workspace.getTextEditors()
  for (const i in editors) {
    const editor = editors[i]
    if (editor.id.toString() === editorId.toString()) return editor
  }
}

export default LiascriptPreviewView

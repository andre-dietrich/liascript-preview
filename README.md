# Liascript-Preview

A preview-plugin for [LiaScript](https://LiaScript.github.io), an extended
markdown notation that is intended to be used for interactive online-course
generation.

https://github.com/andre-dietrich/liascript-preview

## Install

This has been tested on Linux and Windows.

### GUI

1. Install Atom 1.22 or newer

   You will have to install git first! If you are on a Windows machine,
   go to:

   https://git-scm.com/downloads

   Download and install git with the default settings for your system.

2. Launch Atom
3. Open Settings View using Cmd+, on macOS or Ctrl+, on other platforms

   Or simply hit Ctrl+Shift+P to get to the fuzzy search and type: settings

   ... and hit enter

4. Click the Install tab on the left side
5. Enter `andre-dietrich/liascript-preview` in the search box
6. Click the "Install" button that appears

### Command Line

Install Atom 1.48 or newer

In the terminal, install the package via apm:

    `apm install andre-dietrich/liascript-preview`

## Features

* Autoreload on save
* Toggle Preview
* History navigation
* Resizing
* Syncing in both directions via double-clicking
* Separate Dev-Tools
* Experimental jit-compiler

![screencast](./preview.gif)<!--width= "100%" -->

### Keyboard - Shortcuts


| Shortcut  | Action                                          |
| --------- | ----------------------------------------------- |
| Alt+l     | Toggle preview                                  |
| F5        | Reload preview                                  |
| Ctrl+s    | Save Markdown and update preview                |
| Alt+Left  | Go back in the browser history                  |
| Alt+Right | Go forward in the browser history               |
| Ctrl++    | Zoom-in with 10% steps                          |
| Ctrl+-    | Zoom-out with 10% steps                         |
| Ctrl+0    | Reset zoom to original (100%)                   |
| Ctrl+r    | Reset all stored settings, codes, quizzes, etc. |
| Ctrl+n    | Open LiaScript in browser window                |
| Ctrl+l+i  | Open Dev Tools for LiaScript-webview            |



## Related Projects

It is recommended to install also:

[liascript-snippets](https://github.com/andre-dietrich/liascript-snippets)

A collection of short-codes for mor efficient course generation.

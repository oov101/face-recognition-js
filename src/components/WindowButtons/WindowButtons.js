import React, { Component } from 'react';
const { BrowserWindow } = window.require('electron').remote;

class WindowButtons extends Component {
  constructor() {
    super();
    this.window = BrowserWindow.getFocusedWindow();
    this.minimize = this.minimize.bind(this);
    this.maximize = this.maximize.bind(this);
    this.close = this.close.bind(this);
  }

  minimize() {
    this.window.minimize();
  }

  maximize() {
    if (!this.window.isMaximized()) {
        this.window.maximize();          
    } else {
        this.window.unmaximize();
    }
  }

  close() {
    this.window.close();
  }

  render() {
    return(
      <div id='WindowButtons'>
        <button onClick={this.minimize}>min</button>
        <button onClick={this.maximize}>max</button>
        <button onClick={this.close}>close</button>
      </div>
    );
  }
} 

export default WindowButtons;
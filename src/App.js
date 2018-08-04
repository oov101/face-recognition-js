import React, { Component } from 'react';
import './App.css';
import FaceApi from './components/FaceApi/FaceApi';

class App extends Component {
  render() {
    return (
      <div className="App">
        <FaceApi />
      </div>
    );
  }
}

export default App;

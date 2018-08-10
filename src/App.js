import React, { Component } from 'react';
import './App.css';
import FaceApi from './components/FaceApi/FaceApi';
import { BrowserRouter as Router, Route } from 'react-router-dom';
class App extends Component {
  
  render() {
    return (
      <Router>
        <div className="App">
          <Welcome exact path="/" component={Welcome} />
          <FaceApi path="/FaceReco" />
        </div>
      </Router>
    );
  }
}

export default App;

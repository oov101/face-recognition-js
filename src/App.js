import React, { Component } from 'react';
import './App.css';
import FaceReco from './components/FaceApi/FaceApi';
import Welcome from './components/Welcome/Welcome';
import { BrowserRouter as Router, Route } from 'react-router-dom';
class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Welcome exact path="/" component={Welcome} />
          <FaceReco path="/FaceReco" component={FaceReco} />
        </div>
      </Router>
    );
  }
}

export default App;

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
          <Route exact path="/" component={Welcome} />
          <Route path="/FaceReco" component={FaceReco} />
        </div>
      </Router>
    );
  }
}

export default App;

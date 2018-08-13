import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import FaceReco from './components/FaceReco/FaceReco';
import Welcome from './components/Welcome/Welcome';
import Tutorial from './components/Tutorial/Tutorial';
import WindowButtons from './components/WindowButtons/WindowButtons';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <WindowButtons />
          <Route exact path="/" component={Welcome} />
          <Route path="/FaceReco" component={FaceReco} />
          <Route path="/Tutorial" component={Tutorial} />
        </div>
      </Router>
    );
  }
}

export default App;

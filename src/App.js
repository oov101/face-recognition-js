import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter, Switch } from 'react-router-dom';
import './App.css';
import FaceReco from './components/FaceReco/FaceReco';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Welcome from './components/Welcome/Welcome';
import Tutorial from './components/Tutorial/Tutorial';
import WindowButtons from './components/WindowButtons/WindowButtons';

class App extends Component {
  render() {
    return(
      <Router>
        <div>
          <WindowButtons />
          <RouterTransition />
        </div>
      </Router>
    );
  }
}
const RouterTransition = withRouter(({ location }) =>
  <div className="App">
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        classNames='fade'
        timeout={300}
      >
        <Switch location={location}>
          <Route exact path="/" component={Welcome} />
          <Route path="/FaceReco" component={FaceReco} />
          <Route path="/Tutorial" component={Tutorial} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  </div>
);



export default App;

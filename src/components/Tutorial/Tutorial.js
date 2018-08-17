import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Tutorial.css'

class Tutorial extends Component {
  render() {
    return(
      <div id="Tutorial">
        <Link to="/"><button>Home</button></Link>
        <h1>Tutorial</h1>
        <TutorialContainer />
      </div>
    );
  }
}

const TutorialContainer = () => {
  return (
    <div>
      <NavigationButton />
      <TutorialImageContainer />
      <NavigationButton />
    </div>
  );
}

const TutorialImageContainer = () => {
  return (
    <div>
      <p>ImageContainer</p>
    </div>
  );
};

const NavigationButton = () => {
  return (
    <div>
      <button>button test</button>
    </div>
  );
}

export default Tutorial;
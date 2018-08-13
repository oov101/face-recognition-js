import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Tutorial.css'

class Tutorial extends Component {
  render() {
    return(
      <div id="Tutorial">
        <Link to="/"><button>Home</button></Link>
        <h1>Tutorial</h1>
      </div>
    );
  }
}

export default Tutorial;
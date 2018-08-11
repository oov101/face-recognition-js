import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

class Welcome extends Component {
  render() {
    return(
      <div id="Welcome">
        <div>
          <h1><span className="title-span">Face</span>Recognition</h1>
          <Link to="/Tutorial"><button>Tutorial</button></Link>
          <Link to="/FaceReco"><button>Start</button></Link>
        </div>
      </div>
    );
  }
}

export default Welcome;
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class Welcome extends Component {
  render() {
    return(
      <div>
        <Link to="/Tutorial"><button>Tutorial</button></Link>
        <Link to="/FaceReco"><button>Start</button></Link>
        <h1>Face Recognition Application</h1>
      </div>
    );
  }
}

export default Welcome;
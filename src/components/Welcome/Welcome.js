import React, { Component } from 'react';
import { Link } from 'react-router-dom';
class Welcome extends Component {
  render() {
    return(
      <div>
        <h1>Face Recognition Application</h1>
        <Link to="/Tutorial"><button>Tutorial</button></Link>
        <Link to="/FaceReco"><button>Start</button></Link>
      </div>
    );
  }
}

export default Welcome;
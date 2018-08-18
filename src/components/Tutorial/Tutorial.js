import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Tutorial.css'
import tutorialTips from './tutorial-tips';
import tutorial1 from '../../assets/tutorial_images/1.png';
import tutorial2 from '../../assets/tutorial_images/2.png';
import tutorial3 from '../../assets/tutorial_images/3.png';
import tutorial4 from '../../assets/tutorial_images/4.png';
import tutorial5 from '../../assets/tutorial_images/5.png';

const tutorialImages = [tutorial1, tutorial2, tutorial3, tutorial4, tutorial5];

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

class TutorialContainer extends Component {
  constructor() {
    super();
    this.state = {
      indexOfTip: 0,
    }

    this.prevTip = this.prevTip.bind(this);
    this.nextTip  = this.nextTip.bind(this);
  }

  prevTip () {
    
    if(this.state.indexOfTip === 0) {
      return;
    }
    console.log('prev', this.state.indexOfTip);

    this.setState({
      indexOfTip: --(this.state.indexOfTip)
    });
  }

  nextTip() {
    
    if(this.state.indexOfTip === 4) {
      return;
    }
    console.log('next', this.state.indexOfTip);

    this.setState({
      indexOfTip: ++(this.state.indexOfTip)
    })
  }

  render() {
    return (
      <div className="TutorialContainer" >
        <NavigationButton direction={"prev"} update={this.prevTip} />
        <TutorialImageContainer indexOfTip={this.state.indexOfTip} />
        <NavigationButton direction={"next"} update={this.nextTip} />
      </div>
    );
  }
}

const TutorialImageContainer = (props) => {
  return (
    <div className="TutorialImageContainer">
      <img src={tutorialImages[props.indexOfTip]} alt="" />
      <p>{tutorialTips.tips[props.indexOfTip]}</p>
    </div>
  );
};

const NavigationButton = (props) => {
  return (
    <div>
      <button onClick={props.update}>{props.direction}</button>
    </div>
  );
}

export default Tutorial;
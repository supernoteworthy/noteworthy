import React, { Component } from 'react';
import Audio from '../Audio/Audio';
import './PlayControls.css';

export default class PlayControls extends Component {
  handleKeyPress = (e: KeyboardEvent) => {
    // Enter
    if (e.keyCode === 13) {
      e.preventDefault();
      Audio.playAll();
    }
    // Space
    if (e.keyCode === 32) {
      e.preventDefault();
      Audio.playSheet();
    }
  };

  handleKeyDown = (e: KeyboardEvent) => {
    // escape
    if (e.keyCode === 27) {
      Audio.stopAll();
    }
  };

  componentDidMount() {
    document.addEventListener('keypress', this.handleKeyPress);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.handleKeyPress);
    document.removeEventListener('keydown', this.handleKeyDown);
  }
  render() {
    return (
      <div className="PlayControls">
      </div>
    );
  }
}

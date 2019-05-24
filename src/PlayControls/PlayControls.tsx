import { Button, Tooltip } from 'antd';
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
        <Tooltip title="Play project" placement="left">
          <Button
            type="primary"
            shape="circle"
            icon="caret-right"
            onClick={() => Audio.playAll()}
          />
        </Tooltip>
        <Tooltip title="Play sheet" placement="left">
          <Button
            type="dashed"
            shape="circle"
            icon="file"
            onClick={() => Audio.playSheet()}
          />
        </Tooltip>{' '}
        <Tooltip title="Stop playback" placement="left">
          <Button
            type="danger"
            shape="circle"
            icon="close"
            onClick={() => Audio.stopAll()}
          />
        </Tooltip>
      </div>
    );
  }
}

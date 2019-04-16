import { Button } from 'antd';
import React, { Component } from 'react';
import Audio from '../Audio/Audio';
import './PlayControls.css';

export default class PlayControls extends Component {
  render() {
    return (
      <div className="PlayControls">
        <Button
          type="primary"
          shape="circle"
          icon="caret-right"
          onClick={() => Audio.playSheet()}
        />
        <Button
          type="danger"
          shape="circle"
          icon="stop"
          onClick={() => Audio.stopAll()}
        />
      </div>
    );
  }
}

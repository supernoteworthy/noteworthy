import { inject } from 'mobx-react';
import React, { Component } from 'react';
import Audio from '../Audio/Audio';
import { LINE_DY } from '../constants';
import { ProjectStore } from '../stores/project.store';
import { MouseMode, UiStore } from '../stores/ui.store';
import { StaffIndex } from '../types/StaffTypes';
import './OctaveSelector.css';

interface OctaveSelectorProps {
  hasClef: boolean;
  octave: number;
  staffIndex: StaffIndex;
}

interface InjectedProps extends OctaveSelectorProps {
  projectStore: ProjectStore;
  uiStore: UiStore;
}

@inject('projectStore', 'uiStore')
export default class OctaveSelector extends Component<OctaveSelectorProps> {
  get injected() {
    return this.props as InjectedProps;
  }
  onMouseEnter = () => {
    this.injected.uiStore.mouseMode = MouseMode.OCTAVE_SELECT;
  };
  onClick = () => {
    const { projectStore } = this.injected;
    const { staffIndex, octave } = this.props;
    const newOctave = (octave + 1) % 8;
    projectStore.setOctave(staffIndex, newOctave);
    Audio.playSampleNote(newOctave * 12 + 12);
  };
  onMouseLeave = () => {
    this.injected.uiStore.mouseMode = MouseMode.INSERT;
  };
  render() {
    const { hasClef, octave } = this.props;
    return (
      <text
        x={hasClef ? 45 : 5}
        y={LINE_DY * 5 + 5}
        className="OctaveSelector"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
      >
        C{octave}
      </text>
    );
  }
}

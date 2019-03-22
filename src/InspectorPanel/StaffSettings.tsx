import { PageHeader, Slider } from 'antd';
import { SliderValue } from 'antd/lib/slider';
import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import Audio from '../Audio/Audio';
import { ProjectStore } from '../stores/project.store';
import { InspectorPanelMode, UiStore } from '../stores/ui.store';
import { StaffIndex } from '../types/StaffTypes';

interface StaffSettingsProps {
  staffIndex: StaffIndex;
}

interface InjectedProps extends StaffSettingsProps {
  uiStore: UiStore;
  projectStore: ProjectStore;
}

@inject('uiStore', 'projectStore')
@observer
export default class StaffSettings extends Component<StaffSettingsProps> {
  get injected() {
    return this.props as InjectedProps;
  }

  onChangeOctave = (value: SliderValue) => {
    const { projectStore } = this.injected;
    const { staffIndex } = this.props;
    const newOctave = (value as number) % 8;
    projectStore.setOctave(staffIndex, newOctave);
    Audio.playSampleNote(newOctave * 12 + 12);
  };

  render() {
    const { uiStore, projectStore } = this.injected;
    const { staffIndex } = this.props;
    const staff = projectStore.staffList[staffIndex];
    return (
      <Fragment>
        <PageHeader
          onBack={() =>
            (uiStore.inspectorPanelMode = InspectorPanelMode.PROJECT_OPTIONS)
          }
          title={`Staff Knobs ${staffIndex}`}
        />
        <div className="SettingsPanel">
          Octave ({staff.octave})
          <Slider
            min={1}
            max={7}
            value={staff.octave}
            onChange={this.onChangeOctave}
          />
          Play with staff: (N/A)
          <br />
          Instrument: Piano
          <br />
          Clef: Treble
          <br />
        </div>
      </Fragment>
    );
  }
}

import { Button, InputNumber, Slider, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import Audio from '../Audio/Audio';
import { ProjectStore } from '../stores/project.store';
import { UiStore } from '../stores/ui.store';

interface ProjectSettingsProps {}
interface InjectedProps {
  projectStore: ProjectStore;
  uiStore: UiStore;
}

@inject('projectStore', 'uiStore')
@observer
export default class ProjectSettings extends Component<ProjectSettingsProps> {
  get injected() {
    return this.props as InjectedProps;
  }
  render() {
    const { projectStore } = this.injected;
    return (
      <Fragment>
        <div className="SettingsPanel">
          <div className="ProjectSettings_buttons">
            <Tooltip title="Play All (Enter)" placement="bottom">
              <Button
                type="primary"
                shape="circle"
                icon="play-circle"
                onClick={() => Audio.playAll()}
              />
            </Tooltip>
            <Tooltip title="Stop All (Esc)" placement="bottom">
              <Button
                type="dashed"
                shape="circle"
                icon="stop"
                onClick={() => Audio.stopAll()}
              />
            </Tooltip>
          </div>
          Beats per minute
          <div className="SliderCombo">
            <Slider
              min={10}
              max={300}
              value={projectStore.bpm}
              onChange={value => {
                projectStore.bpm = value as number;
              }}
            />
            <InputNumber
              min={1}
              max={300}
              value={projectStore.bpm}
              onChange={value => {
                projectStore.bpm = value as number;
              }}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

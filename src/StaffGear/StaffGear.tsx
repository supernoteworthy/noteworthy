import { inject } from 'mobx-react';
import React, { Component } from 'react';
import { ProjectStore } from '../stores/project.store';
import { InspectorPanelMode, MouseMode, UiStore } from '../stores/ui.store';
import { StaffIndex } from '../types/StaffTypes';
import './StaffGear.css';

interface StaffGearProps {
  hasClef: boolean;
  staffIndex: StaffIndex;
}

interface InjectedProps extends StaffGearProps {
  projectStore: ProjectStore;
  uiStore: UiStore;
}

@inject('projectStore', 'uiStore')
export default class StaffGear extends Component<StaffGearProps> {
  get injected() {
    return this.props as InjectedProps;
  }
  onMouseEnter = () => {
    this.injected.uiStore.mouseMode = MouseMode.POPOVER;
  };
  onClick = () => {
    const { uiStore } = this.injected;
    const { staffIndex } = this.props;
    uiStore.inspectorPanelMode = InspectorPanelMode.STAFF_OPTIONS;
    uiStore.inspectorPanelStaffSelected = staffIndex;
  };
  onMouseLeave = () => {
    this.injected.uiStore.mouseMode = MouseMode.INSERT;
  };
  render() {
    const { hasClef, staffIndex } = this.props;
    return (
      <text
        x="100%"
        transform="translate(-40, 0)"
        y={-3}
        className="StaffGear"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
      >
        ☰ {staffIndex}
      </text>
    );
  }
}

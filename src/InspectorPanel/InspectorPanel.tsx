import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { InspectorPanelMode, UiStore } from '../stores/ui.store';
import './InspectorPanel.css';
import ProjectSettings from './ProjectSettings';
import StaffSettings from './StaffSettings';

interface InspectorPanelProps {}

interface InjectedProps extends InspectorPanelProps {
  uiStore: UiStore;
}

@inject('uiStore')
@observer
export default class InspectorPanel extends Component<InspectorPanelProps> {
  get injected() {
    return this.props as InjectedProps;
  }
  render() {
    const { uiStore } = this.injected;
    return (
      <div className="InspectorPanel">
        {uiStore.inspectorPanelMode === InspectorPanelMode.PROJECT_OPTIONS ? (
          <ProjectSettings />
        ) : (
          <StaffSettings staffIndex={uiStore.inspectorPanelStaffSelected} />
        )}
      </div>
    );
  }
}

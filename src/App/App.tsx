import { observer, Provider } from 'mobx-react';
import React, { Component } from 'react';
import Audio from '../Audio/Audio';
import InspectorPanel from '../InspectorPanel/InspectorPanel';
import Palette from '../Palette/Palette';
import Sheet from '../Sheet/Sheet';
import { ProjectStore } from '../stores/project.store';
import { MouseMode, UiStore } from '../stores/ui.store';
import './App.css';

@observer
class App extends Component {
  private projectStore = new ProjectStore();
  private uiStore = new UiStore();

  render() {
    let mouseModeClass = '';
    switch (this.uiStore.mouseMode) {
      case MouseMode.DRAG:
        if (this.uiStore.dragElementId) {
          mouseModeClass = '--dragging';
        } else {
          mouseModeClass = '--drag';
        }
        break;
      case MouseMode.INSERT:
        mouseModeClass = '--insert';
        break;
      case MouseMode.POPOVER:
        mouseModeClass = '--select';
        break;
    }
    return (
      <Provider projectStore={this.projectStore} uiStore={this.uiStore}>
        <div className={`App App${mouseModeClass}`}>
          <Palette />
          <Sheet />
          <InspectorPanel />
        </div>
      </Provider>
    );
  }

  async componentDidMount() {
    Audio.setProjectStore(this.projectStore);
    await Audio.loadSounds();
    document.addEventListener('keypress', e => {
      // Space -- play top staff.
      if (e.keyCode === 32) {
        e.preventDefault();
        const activeStaff = this.uiStore.activeStaff;
        if (activeStaff !== undefined) {
          Audio.playChordList(this.projectStore.getChordsForStaff(activeStaff));
        }
      }
      // Enter -- play all.
      if (e.keyCode === 13) {
        e.preventDefault();
        Audio.playChordList(this.projectStore.chordList);
      }
    });
  }
}

export default App;

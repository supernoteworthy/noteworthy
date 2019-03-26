import { observer, Provider } from 'mobx-react';
import React, { Component } from 'react';
import Audio from '../Audio/Audio';
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
        </div>
      </Provider>
    );
  }

  async componentDidMount() {
    Audio.setProjectStore(this.projectStore);
    await Audio.load();
    document.addEventListener('keypress', e => {
      // Space
      if (e.keyCode === 32) {
        e.preventDefault();
        const activeStaff = this.uiStore.activeStaff;
        if (activeStaff !== undefined) {
          Audio.playStaff(activeStaff);
        }
      }
      // Enter
      if (e.keyCode === 13) {
        e.preventDefault();
        Audio.playSheet();
      }
    });
  }
}

export default App;

import { Provider } from 'mobx-react';
import React, { Component } from 'react';
import Audio from '../Audio/Audio';
import Palette from '../Palette/Palette';
import Sheet from '../Sheet/Sheet';
import { ProjectStore } from '../stores/project.store';
import { UiStore } from '../stores/ui.store';
import './App.css';

class App extends Component {
  private projectStore = new ProjectStore();
  private uiStore = new UiStore();

  render() {
    return (
      <Provider projectStore={this.projectStore} uiStore={this.uiStore}>
        <div className="App">
          <Palette />
          <Sheet />
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
          Audio.playNoteList(this.projectStore.getNotesForStaff(activeStaff));
        }
      }
      // Enter -- play all.
      if (e.keyCode === 13) {
        e.preventDefault();
        Audio.playNoteList(this.projectStore.noteList);
      }
    });
  }
}

export default App;

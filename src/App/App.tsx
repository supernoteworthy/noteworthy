import { observer, Provider } from 'mobx-react';
import React, { Component } from 'react';
import Audio from '../Audio/Audio';
import Palette from '../Palette/Palette';
import PlayControls from '../PlayControls/PlayControls';
import SheetTabs from '../SheetTabs/SheetTabs';
import { ProjectStore } from '../stores/project.store';
import { UiStore } from '../stores/ui.store';
import './App.css';

@observer
class App extends Component {
  private projectStore = new ProjectStore();
  private uiStore = new UiStore();

  render() {
    /*let mouseModeClass = '';
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
    }*/

    return (
      <Provider projectStore={this.projectStore} uiStore={this.uiStore}>
        <div className={`App`}>
          <Palette />
          <SheetTabs />
          <PlayControls />
        </div>
      </Provider>
    );
  }

  async componentDidMount() {
    Audio.connectToStores(this.projectStore, this.uiStore);
    await Audio.load();
  }
}

export default App;

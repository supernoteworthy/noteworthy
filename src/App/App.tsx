import { Button, Tabs } from 'antd';
import { observer, Provider } from 'mobx-react';
import React, { Component } from 'react';
import Audio from '../Audio/Audio';
import Palette from '../Palette/Palette';
import PlayControls from '../PlayControls/PlayControls';
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
          <Tabs tabBarExtraContent={<Button>New sheet</Button>}>
            {this.projectStore.sheetList.map(sheetSpec => (
              <Tabs.TabPane
                tab={sheetSpec.label}
                key={`Sheet_${sheetSpec.label}`}
              >
                <Sheet spec={sheetSpec} />
              </Tabs.TabPane>
            ))}
          </Tabs>
          <PlayControls />
        </div>
      </Provider>
    );
  }

  async componentDidMount() {
    Audio.setProjectStore(this.projectStore);
    await Audio.load();
  }
}

export default App;

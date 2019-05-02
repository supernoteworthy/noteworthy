import { Button, Dropdown, Menu } from 'antd';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Audio from '../Audio/Audio';
import Sheet from '../Sheet/Sheet';
import { ProjectStore } from '../stores/project.store';
import { UiStore } from '../stores/ui.store';
import './SheetTabs.css';

interface SheetTabsProps {}
interface InjectedProps extends SheetTabsProps {
  projectStore: ProjectStore;
  uiStore: UiStore;
}

@inject('projectStore', 'uiStore')
@observer
export default class SheetTabs extends Component<SheetTabsProps> {
  get injected() {
    return this.props as InjectedProps;
  }
  render() {
    const { uiStore, projectStore } = this.injected;
    const currentSheet = projectStore.sheetList.find(
      sheet => sheet.id === uiStore.activeSheet
    );

    //() => ()
    const instruments = Audio.getInstrumentNames();
    const menu = (
      <Menu
        onClick={param => {
          uiStore.activeSheet = projectStore.addSheet(param.key);
        }}
      >
        {instruments.map(instrumentName => (
          <Menu.Item key={instrumentName}>{instrumentName}</Menu.Item>
        ))}
      </Menu>
    );

    return (
      <div className="SheetTabs">
        <div className="SheetTabs_TabZone">
          {projectStore.sheetList.map(sheet => (
            <button
              className={classNames('SheetTabs_Tab', {
                'SheetTabs_Tab--active': sheet.id === uiStore.activeSheet
              })}
              onClick={() => (uiStore.activeSheet = sheet.id)}
              key={sheet.id}
            >
              {sheet.label}
            </button>
          ))}
          <Dropdown overlay={menu}>
            <Button icon="plus" type="primary" ghost />
          </Dropdown>
        </div>
        {currentSheet && <Sheet spec={currentSheet} />}
      </div>
    );
  }
}

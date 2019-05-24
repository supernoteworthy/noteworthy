import { Button, Dropdown, Menu, Modal } from 'antd';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Audio from '../Audio/Audio';
import Sheet from '../Sheet/Sheet';
import { ProjectStore } from '../stores/project.store';
import { UiStore } from '../stores/ui.store';
import './SheetTabs.css';
import { SheetId } from '../types/SheetTypes';

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

  confirmSheetTabClosing = (e: React.MouseEvent, sheetId: SheetId) => {
    e.stopPropagation();
    // TODO: add the sheet name.
    Modal.confirm({
      title: 'Are you sure you want to delete this sheet?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => this.closeSheetTab(sheetId)
    });
  };

  closeSheetTab(sheetId: SheetId) {
    console.log(`closing sheet id: ${sheetId}`);
    this.injected.projectStore.removeSheet(sheetId);
    if (this.injected.uiStore.activeSheet == sheetId) {
      // TODO: write helper method in project store to determine if a given sheet has a sheet to the right. (handle inside store!)
    }
    // if uiStore.currentSheet == sheetId:
    //   if the current sheet has a sheet to the right,
    //   set currentSheet to that one.
    //   if there is one on the left, set currentSheet to that one.
  }

  render() {
    const { uiStore, projectStore } = this.injected;
    const currentSheet = projectStore.getSheet(uiStore.activeSheet);
    const instruments = Audio.getInstrumentNames();
    const instrumentMenu = (
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
    const displayCloseSheet = projectStore.sheetList.length > 1;

    return (
      <div className="SheetTabs">
        <div className="SheetTabs_TabZone">
          {projectStore.sheetList.map(sheet => (
            <div
              className={classNames('SheetTabs_Tab', {
                'SheetTabs_Tab--active': sheet.id === uiStore.activeSheet
              })}
              onClick={() => (uiStore.activeSheet = sheet.id)}
              key={sheet.id}
            >
              {sheet.label}
              {displayCloseSheet && (
                <button onClick={e => this.confirmSheetTabClosing(e, sheet.id)}>
                  x
                </button>
              )}
            </div>
          ))}
          <Dropdown overlay={instrumentMenu}>
            <Button icon="plus" type="primary" ghost />
          </Dropdown>
        </div>
        {currentSheet && <Sheet spec={currentSheet} />}
      </div>
    );
  }
}

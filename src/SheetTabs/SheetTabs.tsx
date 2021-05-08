import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Audio from '../Audio/Audio';
import Sheet from '../Sheet/Sheet';
import { ProjectStore } from '../stores/project.store';
import { UiStore } from '../stores/ui.store';
import './SheetTabs.css';
import { SheetId } from '../types/SheetTypes';

interface SheetTabsProps { }
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
    const sheetToClose = this.injected.projectStore.getSheet(sheetId);
    if (!sheetToClose)
      throw new Error(`Could not find a sheet with id of: ${sheetId}`);

    /*Modal.confirm({
      title: `Are you sure you want to delete the "${
        sheetToClose.label
      }" tab sheet?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => this.closeSheetTab(sheetId)
    });*/
  };

  closeSheetTab(sheetId: SheetId) {
    const {
      prevSheet,
      nextSheet
    } = this.injected.projectStore.getAdjacentSheets(sheetId);

    this.injected.projectStore.removeSheet(sheetId);

    if (this.injected.uiStore.activeSheet === sheetId) {
      if (nextSheet) {
        this.injected.uiStore.activeSheet = nextSheet;
      } else if (prevSheet) {
        this.injected.uiStore.activeSheet = prevSheet;
      }
    }
  }

  render() {
    const { uiStore, projectStore } = this.injected;
    const currentSheet = projectStore.getSheet(uiStore.activeSheet);
    const instruments = Audio.getInstrumentNames();
    const displayCloseSheet = projectStore.sheetList.length > 1;

    return (
      <div className="SheetTabs">
        <div className="SheetTabs_TabZone">
          {projectStore.sheetList.map(sheet => (
            <div
              className={classNames('SheetTabs_Tab', {
                'SheetTabs_Tab--active': sheet.id === uiStore.activeSheet,
                'SheetTabs_Tab--single': !displayCloseSheet
              })}
              onClick={() => (uiStore.activeSheet = sheet.id)}
              key={sheet.id}
            >
              <p className="SheetTabs_TabName">{sheet.label}</p>
            </div>
          ))}
        </div>
        {currentSheet && <Sheet spec={currentSheet} />}
      </div>
    );
  }
}

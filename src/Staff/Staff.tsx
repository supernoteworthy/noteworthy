import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import Clef from '../Clef/Clef';
import { LINE_DY, STAFF_HEIGHT, STAFF_MARGIN } from '../constants';
import DraggableNote from '../DraggableNote/DraggableNote';
import { ProjectStore } from '../stores/project.store';
import { MouseMode, UiStore } from '../stores/ui.store';
import { NoteType } from '../types/NoteTypes';
import { StaffSpec } from '../types/StaffTypes';
import './Staff.css';

interface StaffProps {
  spec: StaffSpec;
}

interface InjectedProps extends StaffProps {
  projectStore: ProjectStore;
  uiStore: UiStore;
}

@inject('projectStore', 'uiStore')
@observer
class Staff extends Component<StaffProps> {
  get injected() {
    return this.props as InjectedProps;
  }

  get notes() {
    const { index } = this.props.spec;
    const { projectStore } = this.injected;
    const notes = projectStore.getNotesForStaff(index);
    return notes!;
  }

  renderLedgerLines() {
    const { index } = this.props.spec;
    const { uiStore } = this.injected;
    const notes = this.notes.filter(note => note.type !== NoteType.REST);

    if (
      uiStore.mouseMode === MouseMode.INSERT &&
      uiStore.insertStaffId === index &&
      uiStore.cursorSpec &&
      uiStore.cursorSpec.type !== NoteType.REST
    ) {
      notes.push({
        ...uiStore.cursorSpec,
        x: uiStore.insertStaffX,
        y: uiStore.insertStaffY
      });
    }

    let ledgerLines = [];

    const className = classNames('StaffLine', {
      'StaffLine--active': this.isActiveStaff()
    });

    const notesAboveStaff = notes.filter(note => note.y < 0);
    for (let note of notesAboveStaff) {
      for (let y = -LINE_DY; y >= note.y; y -= LINE_DY) {
        ledgerLines.push(
          <line
            x1={note.x - 3}
            x2={note.x + 25}
            y1={y}
            y2={y}
            className={className}
            key={`ledgerline_${note.id}_${y}`}
          />
        );
      }
    }

    const notesBelowStaff = notes.filter(note => note.y >= STAFF_HEIGHT);
    for (let note of notesBelowStaff) {
      for (let y = STAFF_HEIGHT; y <= note.y; y += LINE_DY) {
        ledgerLines.push(
          <line
            x1={note.x - 3}
            x2={note.x + 25}
            y1={y}
            y2={y}
            className={className}
            key={`ledgerline_${note.id}_${y}`}
          />
        );
      }
    }
    return ledgerLines;
  }

  renderNotes() {
    const { index } = this.props.spec;
    const { projectStore } = this.injected;
    const notes = projectStore.getNotesForStaff(index);
    return notes.map(note => (
      <DraggableNote
        key={`note_${note.id}`}
        id={note.id}
        type={note.type}
        length={note.length}
        snapToStaff
      />
    ));
  }

  renderLines() {
    const { uiStore } = this.injected;
    const width = uiStore.sheetWidth;
    const className = classNames('StaffLine', {
      'StaffLine--active': this.isActiveStaff()
    });
    return (
      <Fragment>
        <line x1="0" x2={width} y1={0} y2={0} className={className} />
        <line
          x1="0"
          x2={width}
          y1={LINE_DY}
          y2={LINE_DY}
          className={className}
        />
        <line
          x1="0"
          x2={width}
          y1={LINE_DY * 2}
          y2={LINE_DY * 2}
          className={className}
        />
        <line
          x1="0"
          x2={width}
          y1={LINE_DY * 3}
          y2={LINE_DY * 3}
          className={className}
        />
        <line
          x1="0"
          x2={width}
          y1={LINE_DY * 4}
          y2={LINE_DY * 4}
          className={className}
        />
      </Fragment>
    );
  }

  isActiveStaff() {
    const { uiStore } = this.injected;
    return uiStore.activeStaff === this.props.spec.index;
  }

  render() {
    const { index, clef } = this.props.spec;
    const startY = index * STAFF_HEIGHT + index * STAFF_MARGIN;
    return (
      <g transform={`translate(0, ${startY})`}>
        {this.renderLines()}
        {this.renderLedgerLines()}
        {clef !== undefined && <Clef x={10} y={-LINE_DY} />}
        {this.renderNotes()}
      </g>
    );
  }
}

export default Staff;

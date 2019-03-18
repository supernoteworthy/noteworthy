import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import uuid from 'uuid/v4';
import Audio from '../Audio/Audio';
import {
  CURSOR_COLOR,
  LINE_DY,
  MOUSE_OFFSET_X,
  MOUSE_OFFSET_Y,
  SHEET_MARGIN_TOP,
  STAFF_HEIGHT,
  STAFF_MARGIN
} from '../constants';
import RenderNote from '../RenderNote/RenderNote';
import { ProjectStore } from '../stores/project.store';
import { MouseMode, UiStore } from '../stores/ui.store';
import { ChordSpec } from '../types/ChordTypes';
import { NoteOrientation, NoteType } from '../types/NoteTypes';
import { StaffIndex } from '../types/StaffTypes';

interface CursorNoteProps {
  snapToStaff: boolean;
  currentSheetScroll: number;
  getSheetBoundingX: () => number | undefined;
}

interface InjectedProps extends CursorNoteProps {
  projectStore: ProjectStore;
  uiStore: UiStore;
}

@inject('projectStore', 'uiStore')
@observer
export default class CursorNote extends Component<CursorNoteProps> {
  state = {
    justMounted: true
  };
  get injected() {
    return this.props as InjectedProps;
  }
  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
  }
  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
  }
  onMouseMove = (e: MouseEvent) => {
    const { uiStore, projectStore } = this.injected;
    uiStore.insertX = e.clientX;
    uiStore.insertY = e.clientY;
    const { x, yOnStaff, staffIndex } = this.clientPositionToSvgPosition()!;
    uiStore.activeChord = projectStore.findAdjacentChord(x, staffIndex);
    uiStore.insertStaffId = staffIndex;
    uiStore.insertStaffX = x;
    uiStore.insertStaffY = yOnStaff;
    this.setState({ justMounted: false });
  };
  onMouseDown = (e: React.MouseEvent) => {
    const { uiStore } = this.injected;
    const { cursorSpec } = uiStore;

    if (!cursorSpec) {
      throw new Error(
        'Attempted to create cursor note with no spec available.'
      );
    }
    const newNoteId = uuid();

    const { projectStore } = this.injected;
    const { x, y, staffIndex } = this.clientPositionToSvgPosition()!;
    const adjacentChord = projectStore.findAdjacentChord(x, staffIndex);
    const staffY = this.svgYToStaffY(y, staffIndex);

    let newChord: ChordSpec | undefined;
    if (!adjacentChord) {
      newChord = {
        id: uuid(),
        staffIndex,
        x
      };
    }

    const chordId = adjacentChord ? adjacentChord.id : newChord!.id;

    projectStore.addNote(
      {
        ...cursorSpec,
        id: newNoteId,
        y: staffY,
        chordId: chordId
      },
      newChord
    );

    Audio.playChord(chordId);

    uiStore.mouseMode = MouseMode.DRAG;
    uiStore.dragNoteId = newNoteId;
    uiStore.dragStartClientX = e.clientX;
    uiStore.dragStartClientY = e.clientY;
    uiStore.dragStartStaffIndex = staffIndex;
    uiStore.dragStartX = x;
    uiStore.dragStartY = staffY;
  };

  svgYToStaffY(svgY: number, staffIndex: StaffIndex) {
    return svgY - staffIndex * (STAFF_HEIGHT + STAFF_MARGIN);
  }

  clientPositionToSvgPosition() {
    const { uiStore } = this.injected;
    const { cursorSpec, insertX, insertY } = uiStore;
    const { snapToStaff, currentSheetScroll, getSheetBoundingX } = this.props;

    if (!cursorSpec) {
      return;
    }

    let x = insertX;
    let y = insertY + currentSheetScroll;

    if (snapToStaff) {
      y = Math.round(y / (LINE_DY / 2)) * (LINE_DY / 2);
    }

    const bucketSize = STAFF_HEIGHT + STAFF_MARGIN;
    const staffIndex = Math.round(
      (y - SHEET_MARGIN_TOP - STAFF_MARGIN / 2) / bucketSize
    );

    if (cursorSpec.type === NoteType.REST) {
      // Rests are fixed to the top of the staff.
      y = staffIndex * (STAFF_HEIGHT + STAFF_MARGIN) + SHEET_MARGIN_TOP;
    }

    const sheetBoundingX = getSheetBoundingX();
    if (sheetBoundingX) {
      x -= sheetBoundingX;
    }

    y += MOUSE_OFFSET_Y;
    x += MOUSE_OFFSET_X;

    const yOnStaff = this.svgYToStaffY(y, staffIndex);

    const orientation =
      yOnStaff >= STAFF_HEIGHT / 2 ? NoteOrientation.UP : NoteOrientation.DOWN;

    return { x, y, orientation, staffIndex, yOnStaff };
  }

  render() {
    const { uiStore } = this.injected;
    const { cursorSpec } = uiStore;

    if (!cursorSpec || this.state.justMounted) {
      return <g />;
    }
    let { x, y, orientation } = this.clientPositionToSvgPosition()!;
    if (x < 0) {
      return <g />;
    }
    return (
      <RenderNote
        length={cursorSpec.length}
        type={cursorSpec.type}
        x={x}
        y={y}
        color={CURSOR_COLOR}
        cssClass="CursorNote"
        orientation={orientation}
        onMainMouseDown={this.onMouseDown}
      />
    );
  }
}

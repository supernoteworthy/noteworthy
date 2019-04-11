import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import uuid from 'uuid/v4';
import Accidental from '../Accidental/Accidental';
import Block from '../Block/Block';
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
import Repeat from '../Repeat/Repeat';
import Setter from '../Setter/Setter';
import { ProjectStore } from '../stores/project.store';
import { MouseMode, UiStore } from '../stores/ui.store';
import { ChordSpec } from '../types/ChordTypes';
import { NoteOrientation, NoteType } from '../types/NoteTypes';
import { ElementId, StaffIndex } from '../types/StaffTypes';

interface CursorElementProps {
  snapToStaff: boolean;
  getSheetBoundingX: () => { left: number; right: number } | undefined;
}

interface InjectedProps extends CursorElementProps {
  projectStore: ProjectStore;
  uiStore: UiStore;
}

@inject('projectStore', 'uiStore')
@observer
export default class CursorElement extends Component<CursorElementProps> {
  state = {
    justMounted: true
  };
  get injected() {
    return this.props as InjectedProps;
  }
  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mousedown', this.onMouseDown);
  }
  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mousedown', this.onMouseDown);
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
  onMouseDown = (e: MouseEvent) => {
    const { uiStore } = this.injected;
    const { cursorSpec } = uiStore;

    if (!cursorSpec || uiStore.mouseMode !== MouseMode.INSERT) {
      return;
    }
    const newElementId = uuid() as ElementId;

    const { projectStore, getSheetBoundingX } = this.injected;
    const { x, y, staffIndex } = this.clientPositionToSvgPosition()!;
    const boundingX = getSheetBoundingX();
    if (x < 0 || (boundingX && x + boundingX.left > boundingX.right)) {
      return;
    }
    const adjacentChord = projectStore.findAdjacentChord(x, staffIndex);
    const staffY = this.svgYToStaffY(y, staffIndex);

    uiStore.mouseMode = MouseMode.DRAG;
    uiStore.dragElementId = newElementId;
    uiStore.dragStartClientX = e.clientX;
    uiStore.dragStartClientY = e.clientY;
    uiStore.dragStartStaffIndex = staffIndex;
    uiStore.dragStartX = x;
    uiStore.dragStartY = staffY;

    if (cursorSpec.kind === 'note') {
      let newChord: ChordSpec | undefined;
      if (!adjacentChord) {
        newChord = {
          kind: 'chord',
          id: uuid(),
          staffIndex,
          x,
          y: 0
        };
      }

      const chordId = adjacentChord ? adjacentChord.id : newChord!.id;

      projectStore.addElement(
        {
          ...cursorSpec,
          id: newElementId,
          y: staffY,
          chordId: chordId
        },
        newChord
      );
    } else if (cursorSpec.kind === 'accidental') {
      projectStore.addElement({
        ...cursorSpec,
        id: newElementId,
        x,
        y: staffY,
        staffIndex
      });
    } else if (cursorSpec.kind === 'repeat') {
      projectStore.addElement({
        ...cursorSpec,
        id: newElementId,
        x,
        y: 0,
        staffIndex
      });
    } else if (cursorSpec.kind === 'setter') {
      projectStore.addElement({
        ...cursorSpec,
        id: newElementId,
        x,
        y: 0,
        staffIndex
      });
    } else if (cursorSpec.kind === 'block') {
      projectStore.addElement({
        ...cursorSpec,
        id: newElementId,
        x,
        y: 0,
        staffIndex
      });
    }
  };

  svgYToStaffY(svgY: number, staffIndex: StaffIndex) {
    return svgY - staffIndex * (STAFF_HEIGHT + STAFF_MARGIN);
  }

  clientPositionToSvgPosition() {
    const { uiStore } = this.injected;
    const { cursorSpec, insertX, insertY } = uiStore;
    const { snapToStaff, getSheetBoundingX } = this.props;
    if (!cursorSpec) {
      return;
    }

    let x = insertX;
    let y = insertY + uiStore.sheetScroll;

    if (snapToStaff) {
      y = Math.round(y / (LINE_DY / 2)) * (LINE_DY / 2);
    }

    const bucketSize = STAFF_HEIGHT + STAFF_MARGIN;
    const staffIndex = Math.round(
      (y - SHEET_MARGIN_TOP - STAFF_MARGIN / 2) / bucketSize
    );

    if (
      (cursorSpec.kind === 'note' && cursorSpec.type === NoteType.REST) ||
      cursorSpec.kind === 'repeat' ||
      cursorSpec.kind === 'setter' ||
      cursorSpec.kind === 'block'
    ) {
      // Rests, repeats, setters are fixed to the top of the staff.
      y = staffIndex * (STAFF_HEIGHT + STAFF_MARGIN) + SHEET_MARGIN_TOP;
    }

    const sheetBoundingX = getSheetBoundingX();
    if (sheetBoundingX) {
      x -= sheetBoundingX.left;
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
    switch (cursorSpec.kind) {
      case 'note':
        return (
          <RenderNote
            length={cursorSpec.length}
            type={cursorSpec.type}
            x={x}
            y={y}
            color={CURSOR_COLOR}
            cssClass="CursorNote"
            orientation={orientation}
          />
        );
      case 'accidental':
        return <Accidental x={x} y={y} type={cursorSpec.type} color="#ddd" />;
      case 'repeat':
        return (
          <Repeat
            x={x}
            y={y}
            type={cursorSpec.type}
            color={CURSOR_COLOR}
            shouldShowNumber={false}
          />
        );
      case 'block':
        return (
          <Block
            x={x}
            y={y}
            type={cursorSpec.type}
            color={CURSOR_COLOR}
            blockName=""
            shouldShowLabel={false}
          />
        );
      case 'setter':
        return (
          <Setter x={x} y={y} type={cursorSpec.type} color={CURSOR_COLOR} />
        );
    }
  }
}

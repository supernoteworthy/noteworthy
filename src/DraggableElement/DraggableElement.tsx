import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Accidental from '../Accidental/Accidental';
import Audio from '../Audio/Audio';
import { LINE_DY, STAFF_HEIGHT, STAFF_MARGIN } from '../constants';
import RenderNote from '../RenderNote/RenderNote';
import RepeatStartRender from '../Repeat/RepeatStartRender';
import { ProjectStore } from '../stores/project.store';
import { MouseMode, UiStore } from '../stores/ui.store';
import { NoteOrientation, NoteType } from '../types/NoteTypes';
import { ElementId } from '../types/StaffTypes';
import './DraggableElement.css';

interface DraggableElementProps {
  id: ElementId;
  snapToStaff: boolean;
}

interface InjectedProps extends DraggableElementProps {
  projectStore: ProjectStore;
  uiStore: UiStore;
}

@inject('projectStore', 'uiStore')
@observer
export default class DraggableElement extends Component<DraggableElementProps> {
  state = {
    justPlaced: false
  };

  get injected() {
    return this.props as InjectedProps;
  }

  get spec() {
    const { id } = this.props;
    const { projectStore } = this.injected;
    const specInStore = projectStore.getElementById(id);
    if (specInStore === undefined) {
      throw new Error(`Spec for element ${id} not found in project store.`);
    }
    return specInStore;
  }

  get x() {
    const { projectStore } = this.injected;
    const spec = this.spec;
    if (spec.kind === 'note') {
      const chord = projectStore.getChordById(spec.chordId);
      if (!chord) {
        throw new Error(`Note ${this.props.id} exists outside chord.`);
      }
      return chord.x;
    } else {
      return spec.x;
    }
  }

  get staffIndex() {
    const { projectStore } = this.injected;
    const spec = this.spec;
    if (spec.kind === 'note') {
      const chord = projectStore.getChordById(spec.chordId);
      if (!chord) {
        throw new Error(`Note ${this.props.id} exists outside chord.`);
      }
      return chord.staffIndex;
    } else {
      return spec.x;
    }
  }

  componentDidMount() {
    // Catch drag events when this element was just created.
    const { uiStore } = this.injected;
    if (uiStore.dragElementId === this.spec.id) {
      document.addEventListener('mouseup', this.onMouseUp);
      document.addEventListener('mousemove', this.onMouseMove);
      this.setState({ justPlaced: true });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  onMouseDown = (e: React.MouseEvent<SVGRectElement>) => {
    const { uiStore } = this.injected;
    uiStore.mouseMode = MouseMode.DRAG;
    uiStore.dragElementId = this.spec.id;
    uiStore.dragStartX = this.x;
    uiStore.dragStartY = this.spec.y;
    uiStore.dragStartStaffIndex = this.staffIndex;
    uiStore.dragStartClientX = e.clientX;
    uiStore.dragStartClientY = e.clientY;
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
  };

  onMouseMove = (e: MouseEvent) => {
    const { id } = this.props;
    const { projectStore, uiStore } = this.injected;
    const startingY = this.spec.y;
    const {
      dragStartX,
      dragStartY,
      dragStartClientX,
      dragStartClientY
    } = uiStore;
    let { x, y } = this.getXYSnappedToStaff(
      dragStartX! + (e.clientX - dragStartClientX!),
      dragStartY! + (e.clientY - dragStartClientY!)
    );
    const staffIndexAndY = this.getNewStaffIndexAndY(y);
    const positionChanged = staffIndexAndY.y !== startingY;
    projectStore.setElementPosition(
      id,
      x,
      staffIndexAndY.y,
      staffIndexAndY.staffIndex
    );
    if (this.spec.kind === 'note') {
      uiStore.activeChord = projectStore.findAdjacentChord(
        x,
        staffIndexAndY.staffIndex,
        this.spec.chordId
      );
      if (positionChanged) {
        Audio.playChord(this.spec.chordId!);
      }
    }
    uiStore.dragActiveStaffIndex = staffIndexAndY.staffIndex;
  };

  onMouseUp = () => {
    const { uiStore, projectStore } = this.injected;
    uiStore.mouseMode = MouseMode.INSERT;

    const deleted = this.x < 0;

    const tapped =
      uiStore.dragStartX === this.x &&
      uiStore.dragStartY === this.spec.y &&
      uiStore.dragStartStaffIndex === this.staffIndex &&
      !this.state.justPlaced;

    this.setState({ justPlaced: false });

    if (deleted) {
      Audio.playEffect('delete');
      projectStore.deleteElement(this.spec.id);
    } else if (tapped && this.spec.kind === 'note') {
      Audio.playChord(this.spec.chordId!);
    }

    if (this.spec.kind === 'note' && uiStore.activeChord) {
      projectStore.updateNoteChord(this.spec.id, uiStore.activeChord.id);
    }

    uiStore.dragElementId = undefined;
    uiStore.dragStartX = undefined;
    uiStore.dragStartY = undefined;
    uiStore.dragStartStaffIndex = undefined;
    uiStore.activeChord = undefined;
    uiStore.dragStartClientX = undefined;
    uiStore.dragStartClientY = undefined;

    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
  };

  getXYSnappedToStaff(x: number, y: number) {
    const { snapToStaff } = this.props;
    if (!snapToStaff) {
      return { x, y };
    }
    if (this.spec.kind === 'note' && this.spec.type === NoteType.REST) {
      return {
        x,
        y: 0
      };
    } else {
      return { x, y: Math.round(y / (LINE_DY / 2)) * (LINE_DY / 2) };
    }
  }

  getNewStaffIndexAndY(y: number) {
    const staffIndex = this.injected.uiStore.dragStartStaffIndex!;
    const absoluteY = y + (staffIndex || 0) * (STAFF_HEIGHT + STAFF_MARGIN);
    const bucketSize = STAFF_HEIGHT + STAFF_MARGIN;
    let newStaffIndex = Math.round((absoluteY - STAFF_MARGIN / 2) / bucketSize);
    newStaffIndex = Math.max(
      0,
      Math.min(this.injected.projectStore.staffList.length - 1, newStaffIndex)
    );
    const finalY = absoluteY - newStaffIndex * (STAFF_HEIGHT + STAFF_MARGIN);
    return {
      staffIndex: newStaffIndex,
      y: finalY
    };
  }

  get orientation() {
    const { y } = this.spec;
    return y >= STAFF_HEIGHT / 2 ? NoteOrientation.UP : NoteOrientation.DOWN;
  }

  render() {
    const { uiStore } = this.injected;
    const spec = this.spec;
    const { id } = spec;
    const dragging = uiStore.dragElementId === id;
    switch (spec.kind) {
      case 'note':
        return (
          <RenderNote
            cssClass="DraggableNote"
            length={length}
            type={spec.type}
            color={spec.isPlaying ? '#900' : '#000'}
            x={this.x}
            y={spec.y}
            orientation={this.orientation}
            isSelected={dragging}
            onMainMouseDown={this.onMouseDown}
            onMainMouseEnter={() => {
              uiStore.mouseMode = MouseMode.DRAG;
              uiStore.dragActiveStaffIndex = this.staffIndex;
            }}
            onMainMouseLeave={() =>
              !dragging && (uiStore.mouseMode = MouseMode.INSERT)
            }
          />
        );
      case 'accidental':
        return (
          <Accidental type={spec.type} x={spec.x} y={spec.y} color="#000" />
        );
      case 'repeat':
        return <RepeatStartRender x={spec.x} />;
    }
  }
}

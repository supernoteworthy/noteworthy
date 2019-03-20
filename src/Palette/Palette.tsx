import { inject } from 'mobx-react';
import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import Accidental from '../Accidental/Accidental';
import RenderNote from '../RenderNote/RenderNote';
import Repeat from '../Repeat/Repeat';
import { UiStore } from '../stores/ui.store';
import { AccidentalSpec, AccidentalType } from '../types/AccidentalTypes';
import { NoteOrientation, NoteSpec, NoteType } from '../types/NoteTypes';
import { RepeatSpec, RepeatType } from '../types/RepeatTypes';
import { StaffElement } from '../types/StaffTypes';
import './Palette.css';
import { PALETTE_NOTES } from './PaletteNotes';

interface PaletteProps {}

interface InjectedProps extends PaletteProps {
  uiStore: UiStore;
}

@inject('uiStore')
export default class Palette extends Component<PaletteProps> {
  state = {
    selectedNote: 'EIGHTH'
  };

  get injected() {
    return this.props as InjectedProps;
  }

  componentDidMount() {
    const { uiStore } = this.injected;
    const noteSpec = PALETTE_NOTES.find(
      note => note.id === this.state.selectedNote
    );
    if (noteSpec) {
      const cursorSpec = {
        ...noteSpec,
        staffIndex: 0
      } as StaffElement;
      uiStore.cursorSpec = cursorSpec;
    }
  }

  render() {
    const { uiStore } = this.injected;
    const { selectedNote } = this.state;
    return (
      <div className="Palette">
        <ReactTooltip
          place="right"
          effect="solid"
          className="PaletteTooltip"
          type="info"
        />
        <svg>
          {PALETTE_NOTES.map(note => {
            switch (note.kind) {
              case 'note':
                return (
                  <RenderNote
                    tooltip={note.tooltip}
                    key={note.id}
                    length={note.length!}
                    type={note.type as NoteType}
                    isSelected={selectedNote === note.id}
                    orientation={NoteOrientation.UP}
                    x={note.x}
                    y={note.y}
                    onMouseDown={() => {
                      this.setState({ selectedNote: note.id });
                      const spec = Object.assign(
                        { isPlaying: false },
                        note
                      ) as NoteSpec;
                      uiStore.cursorSpec = spec;
                    }}
                    color="#fff"
                    cssClass="PaletteNote"
                  />
                );
              case 'repeat':
                return (
                  <Repeat
                    key={note.id}
                    x={note.x}
                    y={note.y}
                    type={note.type as RepeatType}
                    tooltip={note.tooltip}
                    onMouseDown={() => {
                      this.setState({ selectedNote: note.id });
                      const spec = Object.assign({}, note) as RepeatSpec;
                      uiStore.cursorSpec = spec;
                    }}
                    isSelected={selectedNote === note.id}
                    color="#fff"
                  />
                );
              case 'accidental':
                return (
                  <Accidental
                    key={note.id}
                    x={note.x}
                    y={note.y}
                    color="#fff"
                    tooltip={note.tooltip}
                    onMouseDown={() => {
                      this.setState({ selectedNote: note.id });
                      const spec = Object.assign({}, note) as AccidentalSpec;
                      uiStore.cursorSpec = spec;
                    }}
                    isSelected={selectedNote === note.id}
                    type={note.type as AccidentalType}
                  />
                );
            }
          })}
        </svg>
      </div>
    );
  }
}

import { Tooltip } from 'antd';
import { inject } from 'mobx-react';
import React, { Component } from 'react';
import Accidental from '../Accidental/Accidental';
import RenderNote from '../RenderNote/RenderNote';
import Repeat from '../Repeat/Repeat';
import { UiStore } from '../stores/ui.store';
import { AccidentalSpec, AccidentalType } from '../types/AccidentalTypes';
import { NoteOrientation, NoteSpec, NoteType } from '../types/NoteTypes';
import { MatchType, RepeatSpec } from '../types/RepeatTypes';
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
        <svg>
          <g className="PaletteItem">
            {PALETTE_NOTES.map(note => {
              switch (note.kind) {
                case 'note':
                  return (
                    <Tooltip
                      title={note.tooltip}
                      placement="right"
                      key={note.id}
                    >
                      <RenderNote
                        length={note.length!}
                        type={note.type as NoteType}
                        isSelected={selectedNote === note.id}
                        orientation={NoteOrientation.UP}
                        x={note.x}
                        y={note.y}
                        onMouseDown={() => {
                          this.setState({ selectedNote: note.id });
                          const spec = Object.assign(
                            { isPlaying: false, nextElement: undefined },
                            note
                          ) as NoteSpec;
                          uiStore.cursorSpec = spec;
                        }}
                        color="#fff"
                        cssClass="PaletteNote"
                      />
                    </Tooltip>
                  );
                case 'repeat':
                  return (
                    <Tooltip
                      title={note.tooltip}
                      placement="right"
                      key={note.id}
                    >
                      <Repeat
                        x={note.x}
                        y={note.y}
                        type={note.type as MatchType}
                        onMouseDown={() => {
                          this.setState({ selectedNote: note.id });
                          const spec = Object.assign(
                            { nRepeats: 2 },
                            note
                          ) as RepeatSpec;
                          uiStore.cursorSpec = spec;
                        }}
                        isSelected={selectedNote === note.id}
                        color="#fff"
                        shouldShowNumber={false}
                      />
                    </Tooltip>
                  );
                case 'accidental':
                  return (
                    <Tooltip
                      title={note.tooltip}
                      placement="right"
                      key={note.id}
                    >
                      <Accidental
                        x={note.x}
                        y={note.y}
                        color="#fff"
                        onMouseDown={() => {
                          this.setState({ selectedNote: note.id });
                          const spec = Object.assign(
                            {},
                            note
                          ) as AccidentalSpec;
                          uiStore.cursorSpec = spec;
                        }}
                        isSelected={selectedNote === note.id}
                        type={note.type as AccidentalType}
                      />
                    </Tooltip>
                  );
              }
            })}
          </g>
        </svg>
      </div>
    );
  }
}

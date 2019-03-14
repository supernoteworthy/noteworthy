import { inject } from 'mobx-react';
import React, { Component } from 'react';
import RenderNote from '../RenderNote/RenderNote';
import { UiStore } from '../stores/ui.store';
import { NoteOrientation, NoteSpec } from '../types/NoteTypes';
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
      uiStore.cursorSpec = noteSpec;
    }
  }

  render() {
    const { uiStore } = this.injected;
    const { selectedNote } = this.state;
    return (
      <div className="Palette">
        <svg width="100%" height="100%">
          {PALETTE_NOTES.map(note => (
            <RenderNote
              key={note.id}
              length={note.length}
              type={note.type}
              isSelected={selectedNote === note.id}
              orientation={NoteOrientation.UP}
              x={note.x}
              y={note.y}
              onMouseDown={() => {
                this.setState({ selectedNote: note.id });
                const spec: NoteSpec = Object.assign({}, note);
                uiStore.cursorSpec = spec;
              }}
              color="#fff"
              cssClass="PaletteNote"
            />
          ))}
        </svg>
      </div>
    );
  }
}

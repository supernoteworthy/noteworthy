import { Tooltip } from 'antd';
import { inject } from 'mobx-react';
import React, { Component } from 'react';
import Accidental from '../Accidental/Accidental';
import Block from '../Block/Block';
import RenderNote from '../RenderNote/RenderNote';
import Repeat from '../Repeat/Repeat';
import Setter from '../Setter/Setter';
import { UiStore } from '../stores/ui.store';
import { AccidentalSpec, AccidentalType } from '../types/AccidentalTypes';
import { BlockMatchType, BlockSpec } from '../types/BlockTypes';
import { NoteOrientation, NoteSpec, NoteType } from '../types/NoteTypes';
import { MatchType, RepeatSpec } from '../types/RepeatTypes';
import { setterDefaults, SetterSpec, SetterType } from '../types/SetterTypes';
import { StaffElement } from '../types/StaffTypes';
import CategoryMenu from './CategoryMenu';
import './Palette.css';
import { PALETTE_ELEMENTS } from './PaletteElements';

interface PaletteProps {}

interface InjectedProps extends PaletteProps {
  uiStore: UiStore;
}

@inject('uiStore')
export default class Palette extends Component<PaletteProps> {
  state = {
    selectedNote: 'EIGHTH',
    currentCategory: 'Notes'
  };

  get injected() {
    return this.props as InjectedProps;
  }

  componentDidMount() {
    const { uiStore } = this.injected;
    const noteSpec = PALETTE_ELEMENTS.find(
      note => note.id === this.state.selectedNote
    );
    if (noteSpec) {
      const cursorSpec = {
        ...noteSpec,
        y: 0,
        staffIndex: 0
      } as StaffElement;
      uiStore.cursorSpec = cursorSpec;
    }
  }

  render() {
    const { uiStore } = this.injected;
    const { selectedNote, currentCategory } = this.state;
    const currentPaletteElements = PALETTE_ELEMENTS.filter(
      element => element.category === currentCategory
    );
    let currentY = 50;
    const totalHeight =
      currentPaletteElements.reduce(
        (previous, element) =>
          previous + element.height + (element.yOffset || 0),
        currentY
      ) + 50;
    return (
      <div className="Palette">
        <CategoryMenu
          options={PALETTE_ELEMENTS.map(element => element.category).filter(
            (value, index, array) => array.indexOf(value) === index
          )}
          onChange={newCategory =>
            this.setState({ currentCategory: newCategory })
          }
          currentCategory={currentCategory}
        />
        <div className="Palette_scroll">
          <svg height={totalHeight}>
            <g className="PaletteItem">
              {currentPaletteElements.map(element => {
                const y = currentY + (element.yOffset || 0);
                currentY += element.height + (element.yOffset || 0);
                switch (element.kind) {
                  case 'note':
                    return (
                      <Tooltip
                        title={element.tooltip}
                        placement="right"
                        key={element.id}
                      >
                        <RenderNote
                          length={element.length!}
                          type={element.type as NoteType}
                          isSelected={selectedNote === element.id}
                          orientation={NoteOrientation.UP}
                          x={element.x}
                          y={y}
                          onMouseDown={() => {
                            this.setState({ selectedNote: element.id });
                            const spec = Object.assign(
                              {
                                isPlaying: false,
                                nextElement: undefined,
                                y: 0
                              },
                              element
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
                        title={element.tooltip}
                        placement="right"
                        key={element.id}
                      >
                        <Repeat
                          x={element.x}
                          y={y}
                          type={element.type as MatchType}
                          onMouseDown={() => {
                            this.setState({ selectedNote: element.id });
                            const spec = Object.assign(
                              { nRepeats: 2, y: 0 },
                              element
                            ) as RepeatSpec;
                            uiStore.cursorSpec = spec;
                          }}
                          isSelected={selectedNote === element.id}
                          color="#fff"
                          shouldShowNumber={false}
                        />
                      </Tooltip>
                    );
                  case 'block':
                    return (
                      <Tooltip
                        title={element.tooltip}
                        placement="right"
                        key={element.id}
                      >
                        <Block
                          x={element.x}
                          y={y}
                          type={element.type as BlockMatchType}
                          onMouseDown={() => {
                            this.setState({ selectedNote: element.id });
                            const spec = Object.assign(
                              { blockName: '...', y: 0 },
                              element
                            ) as BlockSpec;
                            uiStore.cursorSpec = spec;
                          }}
                          isSelected={selectedNote === element.id}
                          color="#fff"
                          shouldShowLabel={false}
                          blockName=""
                        />
                      </Tooltip>
                    );
                  case 'accidental':
                    return (
                      <Tooltip
                        title={element.tooltip}
                        placement="right"
                        key={element.id}
                      >
                        <Accidental
                          x={element.x}
                          y={y}
                          color="#fff"
                          onMouseDown={() => {
                            this.setState({ selectedNote: element.id });
                            const spec = Object.assign(
                              { y: 0 },
                              element
                            ) as AccidentalSpec;
                            uiStore.cursorSpec = spec;
                          }}
                          isSelected={selectedNote === element.id}
                          type={element.type as AccidentalType}
                        />
                      </Tooltip>
                    );
                  case 'setter':
                    return (
                      <Tooltip
                        title={element.tooltip}
                        placement="right"
                        key={element.id}
                      >
                        <Setter
                          x={element.x}
                          y={y}
                          color="#fff"
                          onMouseDown={() => {
                            this.setState({ selectedNote: element.id });
                            const spec = Object.assign(
                              {
                                value: setterDefaults[element.type!],
                                y: 0
                              },
                              element
                            ) as SetterSpec;
                            uiStore.cursorSpec = spec;
                          }}
                          isSelected={selectedNote === element.id}
                          type={element.type as SetterType}
                        />
                      </Tooltip>
                    );
                }
              })}
            </g>
          </svg>
        </div>
      </div>
    );
  }
}

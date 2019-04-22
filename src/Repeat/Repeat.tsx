import { InputNumber, Popover } from 'antd';
import classNames from 'classnames';
import { inject } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import { LINE_DY, STAFF_HEIGHT } from '../constants';
import { ProjectStore } from '../stores/project.store';
import { MouseMode, UiStore } from '../stores/ui.store';
import { MatchType, RepeatId, RepeatSpec } from '../types/RepeatTypes';
import { SheetId } from '../types/SheetTypes';
import { StaffIndex } from '../types/StaffTypes';
import './Repeat.css';

interface RepeatProps {
  id?: RepeatId;
  sheetId?: SheetId;
  x: number;
  y: number;
  staffIndex?: StaffIndex;
  nRepeats?: number;
  color: string;
  type: MatchType;
  onMouseDown?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<SVGRectElement>) => void;
  onHitBoxMouseDown?: (e: React.MouseEvent<SVGRectElement>) => void;
  onHitBoxMouseEnter?: (e: React.MouseEvent<SVGRectElement>) => void;
  onHitBoxMouseLeave?: (e: React.MouseEvent<SVGRectElement>) => void;
  isSelected?: boolean;
  shouldShowNumber: boolean;
}

interface InjectedProps extends RepeatProps {
  uiStore: UiStore;
  projectStore: ProjectStore;
}

@inject('uiStore', 'projectStore')
export default class Repeat extends Component<RepeatProps> {
  get injected() {
    return this.props as InjectedProps;
  }
  render() {
    const {
      x,
      y,
      type,
      color,
      isSelected,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onHitBoxMouseDown,
      onHitBoxMouseEnter,
      onHitBoxMouseLeave,
      shouldShowNumber,
      nRepeats,
      sheetId
    } = this.props;
    const { uiStore, projectStore } = this.injected;

    const repeatEditor = (
      <Popover
        content={
          <Fragment>
            <InputNumber
              autoFocus
              min={2}
              precision={0}
              value={nRepeats || 2}
              onChange={value => {
                if (!sheetId || !this.props.id) {
                  return;
                }
                const element = projectStore.getElementById(
                  sheetId,
                  this.props.id!
                ) as RepeatSpec;
                element.nRepeats = value || 2;
              }}
            />
            {' times'}
          </Fragment>
        }
        placement="bottom"
        onVisibleChange={visible => {
          if (visible) {
            uiStore.mouseMode = MouseMode.POPOVER;
          } else {
            uiStore.mouseMode = MouseMode.INSERT;
          }
        }}
      >
        <text x={8} y={100}>
          {nRepeats || 2} times
        </text>
      </Popover>
    );

    const selectBoxClasses = classNames('SelectBox', {
      'SelectBox--selected': isSelected
    });
    const mainBoxClasses = classNames('MainBox', {
      'MainBox--selected': isSelected
    });
    let paths;
    if (type === MatchType.START) {
      paths = (
        <Fragment>
          <line x1={5} x2={5} y1={0} y2={STAFF_HEIGHT} stroke={color} />
          <line
            x1={0}
            x2={0}
            y1={0}
            y2={STAFF_HEIGHT}
            stroke={color}
            strokeWidth="4"
          />
          <circle cx={9} cy={LINE_DY * 1.5} r={2} fill={color} />
          <circle cx={9} cy={LINE_DY * 2.5} r={2} fill={color} />
        </Fragment>
      );
    } else {
      paths = (
        <Fragment>
          <line x1={5} x2={5} y1={0} y2={STAFF_HEIGHT} stroke={color} />
          <line
            x1={9}
            x2={9}
            y1={0}
            y2={STAFF_HEIGHT}
            stroke={color}
            strokeWidth="4"
          />
          <circle cx={0} cy={LINE_DY * 1.5} r={2} fill={color} />
          <circle cx={0} cy={LINE_DY * 2.5} r={2} fill={color} />
        </Fragment>
      );
    }
    return (
      <g transform={`translate(${x}, ${y})`} className="Repeat">
        {paths}
        <rect
          width="20"
          height="90"
          x="-3"
          y="-5"
          rx="3"
          ry="3"
          className={selectBoxClasses}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
        <rect
          width="20"
          height="90"
          x="-3"
          y="-5"
          rx="3"
          ry="3"
          className={mainBoxClasses}
          onMouseDown={onHitBoxMouseDown}
          onMouseEnter={onHitBoxMouseEnter}
          onMouseLeave={onHitBoxMouseLeave}
        />
        {shouldShowNumber && type === MatchType.END && repeatEditor}
      </g>
    );
  }
}

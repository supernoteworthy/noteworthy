import { InputNumber, Popover } from 'antd';
import classNames from 'classnames';
import { inject } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import { LINE_DY, STAFF_HEIGHT } from '../constants';
import { ProjectStore } from '../stores/project.store';
import { MouseMode, UiStore } from '../stores/ui.store';
import { RepeatId, RepeatSpec, RepeatType } from '../types/RepeatTypes';
import { StaffIndex } from '../types/StaffTypes';
import './Repeat.css';

interface RepeatProps {
  id?: RepeatId;
  x: number;
  y: number;
  staffIndex?: StaffIndex;
  nRepeats?: number;
  color: string;
  type: RepeatType;
  onMouseDown?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMainMouseDown?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMainMouseEnter?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMainMouseLeave?: (e: React.MouseEvent<SVGRectElement>) => void;
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
      onMainMouseDown,
      onMainMouseEnter,
      onMainMouseLeave,
      shouldShowNumber,
      nRepeats
    } = this.props;
    const { uiStore, projectStore } = this.injected;

    const repeatEditor = (
      <Popover
        content={
          <Fragment>
            <InputNumber
              autoFocus
              min={1}
              precision={0}
              value={nRepeats || 1}
              onChange={value => {
                const element = projectStore.getElementById(
                  this.props.id!
                ) as RepeatSpec;
                element.nRepeats = value;
              }}
            />{' '}
            {nRepeats === 1 ? 'time' : 'times'}
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
          {nRepeats || 0}
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
    if (type === RepeatType.START) {
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
          onMouseDown={onMainMouseDown}
          onMouseEnter={onMainMouseEnter}
          onMouseLeave={onMainMouseLeave}
        />
        {shouldShowNumber && type === RepeatType.END && repeatEditor}
      </g>
    );
  }
}

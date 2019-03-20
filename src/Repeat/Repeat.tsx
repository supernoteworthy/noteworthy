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
  nRepeats?: string;
  color: string;
  type: RepeatType;
  tooltip?: string;
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
  onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { projectStore } = this.injected;
    const element = projectStore.getElementById(this.props.id!) as RepeatSpec;
    const target = event.target as HTMLInputElement;
    element.nRepeats = target.value;
  };
  onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' || event.key === 'Enter') {
      (event.target as HTMLInputElement).blur();
    }
  };
  render() {
    const {
      x,
      y,
      type,
      color,
      tooltip,
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
    const { uiStore } = this.injected;
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
      <g transform={`translate(${x}, ${y})`} data-tip={tooltip}>
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
        {shouldShowNumber && type === RepeatType.END && (
          <foreignObject x="-5" y="85" width="30" height="25">
            <input
              className="Repeat_NumberEditor"
              onMouseEnter={() => {
                uiStore.mouseMode = MouseMode.DRAG;
              }}
              onMouseLeave={() => {
                uiStore.mouseMode = MouseMode.INSERT;
              }}
              onClick={event => {
                (event.target as HTMLInputElement).select();
              }}
              value={nRepeats}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
            />
          </foreignObject>
        )}
      </g>
    );
  }
}

import classNames from 'classnames';
import React, { Component, Fragment } from 'react';
import { LINE_DY, STAFF_HEIGHT } from '../constants';
import { RepeatType } from '../types/RepeatTypes';
import { StaffIndex } from '../types/StaffTypes';

interface RepeatProps {
  x: number;
  y: number;
  staffIndex?: StaffIndex;
  nRepeats?: number;
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
}
export default class Repeat extends Component<RepeatProps> {
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
      onMainMouseLeave
    } = this.props;
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
      </g>
    );
  }
}

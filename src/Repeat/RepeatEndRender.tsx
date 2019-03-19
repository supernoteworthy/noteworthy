import React, { Component } from 'react';
import { LINE_DY, STAFF_HEIGHT } from '../constants';

interface RepeatEndRenderProps {
  x: number;
}

export default class RepeatEndRender extends Component<RepeatEndRenderProps> {
  render() {
    const { x } = this.props;
    return (
      <g>
        <line x1={x + 5} x2={x + 5} y1={0} y2={STAFF_HEIGHT} stroke="#000" />
        <line
          x1={x + 9}
          x2={x + 9}
          y1={0}
          y2={STAFF_HEIGHT}
          stroke="#000"
          strokeWidth="4"
        />
        <circle cx={x} cy={LINE_DY * 1.5} r={2} fill="#000" />
        <circle cx={x} cy={LINE_DY * 2.5} r={2} fill="#000" />
      </g>
    );
  }
}

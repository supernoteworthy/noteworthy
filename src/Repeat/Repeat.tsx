import React, { Component, Fragment } from 'react';
import { StaffIndex } from '../types/StaffTypes';
import RepeatEndRender from './RepeatEndRender';
import RepeatStartRender from './RepeatStartRender';

interface RepeatProps {
  startX: number;
  startStaff: StaffIndex;
  endX: number;
  endStaff: StaffIndex;
  nRepeats: number;
}
export default class Repeat extends Component<RepeatProps> {
  render() {
    const { startX, endX } = this.props;
    return (
      <Fragment>
        <RepeatStartRender x={startX} />
        <RepeatEndRender x={endX} />
      </Fragment>
    );
  }
}

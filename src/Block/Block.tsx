import { Input, Popover } from 'antd';
import classNames from 'classnames';
import { inject } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import { ProjectStore } from '../stores/project.store';
import { MouseMode, UiStore } from '../stores/ui.store';
import { BlockId, BlockMatchType, BlockSpec } from '../types/BlockTypes';
import { StaffIndex } from '../types/StaffTypes';
import './Block.css';

interface BlockProps {
  id?: BlockId;
  x: number;
  y: number;
  staffIndex?: StaffIndex;
  blockName: string;
  color: string;
  type: BlockMatchType;
  onMouseDown?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<SVGRectElement>) => void;
  onHitBoxMouseDown?: (e: React.MouseEvent<SVGRectElement>) => void;
  onHitBoxMouseEnter?: (e: React.MouseEvent<SVGRectElement>) => void;
  onHitBoxMouseLeave?: (e: React.MouseEvent<SVGRectElement>) => void;
  isSelected?: boolean;
  shouldShowLabel: boolean;
}

interface InjectedProps extends BlockProps {
  uiStore: UiStore;
  projectStore: ProjectStore;
}

@inject('uiStore', 'projectStore')
export default class Block extends Component<BlockProps> {
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
      shouldShowLabel,
      blockName
    } = this.props;
    const { uiStore, projectStore } = this.injected;

    const blockEditor = (
      <Popover
        content={
          <Fragment>
            <Input
              autoFocus
              value={blockName}
              onChange={e => {
                const element = projectStore.getElementById(
                  this.props.id!
                ) as BlockSpec;
                element.blockName = e.target.value;
              }}
            />
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
        <text x={5} y={100}>
          {blockName}
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
    let boundingBoxes = (
      <Fragment>
        <rect
          width="20"
          height="90"
          x="0"
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
          x="0"
          y="-5"
          rx="3"
          ry="3"
          className={mainBoxClasses}
          onMouseDown={onHitBoxMouseDown}
          onMouseEnter={onHitBoxMouseEnter}
          onMouseLeave={onHitBoxMouseLeave}
        />
      </Fragment>
    );
    if (type === BlockMatchType.START) {
      paths = (
        <path
          fill={color}
          d="M 13.453 19.032 L 13.633 29.242 C 13.633 32.249 12.593 34.672 10.513 36.512 C 10.206 36.819 9.683 37.279 8.943 37.892 C 7.716 38.999 7.103 39.675 7.103 39.922 L 7.473 40.652 C 7.593 40.779 8.036 41.162 8.803 41.802 C 9.57 42.449 10.076 42.879 10.323 43.092 C 10.57 43.305 10.97 43.749 11.523 44.422 C 12.076 45.102 12.443 45.685 12.623 46.172 C 13.296 47.645 13.633 49.149 13.633 50.682 L 13.453 60.892 L 13.733 71.382 C 13.733 72.302 14.053 73.392 14.693 74.652 C 15.34 75.905 16 76.932 16.673 77.732 L 17.593 78.922 C 17.84 79.169 17.963 79.385 17.963 79.572 C 17.963 79.939 17.593 80.122 16.853 80.122 C 16.12 80.122 14.433 79.449 11.793 78.102 C 9.16 76.749 7.43 75.599 6.603 74.652 C 5.77 73.699 5.353 72.702 5.353 71.662 C 5.54 66.875 5.633 62.182 5.633 57.582 C 5.633 52.982 5.526 49.839 5.313 48.152 C 5.1 46.465 4.7 45.255 4.113 44.522 C 3.533 43.782 2.706 42.892 1.633 41.852 C 0.56 40.805 0.023 40.192 0.023 40.012 L 0.293 39.362 C 0.54 39.122 0.97 38.725 1.583 38.172 C 2.196 37.619 2.596 37.235 2.783 37.022 C 2.963 36.809 3.253 36.485 3.653 36.052 C 4.053 35.625 4.313 35.259 4.433 34.952 C 4.56 34.645 4.713 34.275 4.893 33.842 C 5.386 32.682 5.633 28.849 5.633 22.342 L 5.353 8.272 C 5.353 5.205 9.033 2.445 16.393 -0.008 C 16.58 -0.068 16.886 -0.098 17.313 -0.098 C 17.746 -0.098 17.963 0.039 17.963 0.312 C 17.963 0.585 17.84 0.845 17.593 1.092 C 15.02 4.039 13.733 6.522 13.733 8.542 C 13.546 10.995 13.453 14.492 13.453 19.032 Z"
        />
      );
    } else if (type === BlockMatchType.END) {
      paths = (
        <path
          fill={color}
          d="M 4.192 61.036 L 4.012 50.826 C 4.012 47.699 5.115 45.186 7.322 43.286 C 7.569 43.039 8.075 42.593 8.842 41.946 C 9.609 41.306 10.082 40.893 10.262 40.706 C 10.449 40.519 10.542 40.319 10.542 40.106 C 10.542 39.893 10.402 39.649 10.122 39.376 C 9.849 39.096 9.359 38.649 8.652 38.036 C 7.945 37.423 7.439 36.979 7.132 36.706 C 6.825 36.426 6.429 35.996 5.942 35.416 C 5.449 34.836 5.112 34.269 4.932 33.716 C 4.319 32.303 4.012 30.859 4.012 29.386 L 4.192 19.176 L 3.912 8.686 C 3.912 6.913 2.962 4.829 1.062 2.436 L 0.052 1.236 C -0.195 0.989 -0.318 0.729 -0.318 0.456 C -0.318 0.183 -0.011 0.046 0.602 0.046 L 1.252 0.136 C 8.612 2.589 12.292 5.349 12.292 8.416 C 12.105 13.196 12.012 17.886 12.012 22.486 C 12.012 27.086 12.089 30.046 12.242 31.366 C 12.395 32.686 12.565 33.559 12.752 33.986 C 12.932 34.419 13.085 34.789 13.212 35.096 C 13.332 35.403 13.592 35.769 13.992 36.196 C 14.392 36.629 14.682 36.953 14.862 37.166 C 15.049 37.379 15.449 37.763 16.062 38.316 C 17.102 39.236 17.622 39.819 17.622 40.066 C 17.622 40.306 17.532 40.519 17.352 40.706 C 15.385 42.606 14.112 43.926 13.532 44.666 C 12.945 45.399 12.545 46.609 12.332 48.296 C 12.119 49.983 12.012 53.126 12.012 57.726 L 12.292 71.806 C 12.292 72.846 11.875 73.843 11.042 74.796 C 10.215 75.743 8.485 76.893 5.852 78.246 C 3.212 79.593 1.525 80.266 0.792 80.266 C 0.052 80.266 -0.318 80.083 -0.318 79.716 C -0.318 79.529 -0.195 79.313 0.052 79.066 C 2.625 76.066 3.912 73.553 3.912 71.526 C 4.099 69.073 4.192 65.576 4.192 61.036 Z"
        />
      );
    } else {
      paths = <path fill={color} d="M 0 20 L 0 60 L 40 40 Z" />;
      boundingBoxes = (
        <Fragment>
          <rect
            width="40"
            height="40"
            x="0"
            y="20"
            rx="3"
            ry="3"
            className={selectBoxClasses}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            width="40"
            height="40"
            x="0"
            y="20"
            rx="3"
            ry="3"
            className={mainBoxClasses}
            onMouseDown={onHitBoxMouseDown}
            onMouseEnter={onHitBoxMouseEnter}
            onMouseLeave={onHitBoxMouseLeave}
          />
        </Fragment>
      );
    }
    return (
      <g transform={`translate(${x}, ${y})`} className="Block">
        {paths}
        {boundingBoxes}
        {shouldShowLabel &&
          (type === BlockMatchType.END || type === BlockMatchType.PLAY) &&
          blockEditor}
      </g>
    );
  }
}

import classNames from 'classnames';
import React, { Component, Fragment } from 'react';
import { AccidentalType } from '../types/AccidentalTypes';

interface AccidentalProps {
  type: AccidentalType;
  x: number;
  y: number;
  color: string;
  onMouseDown?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<SVGRectElement>) => void;
  onHitBoxMouseDown?: (e: React.MouseEvent<SVGRectElement>) => void;
  onHitBoxMouseEnter?: (e: React.MouseEvent<SVGRectElement>) => void;
  onHitBoxMouseLeave?: (e: React.MouseEvent<SVGRectElement>) => void;
  isSelected?: boolean;
}
export default class Accidental extends Component<AccidentalProps> {
  render() {
    const {
      x,
      y,
      type,
      color,
      isSelected,
      onHitBoxMouseDown,
      onHitBoxMouseEnter,
      onHitBoxMouseLeave,
      onMouseDown,
      onMouseEnter,
      onMouseLeave
    } = this.props;
    const selectBoxClasses = classNames('SelectBox', {
      'SelectBox--selected': isSelected
    });
    const mainBoxClasses = classNames('MainBox', {
      'MainBox--selected': isSelected
    });
    let renderPath;
    if (type === AccidentalType.FLAT) {
      renderPath = (
        <Fragment>
          <path
            fill={color}
            d="M 9.003 -0.087 C 6.793 2.673 4.935 4.255 2.486 6.113 L 2.486 -3.034 C 3.042 -4.44 3.864 -5.579 4.953 -6.453 C 6.038 -7.323 7.138 -7.76 8.252 -7.76 C 13.455 -7.006 11.632 -2.583 9.003 -0.087 Z M 2.486 -7.542 L 2.486 -33.174 L 0.501 -33.174 L 0.501 7.777 C 0.501 9.017 0.839 9.638 1.516 9.638 C 1.907 9.638 2.394 9.31 3.12 8.876 C 8.062 5.831 11.234 3.367 14.406 -0.979 C 15.386 -2.322 16.077 -5.371 14.66 -7.5 C 13.775 -8.825 12.09 -10.221 9.93 -10.633 C 7.131 -11.165 4.72 -9.773 2.486 -7.542 Z"
          />
          <rect
            width="25"
            height="50"
            x="-5"
            y="-35"
            rx="3"
            ry="3"
            className={selectBoxClasses}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            width="25"
            height="50"
            x="-5"
            y="-35"
            rx="3"
            ry="3"
            className={mainBoxClasses}
            onMouseDown={onHitBoxMouseDown}
            onMouseEnter={onHitBoxMouseEnter}
            onMouseLeave={onHitBoxMouseLeave}
          />
        </Fragment>
      );
    } else if (type === AccidentalType.SHARP) {
      renderPath = (
        <Fragment>
          <path
            fill={color}
            d="M 4.261 6.113 L 4.261 -5.081 L 8.899 -6.394 L 8.899 4.742 L 4.261 6.113 Z M 13.394 3.405 L 10.205 4.342 L 10.205 -6.794 L 13.394 -7.708 L 13.394 -12.333 L 10.205 -11.42 L 10.205 -22.799 L 8.899 -22.799 L 8.899 -11.075 L 4.261 -9.706 L 4.261 -20.771 L 3.029 -20.771 L 3.029 -9.285 L -0.16 -8.369 L -0.16 -3.734 L 3.029 -4.648 L 3.029 6.467 L -0.16 7.378 L -0.16 11.995 L 3.029 11.081 L 3.029 22.396 L 4.261 22.396 L 4.261 10.676 L 8.899 9.368 L 8.899 20.375 L 10.205 20.375 L 10.205 8.954 L 13.394 8.038 L 13.394 3.405 Z"
          />
          <rect
            width="20"
            height="50"
            x="-3"
            y="-25"
            rx="3"
            ry="3"
            className={selectBoxClasses}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            width="20"
            height="50"
            x="-3"
            y="-25"
            rx="3"
            ry="3"
            className={mainBoxClasses}
            onMouseDown={onHitBoxMouseDown}
            onMouseEnter={onHitBoxMouseEnter}
            onMouseLeave={onHitBoxMouseLeave}
          />
        </Fragment>
      );
    } else if (type === AccidentalType.NATURAL) {
      renderPath = (
        <Fragment>
          <path
            fill={color}
            d="M 0.037 -18.087 C 0.438 -18.287 0.89 -18.438 1.341 -18.438 C 1.793 -18.438 2.194 -18.287 2.596 -18.087 L 2.445 -8.905 L 7.764 -9.909 L 7.914 -9.909 C 8.416 -9.909 8.818 -9.557 8.818 -9.056 L 9.168 19.543 C 8.767 19.743 8.366 19.894 7.914 19.894 C 7.463 19.894 7.061 19.743 6.66 19.543 L 6.811 10.361 L 1.492 11.365 L 1.341 11.365 C 0.84 11.365 0.438 11.013 0.438 10.512 Z M 7.011 -4.891 L 2.396 -4.039 L 2.245 6.347 L 6.86 5.494 Z"
          />
          <rect
            width="20"
            height="50"
            x="-5"
            y="-25"
            rx="3"
            ry="3"
            className={selectBoxClasses}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            width="20"
            height="50"
            x="-5"
            y="-25"
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
    return <g transform={`translate(${x}, ${y})`}>{renderPath}</g>;
  }
}

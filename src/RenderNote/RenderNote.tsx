import classNames from 'classnames';
import React, { Fragment } from 'react';
import { NoteLength, NoteOrientation, NoteType } from '../types/NoteTypes';
import './RenderNote.css';

interface RenderNoteProps {
  length: NoteLength;
  type: NoteType;
  orientation?: NoteOrientation;
  isSelected?: boolean;
  cssClass?: string;
  onMouseDown?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMainMouseDown?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMainMouseEnter?: (e: React.MouseEvent<SVGRectElement>) => void;
  onMainMouseLeave?: (e: React.MouseEvent<SVGRectElement>) => void;
  x: number;
  y: number;
  color?: string;
}

export default function RenderNote(props: RenderNoteProps) {
  const {
    x,
    y,
    color,
    cssClass,
    type,
    length,
    orientation,
    isSelected,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMainMouseDown,
    onMainMouseEnter,
    onMainMouseLeave
  } = props;
  const selectBoxClasses = classNames('SelectBox', cssClass, {
    'SelectBox--selected': isSelected
  });
  const mainBoxClasses = classNames('MainBox', cssClass, {
    'MainBox--selected': isSelected
  });
  let innerSVG;
  if (type === NoteType.REST) {
    // Rests are fixed in y-position on the staff, here.
    if (length === NoteLength.DOUBLEWHOLE) {
      innerSVG = (
        <Fragment>
          <rect width="20" height="20" y="20" fill={color} />
          <rect
            width="26"
            height="30"
            x="-3"
            y="14"
            rx="3"
            ry="3"
            className={selectBoxClasses}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            width="26"
            height="30"
            x="-3"
            y="14"
            rx="3"
            ry="3"
            className={mainBoxClasses}
            onMouseDown={onMainMouseDown}
            onMouseEnter={onMainMouseEnter}
            onMouseLeave={onMainMouseLeave}
          />
        </Fragment>
      );
    } else if (length === NoteLength.WHOLE) {
      innerSVG = (
        <Fragment>
          <rect width="20" height="10" y="40" fill={color} />
          <rect
            width="26"
            height="20"
            x="-3"
            y="35"
            rx="3"
            ry="3"
            className={selectBoxClasses}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            width="26"
            height="20"
            x="-3"
            y="35"
            rx="3"
            ry="3"
            className={mainBoxClasses}
            onMouseDown={onMainMouseDown}
            onMouseEnter={onMainMouseEnter}
            onMouseLeave={onMainMouseLeave}
          />
        </Fragment>
      );
    } else if (length === NoteLength.HALF) {
      innerSVG = (
        <Fragment>
          <rect width="20" height="10" y="50" fill={color} />
          <rect
            width="26"
            height="20"
            x="-3"
            y="45"
            rx="3"
            ry="3"
            className={selectBoxClasses}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            width="26"
            height="20"
            x="-3"
            y="45"
            rx="3"
            ry="3"
            className={mainBoxClasses}
            onMouseDown={onMainMouseDown}
            onMouseEnter={onMainMouseEnter}
            onMouseLeave={onMainMouseLeave}
          />
        </Fragment>
      );
    } else if (length === NoteLength.QUARTER) {
      innerSVG = (
        <Fragment>
          <path
            fill={color}
            d="M 4.234 33.744 L 18.85 51.233 C 18.85 51.233 12.668 58.834 12.539 63.401 C 12.366 69.554 20.106 80.247 20.106 80.247 C 20.106 80.247 11.737 78.877 9.575 81.56 C 7.412 84.243 11.018 91.525 11.018 91.525 C 11.018 91.525 -1.969 84.394 0.059 77.949 C 1.577 73.124 12.317 72.838 12.317 72.838 C 12.317 72.838 2.833 64.533 2.828 60.435 C 2.824 57.127 8.879 52.026 9.058 46.639 C 9.161 43.545 6.46 39.885 5.214 37.322 C 4.452 35.753 4.234 33.744 4.234 33.744 Z"
          />
          <rect
            width="25"
            height="60"
            x="-4"
            y="33"
            rx="3"
            ry="3"
            className={selectBoxClasses}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            width="25"
            height="60"
            x="-4"
            y="33"
            rx="3"
            ry="3"
            className={mainBoxClasses}
            onMouseDown={onMainMouseDown}
            onMouseEnter={onMainMouseEnter}
            onMouseLeave={onMainMouseLeave}
          />
        </Fragment>
      );
    } else if (length === NoteLength.EIGHTH) {
      innerSVG = (
        <Fragment>
          <path
            fill={color}
            d="M 16.469 49.33 C 19.283 47.799 21.766 46.176 22.04 46.169 L 13.285 79.482 L 9.914 79.496 L 18.262 51.648 C 18.262 51.648 15.304 53.623 13.424 54.389 C 10.551 55.56 13.168 54.503 10.374 55.621 C 9.153 56.063 8.151 56.179 6.862 56.179 C 3.156 56.179 0.152 53.227 0.152 49.585 C 0.152 45.943 3.156 42.991 6.862 42.991 C 10.568 42.991 13.57 45.84 12.996 49.037 C 12.855 49.819 12.548 50.712 12.469 51.118 C 13.213 50.783 15.216 50.011 16.469 49.33 Z"
          />
          <rect
            width="25"
            height="40"
            x="-2"
            y="40"
            rx="3"
            ry="3"
            className={selectBoxClasses}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            width="25"
            height="40"
            x="-2"
            y="40"
            rx="3"
            ry="3"
            className={mainBoxClasses}
            onMouseDown={onMainMouseDown}
            onMouseEnter={onMainMouseEnter}
            onMouseLeave={onMainMouseLeave}
          />
        </Fragment>
      );
    } else if (length === NoteLength.SIXTEENTH) {
      innerSVG = (
        <Fragment>
          <path
            fill={color}
            d="M 11.345 66.917 C 12.597 66.236 13.783 65.537 14.738 64.97 L 18.262 51.648 C 18.262 51.648 15.304 53.623 13.424 54.389 C 10.551 55.56 13.168 54.503 10.374 55.621 C 9.153 56.063 8.151 56.179 6.862 56.179 C 3.156 56.179 0.152 53.227 0.152 49.585 C 0.152 45.943 3.156 42.991 6.862 42.991 C 10.568 42.991 13.57 45.84 12.996 49.037 C 12.855 49.819 12.548 50.712 12.469 51.118 C 13.213 50.783 15.216 50.011 16.469 49.33 C 19.283 47.799 21.766 46.176 22.04 46.169 L 7.868 99.537 L 5.548 99.713 L 13.723 68.806 C 12.657 69.512 9.809 71.361 8.3 71.976 C 5.427 73.147 8.044 72.09 5.25 73.208 C 4.029 73.65 3.027 73.766 1.738 73.766 C -1.968 73.766 -4.972 70.814 -4.972 67.172 C -4.972 63.53 -1.968 60.578 1.738 60.578 C 5.444 60.578 8.446 63.427 7.872 66.624 C 7.731 67.406 7.424 68.299 7.345 68.705 C 8.089 68.37 10.092 67.598 11.345 66.917 Z"
          />
          <rect
            width="30"
            height="60"
            x="-7"
            y="40"
            rx="3"
            ry="3"
            className={selectBoxClasses}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            width="30"
            height="60"
            x="-7"
            y="40"
            rx="3"
            ry="3"
            className={mainBoxClasses}
            onMouseDown={onMainMouseDown}
            onMouseEnter={onMainMouseEnter}
            onMouseLeave={onMainMouseLeave}
          />
        </Fragment>
      );
    }
  } else if (length === NoteLength.QUARTER) {
    if (orientation === NoteOrientation.UP) {
      innerSVG = (
        <Fragment>
          <path
            fill={color}
            d="M 18.747 17.239 C 18.747 21.319 14.367 27.559 6.747 27.559 C 2.787 27.559 -0.093 25.339 -0.093 21.859 C -0.093 16.819 6.267 11.599 12.987 11.599 C 15.246 11.599 16.84 12.222 17.77 13.516 C 17.849 16.338 18.273 -14.546 17.77 -32.635 L 18.742 -32.635 L 18.742 16.905 C 18.745 17.015 18.747 17.126 18.747 17.239 Z"
          />
          <rect
            className={selectBoxClasses}
            width="22"
            height="62"
            x="-1"
            y="-34"
            rx="3"
            ry="3"
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            className={mainBoxClasses}
            width="22"
            height="20"
            x="-1"
            y="10"
            rx="3"
            ry="3"
            onMouseDown={onMainMouseDown}
            onMouseEnter={onMainMouseEnter}
            onMouseLeave={onMainMouseLeave}
          />
        </Fragment>
      );
    } else if (orientation === NoteOrientation.DOWN) {
      innerSVG = (
        <Fragment>
          <path
            fill={color}
            d="M -0.316 21.141 C -0.316 17.061 4.064 10.821 11.684 10.821 C 15.644 10.821 18.524 13.041 18.524 16.521 C 18.524 21.561 12.164 26.781 5.444 26.781 C 3.185 26.781 1.591 26.158 0.661 24.864 C 0.582 22.042 0.158 52.926 0.661 71.015 L -0.311 71.015 L -0.311 21.475 C -0.314 21.365 -0.316 21.254 -0.316 21.141 Z"
          />
          <rect
            className={selectBoxClasses}
            width="22"
            height="62"
            x="-2"
            y="10"
            rx="3"
            ry="3"
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            className={mainBoxClasses}
            width="22"
            height="20"
            x="-2"
            y="10"
            rx="3"
            ry="3"
            onMouseDown={onMainMouseDown}
            onMouseEnter={onMainMouseEnter}
            onMouseLeave={onMainMouseLeave}
          />
        </Fragment>
      );
    }
  } else if (length === NoteLength.HALF) {
    if (orientation === NoteOrientation.UP) {
      innerSVG = (
        <Fragment>
          <path
            d="M 18.747 17.239 C 18.747 21.319 14.367 27.559 6.747 27.559 C 2.787 27.559 -0.093 25.339 -0.093 21.859 C -0.093 16.819 6.267 11.599 12.987 11.599 C 15.246 11.599 16.84 12.222 17.77 13.516 C 17.849 16.338 18.273 -14.546 17.77 -32.635 L 18.742 -32.635 L 18.742 16.905 C 18.745 17.015 18.747 17.126 18.747 17.239 Z M 16.117 13.489 C 14.548 12.335 10.198 14.087 6.402 17.402 C 2.606 20.718 0.801 24.341 2.37 25.496 C 3.939 26.65 8.288 24.898 12.084 21.583 C 15.88 18.267 17.685 14.644 16.117 13.489 Z"
            fill={color}
            fillRule="evenodd"
          />
          <rect
            className={selectBoxClasses}
            width="22"
            height="62"
            x="-1"
            y="-34"
            rx="3"
            ry="3"
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            className={mainBoxClasses}
            width="22"
            height="22"
            x="-1"
            y="8"
            rx="3"
            ry="3"
            onMouseDown={onMainMouseDown}
            onMouseEnter={onMainMouseEnter}
            onMouseLeave={onMainMouseLeave}
          />
        </Fragment>
      );
    } else if (orientation === NoteOrientation.DOWN) {
      innerSVG = (
        <Fragment>
          <path
            d="M -0.316 21.141 C -0.316 17.061 4.064 10.821 11.684 10.821 C 15.644 10.821 18.524 13.041 18.524 16.521 C 18.524 21.561 12.164 26.781 5.444 26.781 C 3.185 26.781 1.591 26.158 0.661 24.864 C 0.582 22.042 0.158 52.926 0.661 71.015 L -0.311 71.015 L -0.311 21.475 C -0.314 21.365 -0.316 21.254 -0.316 21.141 Z M 2.314 24.891 C 3.883 26.045 8.233 24.293 12.029 20.978 C 15.825 17.662 17.63 14.039 16.061 12.884 C 14.492 11.73 10.143 13.482 6.347 16.797 C 2.551 20.113 0.746 23.736 2.314 24.891 Z"
            fill={color}
            fillRule="evenodd"
          />
          <rect
            className={selectBoxClasses}
            width="22"
            height="62"
            x="-2"
            y="10"
            rx="3"
            ry="3"
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            className={mainBoxClasses}
            width="22"
            height="22"
            x="-2"
            y="10"
            rx="3"
            ry="3"
            onMouseDown={onMainMouseDown}
            onMouseEnter={onMainMouseEnter}
            onMouseLeave={onMainMouseLeave}
          />
        </Fragment>
      );
    }
  } else if (length === NoteLength.WHOLE) {
    innerSVG = (
      <Fragment>
        <path
          d="M 10.715 12.137 C 2.256 12.417 -2.615 19.252 1.948 24.44 C 6.511 29.627 17.085 29.278 20.981 23.81 C 24.675 18.625 19.735 12.402 11.715 12.137 Z M 10.715 14.137 C 7.66 14.714 6.167 20.036 8.028 23.716 C 9.889 27.396 13.708 26.674 14.902 22.417 C 15.929 18.755 14.343 14.634 11.715 14.137 Z"
          fill={color}
          fillRule="evenodd"
        />
        <rect
          className={selectBoxClasses}
          width="22"
          height="22"
          x="0"
          y="10"
          rx="3"
          ry="3"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
        />
        <rect
          className={mainBoxClasses}
          width="22"
          height="22"
          x="0"
          y="10"
          rx="3"
          ry="3"
          onMouseDown={onMainMouseDown}
          onMouseEnter={onMainMouseEnter}
          onMouseLeave={onMainMouseLeave}
        />
      </Fragment>
    );
  } else if (length === NoteLength.DOUBLEWHOLE) {
    innerSVG = (
      <Fragment>
        <path
          d="M 14.09 12.276 C 5.631 12.556 0.761 19.391 5.323 24.579 C 9.886 29.767 20.46 29.417 24.356 23.949 C 28.051 18.765 23.11 12.542 15.09 12.276 Z M 14.09 14.276 C 11.035 14.854 9.542 20.175 11.403 23.855 C 13.264 27.535 17.083 26.814 18.277 22.556 C 19.304 18.894 17.718 14.773 15.09 14.276 Z"
          fill={color}
          fillRule="evenodd"
        />
        <path
          fill={color}
          d="M 3.577 9.246 L 4.597 9.246 L 4.597 29.382 L 3.577 29.382 Z M -0.428 9.211 L 0.592 9.211 L 0.592 29.347 L -0.428 29.347 Z M 24.618 9.206 L 25.638 9.206 L 25.638 29.342 L 24.618 29.342 Z M 28.623 9.241 L 29.643 9.241 L 29.643 29.377 L 28.623 29.377 Z"
        />
        <rect
          className={selectBoxClasses}
          width="36"
          height="28"
          x="-3"
          y="6"
          rx="3"
          ry="3"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown}
        />
        <rect
          className={mainBoxClasses}
          width="36"
          height="28"
          x="-3"
          y="6"
          rx="3"
          ry="3"
          onMouseDown={onMainMouseDown}
          onMouseEnter={onMainMouseEnter}
          onMouseLeave={onMainMouseLeave}
        />
      </Fragment>
    );
  } else if (length === NoteLength.EIGHTH) {
    if (orientation === NoteOrientation.UP) {
      innerSVG = (
        <Fragment>
          <path
            fill={color}
            d="M 18.988 15.384 C 18.988 19.464 14.608 25.704 6.988 25.704 C 3.028 25.704 0.148 23.484 0.148 20.004 C 0.148 14.964 6.508 9.744 13.228 9.744 C 15.408 9.744 16.97 10.324 17.912 11.529 L 17.912 -35.089 L 18.977 -35.089 L 18.977 -29.846 C 19.467 -27.458 20.56 -24.284 22.896 -20.554 C 27.544 -13.133 27.632 -13.541 29.717 -7.37 C 31.589 -1.829 28.931 10.434 28.06 11.649 C 28.06 11.649 27.617 12.297 26.861 12.009 C 25.682 11.56 25.753 10.935 25.837 10.572 C 27.696 2.543 28.11 0.347 27.526 -3.601 C 27.027 -6.974 26.702 -7.702 25.541 -9.847 C 24.611 -11.565 23.233 -12.962 21.948 -14.841 C 21.251 -15.859 19.637 -17.294 18.977 -17.862 L 18.977 14.892 C 18.984 15.052 18.988 15.216 18.988 15.384 Z"
          />
          <rect
            className={selectBoxClasses}
            width="32"
            height="62"
            x="-1"
            y="-36"
            rx="3"
            ry="3"
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            className={mainBoxClasses}
            width="22"
            height="22"
            x="-1"
            y="5"
            rx="3"
            ry="3"
            onMouseDown={onMainMouseDown}
            onMouseEnter={onMainMouseEnter}
            onMouseLeave={onMainMouseLeave}
          />
        </Fragment>
      );
    } else if (orientation === NoteOrientation.DOWN) {
      innerSVG = (
        <Fragment>
          <path
            fill={color}
            d="M -0.094 19.806 C -0.094 15.726 4.286 9.486 11.906 9.486 C 15.866 9.486 18.746 11.706 18.746 15.186 C 18.746 18.93 15.237 22.773 10.677 24.502 C 11.752 28.266 13.277 37.372 11.737 41.93 C 9.652 48.101 9.564 47.693 4.916 55.114 C 2.58 58.844 1.487 62.018 0.997 64.406 L 0.997 69.649 L -0.068 69.649 L -0.068 20.552 C -0.085 20.313 -0.094 20.064 -0.094 19.806 Z M 3.968 49.401 C 5.253 47.522 6.631 46.125 7.561 44.407 C 8.722 42.262 9.047 41.534 9.546 38.161 C 10.099 34.422 9.757 32.254 8.14 25.215 C 7.329 25.366 6.5 25.446 5.666 25.446 C 3.497 25.446 1.941 24.872 0.997 23.68 L 0.997 52.422 C 1.657 51.854 3.271 50.419 3.968 49.401 Z"
          />
          <rect
            className={selectBoxClasses}
            width="22"
            height="62"
            x="-2"
            y="10"
            rx="3"
            ry="3"
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            className={mainBoxClasses}
            width="22"
            height="22"
            x="-1"
            y="5"
            rx="3"
            ry="3"
            onMouseDown={onMainMouseDown}
            onMouseEnter={onMainMouseEnter}
            onMouseLeave={onMainMouseLeave}
          />
        </Fragment>
      );
    }
  } else if (length === NoteLength.SIXTEENTH) {
    if (orientation === NoteOrientation.UP) {
      innerSVG = (
        <Fragment>
          <path
            fill={color}
            d="M 17.688 -34.958 L 18.513 -34.958 C 18.518 -35.046 18.525 -35.087 18.525 -35.087 L 18.524 -34.958 L 18.727 -34.958 L 18.727 -32.968 C 19.101 -31.115 20.089 -27.906 22.636 -22.805 C 23.922 -20.231 27.02 -16.964 28.801 -10.812 C 29.77 -7.465 28.414 -3.544 27.942 -2.343 C 28.423 -0.871 28.775 1.069 29.378 4.492 C 29.954 7.761 29.196 10.803 28.232 13.511 C 27.737 14.901 25.951 14.24 26.428 12.962 C 27.33 10.545 28.131 8.62 26.937 2.391 C 26.247 -1.209 26.262 -0.933 23.221 -6.837 C 21.715 -9.761 19.336 -13.614 18.727 -14.592 L 18.727 14.942 C 18.75 15.217 18.762 15.504 18.762 15.803 C 18.762 19.883 14.382 26.123 6.762 26.123 C 2.802 26.123 -0.078 23.903 -0.078 20.423 C -0.078 15.383 6.282 10.163 13.002 10.163 C 15.184 10.163 16.746 10.744 17.688 11.95 Z M 24.414 -15.063 C 23.201 -17.377 19.769 -22.784 18.727 -24.415 L 18.727 -24.188 C 19.458 -20.417 21.433 -13.385 26.712 -4.933 C 26.781 -6.734 26.636 -10.824 24.414 -15.063 Z"
          />
          <rect
            className={selectBoxClasses}
            width="32"
            height="62"
            x="-1"
            y="-36"
            rx="3"
            ry="3"
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            className={mainBoxClasses}
            width="22"
            height="22"
            x="-1"
            y="5"
            rx="3"
            ry="3"
            onMouseDown={onMainMouseDown}
            onMouseEnter={onMainMouseEnter}
            onMouseLeave={onMainMouseLeave}
          />
        </Fragment>
      );
    } else if (orientation === NoteOrientation.DOWN) {
      innerSVG = (
        <Fragment>
          <path
            fill={color}
            d="M 18.608 16.589 C 18.608 19.797 15.901 24.34 11.04 26.135 C 11.618 28.264 11.924 30.561 11.497 32.982 C 10.894 36.405 10.542 38.345 10.061 39.817 C 10.533 41.018 11.889 44.939 10.92 48.286 C 9.139 54.438 6.041 57.705 4.755 60.279 C 2.208 65.38 1.22 68.589 0.846 70.442 L 0.846 72.432 L 0.643 72.432 L 0.644 72.561 C 0.644 72.561 0.637 72.52 0.632 72.432 L -0.193 72.432 L -0.193 21.898 C -0.219 21.674 -0.232 21.444 -0.232 21.209 C -0.232 16.169 6.128 10.949 12.848 10.949 C 16.688 10.949 18.608 12.749 18.608 16.589 Z M 6.608 26.909 C 4.104 26.909 2.031 26.021 0.846 24.488 L 0.846 52.066 C 1.455 51.088 3.834 47.235 5.34 44.311 C 8.381 38.407 8.366 38.683 9.056 35.083 C 9.898 30.688 9.748 28.436 9.269 26.642 C 8.433 26.815 7.545 26.909 6.608 26.909 Z M 8.831 42.407 C 3.552 50.859 1.577 57.891 0.846 61.662 L 0.846 61.889 C 1.888 60.258 5.32 54.851 6.533 52.537 C 8.755 48.298 8.9 44.208 8.831 42.407 Z"
          />
          <rect
            className={selectBoxClasses}
            width="22"
            height="62"
            x="-2"
            y="10"
            rx="3"
            ry="3"
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            className={mainBoxClasses}
            width="22"
            height="22"
            x="-2"
            y="10"
            rx="3"
            ry="3"
            onMouseDown={onMainMouseDown}
            onMouseEnter={onMainMouseEnter}
            onMouseLeave={onMainMouseLeave}
          />
        </Fragment>
      );
    }
  }
  // -20 hack: Aligns (y=0) for a note with the center of the top staff line.
  return <g transform={`translate(${x}, ${y - 20})`}>{innerSVG}</g>;
}

RenderNote.defaultProps = {
  color: '#000',
  isSelected: false
};

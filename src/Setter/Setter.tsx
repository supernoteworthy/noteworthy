import { InputNumber, Popover, Select } from 'antd';
import classNames from 'classnames';
import { inject } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import Audio from '../Audio/Audio';
import { ProjectStore } from '../stores/project.store';
import { MouseMode, UiStore } from '../stores/ui.store';
import { AccidentalType } from '../types/AccidentalTypes';
import { NoteLength, NoteType } from '../types/NoteTypes';
import { SetterId, SetterSpec, SetterType } from '../types/SetterTypes';
import './Setter.css';

interface SetterProps {
  id?: SetterId;
  type: SetterType;
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
  shouldShowValue?: boolean;
  value?: number | string;
}

interface InjectedProps extends SetterProps {
  uiStore: UiStore;
  projectStore: ProjectStore;
}

@inject('uiStore', 'projectStore')
export default class Setter extends Component<SetterProps> {
  get injected() {
    return this.props as InjectedProps;
  }
  render() {
    const { uiStore, projectStore } = this.injected;
    const {
      id,
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
      onMouseLeave,
      shouldShowValue,
      value
    } = this.props;

    let editorContent;
    let label = '';
    let prefix = '';

    switch (type) {
      case SetterType.BPM:
        editorContent = (
          <InputNumber
            autoFocus
            min={1}
            max={500}
            precision={0}
            value={value as number}
            onChange={value => {
              const element = projectStore.getElementById(id!) as SetterSpec;
              element.value = value || 100;
            }}
          />
        );
        label = ' bpm';
        break;
      case SetterType.INSTRUMENT:
        editorContent = (
          <Select
            value={value as string}
            onChange={value => {
              const element = projectStore.getElementById(id!) as SetterSpec;
              element.value = value;
            }}
          >
            <Select.Option value="Piano">Piano</Select.Option>
            <Select.Option value="Sine">Sine</Select.Option>
            <Select.Option value="Sawtooth">Sawtooth</Select.Option>
            <Select.Option value="Snare">Snare</Select.Option>
          </Select>
        );
        break;
      case SetterType.OCTAVE:
        editorContent = (
          <InputNumber
            autoFocus
            min={0}
            max={9}
            precision={0}
            value={value as number}
            onChange={value => {
              const element = projectStore.getElementById(id!) as SetterSpec;
              element.value = value;
              if (value === undefined) {
                element.value = 4;
              }
              Audio.playNoteSample(
                {
                  kind: 'note',
                  id: 'SAMPLE',
                  type: NoteType.TONE,
                  length: NoteLength.HALF,
                  y: 100,
                  isPlaying: true,
                  nextElement: undefined
                },
                AccidentalType.NATURAL,
                element.value!
              );
            }}
          />
        );
        prefix = 'Octave ';
        break;
      case SetterType.VOLUME:
        editorContent = (
          <InputNumber
            autoFocus
            min={0}
            max={300}
            precision={0}
            value={value as number}
            onChange={value => {
              const element = projectStore.getElementById(id!) as SetterSpec;
              element.value = value || 100;
            }}
          />
        );

        label = '%';
        break;
    }

    const valueEditor = (
      <Popover
        content={editorContent}
        placement="bottom"
        onVisibleChange={visible => {
          if (visible) {
            uiStore.mouseMode = MouseMode.POPOVER;
          } else {
            uiStore.mouseMode = MouseMode.INSERT;
          }
        }}
      >
        <text x={20} y={105}>
          {prefix}
          {value}
          {label}
        </text>
      </Popover>
    );

    const selectBoxClasses = classNames('SelectBox', {
      'SelectBox--selected': isSelected
    });
    const mainBoxClasses = classNames('MainBox', {
      'MainBox--selected': isSelected
    });
    const innerColor = color === '#fff' ? '#000' : '#fff';
    let renderPath;
    if (type === SetterType.BPM) {
      renderPath = (
        <Fragment>
          <path
            d="M 3.964 47.492 L 38.685 47.492 C 40.602 47.492 42.157 49.046 42.157 50.964 L 42.157 85.685 C 42.157 87.602 40.602 89.157 38.685 89.157 L 3.964 89.157 C 2.046 89.157 0.492 87.602 0.492 85.685 L 0.492 50.964 C 0.492 49.046 2.046 47.492 3.964 47.492 Z"
            fill={color}
          />
          <path
            d="M 21.656 58.673 C 17.614 58.673 13.554 60.121 10.47 63.279 C 6.019 67.622 4.836 74.071 6.809 79.729 L 36.502 79.729 C 38.476 74.07 37.293 67.622 32.842 63.279 C 29.758 60.121 25.698 58.673 21.656 58.673 Z M 20.998 61.305 L 22.314 61.305 L 22.314 63.937 L 20.998 63.937 Z M 15.364 62.752 L 16.68 65.121 C 16.286 65.253 15.897 65.517 15.529 65.779 L 14.213 63.409 C 14.579 63.278 14.965 63.015 15.364 62.752 Z M 27.948 62.752 C 28.349 63.015 28.734 63.278 29.1 63.409 L 27.784 65.779 C 27.415 65.517 27.027 65.253 26.632 65.121 Z M 31.858 64.196 C 31.868 64.195 31.881 64.196 31.89 64.198 L 31.891 64.199 C 31.901 64.198 31.912 64.198 31.921 64.198 L 31.923 64.199 C 31.929 64.201 31.936 64.205 31.941 64.209 C 32.011 64.28 31.825 64.588 31.492 64.984 L 31.486 64.99 L 24.189 73.737 C 24.435 74.633 24.21 75.614 23.518 76.307 L 23.518 76.307 C 22.831 76.993 21.86 77.221 20.985 76.99 L 20.971 76.986 L 19.796 78.15 C 19.281 78.677 18.449 78.677 17.935 78.15 C 17.422 77.623 17.421 76.834 17.935 76.307 L 19.117 75.138 C 18.881 74.247 19.108 73.274 19.796 72.586 C 19.796 72.586 19.796 72.586 19.796 72.586 L 19.796 72.586 C 20.5 71.883 21.504 71.662 22.396 71.922 L 22.41 71.928 L 31.167 64.594 C 31.49 64.332 31.739 64.18 31.834 64.198 L 31.836 64.199 C 31.841 64.198 31.849 64.196 31.857 64.196 L 31.859 64.196 Z M 10.059 67.623 L 12.362 68.939 C 12.111 69.334 11.906 69.727 11.704 70.121 L 9.442 68.805 C 9.646 68.411 9.826 68.018 10.059 67.623 Z M 33.251 67.623 C 33.498 68.018 33.701 68.411 33.909 68.805 L 31.606 70.121 C 31.404 69.727 31.199 69.334 30.948 68.939 Z M 7.876 74.465 L 10.511 74.465 C 10.496 74.597 10.472 74.86 10.47 75.123 C 10.47 75.386 10.501 75.518 10.511 75.781 L 7.877 75.781 C 7.86 75.518 7.836 75.254 7.836 75.123 C 7.836 74.86 7.861 74.596 7.877 74.465 Z M 32.801 74.465 L 35.433 74.465 C 35.451 74.597 35.474 74.86 35.474 75.123 C 35.468 75.386 35.447 75.518 35.433 75.781 L 32.801 75.781 C 32.814 75.518 32.84 75.254 32.84 75.123 C 32.84 74.86 32.814 74.596 32.801 74.465 Z"
            fill={innerColor}
          />
          <rect
            width="45"
            height="45"
            x="0"
            y="45"
            rx="3"
            ry="3"
            className={selectBoxClasses}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            width="45"
            height="45"
            x="0"
            y="45"
            rx="3"
            ry="3"
            className={mainBoxClasses}
            onMouseDown={onHitBoxMouseDown}
            onMouseEnter={onHitBoxMouseEnter}
            onMouseLeave={onHitBoxMouseLeave}
          />
        </Fragment>
      );
    } else if (type === SetterType.INSTRUMENT) {
      renderPath = (
        <Fragment>
          <path
            d="M 3.964 47.492 L 38.685 47.492 C 40.602 47.492 42.157 49.046 42.157 50.964 L 42.157 85.685 C 42.157 87.602 40.602 89.157 38.685 89.157 L 3.964 89.157 C 2.046 89.157 0.492 87.602 0.492 85.685 L 0.492 50.964 C 0.492 49.046 2.046 47.492 3.964 47.492 Z"
            fill={color}
          />
          <g transform="matrix(0.250845, 0, 0, 0.250845, 5.665422, 51.988129)">
            <path
              d="M129.7,27.7c-0.2,0.2-0.4,0.3-0.7,0.3s-0.5-0.1-0.7-0.3l-5.4-5.4c-0.4,0.3-0.7,0.6-1.2,0.9l-3.1,1.8l6.1,6.1   c0.4,0.4,0.4,1,0,1.4c-0.2,0.2-0.4,0.3-0.7,0.3s-0.5-0.1-0.7-0.3l-6.5-6.5l-8.1,4.8L70.1,71.2c-0.2,0.2-0.4,0.3-0.7,0.3h0   c-0.3,0-0.5-0.1-0.7-0.3l-8-8c-0.2-0.2-0.3-0.4-0.3-0.7c0-0.3,0.1-0.5,0.3-0.7l40.3-38.6l4.8-8.1l-6.5-6.5c-0.4-0.4-0.4-1,0-1.4   c0.4-0.4,1-0.4,1.4,0l6.1,6.1l1.8-3.1c0.3-0.4,0.6-0.8,0.9-1.2l-5.4-5.4c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l5.4,5.4   c1.6-1.2,3.5-1.8,5.5-1.8c2.5,0,4.9,1,6.7,2.8c2,2,3,4.8,2.7,7.7c-0.2,1.7-0.8,3.2-1.8,4.5l5.4,5.4   C130.1,26.7,130.1,27.3,129.7,27.7z"
              fill={innerColor}
            />
            <path
              d="M33.8,103.9c-0.2,1.5-1,2.9-2.2,3.7c-4.8,3.2-9,8.2-10.8,12.9c-0.1,0.3-0.4,0.6-0.7,0.6c-0.1,0-0.1,0-0.2,0   c-0.3,0-0.5-0.1-0.7-0.3l-8-8c-0.2-0.2-0.3-0.6-0.3-0.9c0.1-0.3,0.3-0.6,0.6-0.7c4.7-1.7,9.7-5.9,12.9-10.8   c0.9-1.4,2.5-2.3,4.2-2.3c1.4,0,2.7,0.5,3.6,1.5C33.4,100.8,33.9,102.3,33.8,103.9z"
              fill={innerColor}
            />
            <path
              d="M71.6,72.6c-0.6,0.6-1.3,0.9-2.1,0.9h0c-0.8,0-1.5-0.3-2.1-0.8l-8-8c-0.6-0.6-0.9-1.4-0.9-2.2c0-0.7,0.3-1.5,0.9-2.1   L76,44.5C69.7,39,60.5,38.4,53.4,43l-8.3,5.5c-0.2,0.1-0.4,0.4-0.4,0.6c-0.1,0.3,0,0.5,0.2,0.7c4.9,7.1,1.7,14.9-3.4,19.2   c-4.7,3.9-12.5,6.1-19.3-0.7c-0.7-0.7-1.3-1.4-1.8-2.2c-0.3-0.4-0.9-0.6-1.4-0.3l-4.5,3C7.5,73.6,3,81,2.1,89.4   c-0.8,7.9,1.8,15.6,7.1,21.5c0.3-0.7,0.9-1.2,1.6-1.5c4.3-1.6,9-5.5,11.9-10c1.3-2,3.5-3.2,5.9-3.2c1.9,0,3.7,0.7,5,2.1   c1.5,1.5,2.3,3.6,2,5.7c-0.2,2.1-1.4,4-3.1,5.1c-4.5,2.9-8.4,7.6-10,11.9c-0.2,0.7-0.8,1.3-1.5,1.6c5.1,4.7,11.8,7.2,18.7,7.2   c0.9,0,1.9,0,2.8-0.1c8.3-0.8,15.8-5.3,20.4-12.3l3-4.5c0.3-0.4,0.2-1.1-0.3-1.4c-0.8-0.6-1.5-1.2-2.2-1.8   c-6.7-6.7-4.6-14.6-0.7-19.3c4.3-5.1,12.1-8.4,19.2-3.4c0.2,0.2,0.5,0.2,0.7,0.2c0.3-0.1,0.5-0.2,0.6-0.4l5.5-8.3   c4.7-7,4-16.3-1.5-22.6L71.6,72.6z M14.2,104.2c-0.2,0.1-0.4,0.2-0.6,0.2c-0.3,0-0.6-0.1-0.8-0.4c-2.8-4.1-4.1-9-3.6-13.9   c0.2-2.4,0.9-4.7,1.9-6.9c0.2-0.5,0.8-0.7,1.3-0.5c0.5,0.2,0.7,0.8,0.5,1.3c-1,2-1.5,4.1-1.8,6.2c-0.4,4.4,0.7,8.9,3.3,12.5   C14.7,103.3,14.6,103.9,14.2,104.2z M35.5,89.8c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l6.7,6.7c0.4,0.4,0.4,1,0,1.4   c-0.2,0.2-0.4,0.3-0.7,0.3c-0.3,0-0.5-0.1-0.7-0.3L35.5,89.8z M48.8,120.9c-2.2,1-4.5,1.7-6.9,1.9c-0.7,0.1-1.4,0.1-2.1,0.1   c-4.7,0-9.3-1.6-13-4.6c-0.4-0.3-0.5-1-0.2-1.4c0.3-0.4,1-0.5,1.4-0.1c3.9,3.1,8.7,4.5,13.6,4c2.1-0.2,4.2-0.8,6.2-1.7   c0.5-0.2,1.1,0,1.3,0.5C49.5,120.1,49.3,120.7,48.8,120.9z M50.3,92.3c-0.2,0.2-0.4,0.3-0.7,0.3c-0.3,0-0.5-0.1-0.7-0.3l-9.2-9.2   c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l9.2,9.2C50.7,91.3,50.7,91.9,50.3,92.3z M55.7,86.8c-0.2,0.2-0.4,0.3-0.7,0.3   c-0.3,0-0.5-0.1-0.7-0.3l-9.2-9.2c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l9.2,9.2C56.1,85.8,56.1,86.4,55.7,86.8z M60,80.1   c-0.2,0.2-0.4,0.3-0.7,0.3c-0.3,0-0.5-0.1-0.7-0.3l-6.7-6.7c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l6.7,6.7   C60.3,79.1,60.3,79.7,60,80.1z"
              fill={innerColor}
            />
          </g>
          <rect
            width="45"
            height="45"
            x="0"
            y="45"
            rx="3"
            ry="3"
            className={selectBoxClasses}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            width="45"
            height="45"
            x="0"
            y="45"
            rx="3"
            ry="3"
            className={mainBoxClasses}
            onMouseDown={onHitBoxMouseDown}
            onMouseEnter={onHitBoxMouseEnter}
            onMouseLeave={onHitBoxMouseLeave}
          />
        </Fragment>
      );
    } else if (type === SetterType.OCTAVE) {
      renderPath = (
        <Fragment>
          <path
            d="M 3.964 47.492 L 38.685 47.492 C 40.602 47.492 42.157 49.046 42.157 50.964 L 42.157 85.685 C 42.157 87.602 40.602 89.157 38.685 89.157 L 3.964 89.157 C 2.046 89.157 0.492 87.602 0.492 85.685 L 0.492 50.964 C 0.492 49.046 2.046 47.492 3.964 47.492 Z"
            fill={color}
          />
          <g
            data-name="Group"
            transform="matrix(0.328959, 0, 0, 0.328959, 4.8835, 51.994278)"
          >
            <path
              data-name="Path"
              d="M84.5,29.6c-2.2-1.7-5.1-4.1-10.5-4.1s-8.4,2.4-10.5,4.1-2.9,2.4-5.5,2.4-3.7-.9-5.5-2.4S47.4,25.5,42,25.5s-8.4,2.4-10.5,4.1-2.9,2.4-5.5,2.4-3.7-.9-5.5-2.4S15.4,25.5,10,25.5H6v8h4c2.6,0,3.7.9,5.5,2.4s5.1,4.1,10.5,4.1,8.4-2.4,10.5-4.1,2.9-2.4,5.5-2.4,3.7.9,5.5,2.4,5.1,4.1,10.5,4.1,8.4-2.4,10.5-4.1,2.9-2.4,5.5-2.4,3.7.9,5.5,2.4,5.1,4.1,10.5,4.1h4v-8H90C87.4,31.9,86.3,31.1,84.5,29.6Z"
              fill={innerColor}
            />
            <path
              data-name="Path"
              d="M84.5,46.9c-2.2-1.7-5.1-4.1-10.5-4.1s-8.4,2.4-10.5,4.1-2.9,2.4-5.5,2.4-3.7-.9-5.5-2.4S47.4,42.8,42,42.8s-8.4,2.4-10.5,4.1-2.9,2.4-5.5,2.4-3.7-.9-5.5-2.4S15.4,42.8,10,42.8H6v8h4c2.6,0,3.7.9,5.5,2.4s5.1,4.1,10.5,4.1,8.4-2.4,10.5-4.1,2.9-2.4,5.5-2.4,3.7.9,5.5,2.4,5.1,4.1,10.5,4.1,8.4-2.4,10.5-4.1,2.9-2.4,5.5-2.4,3.7.9,5.5,2.4,5.1,4.1,10.5,4.1h4v-8H90C87.4,49.2,86.3,48.4,84.5,46.9Z"
              fill={innerColor}
            />
            <path
              data-name="Path"
              d="M84.5,64.2c-2.2-1.7-5.1-4.1-10.5-4.1s-8.4,2.4-10.5,4.1-2.9,2.4-5.5,2.4-3.7-.9-5.5-2.4S47.4,60.1,42,60.1s-8.4,2.4-10.5,4.1-2.9,2.4-5.5,2.4-3.7-.9-5.5-2.4S15.4,60.1,10,60.1H6v8h4c2.6,0,3.7.9,5.5,2.4s5.1,4.1,10.5,4.1,8.4-2.4,10.5-4.1,2.9-2.4,5.5-2.4,3.7.9,5.5,2.4,5.1,4.1,10.5,4.1,8.4-2.4,10.5-4.1,2.9-2.4,5.5-2.4,3.7.9,5.5,2.4,5.1,4.1,10.5,4.1h4v-8H90C87.4,66.5,86.3,65.7,84.5,64.2Z"
              fill={innerColor}
            />
          </g>
          <rect
            width="45"
            height="45"
            x="0"
            y="45"
            rx="3"
            ry="3"
            className={selectBoxClasses}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            width="45"
            height="45"
            x="0"
            y="45"
            rx="3"
            ry="3"
            className={mainBoxClasses}
            onMouseDown={onHitBoxMouseDown}
            onMouseEnter={onHitBoxMouseEnter}
            onMouseLeave={onHitBoxMouseLeave}
          />
        </Fragment>
      );
    } else if (type === SetterType.VOLUME) {
      renderPath = (
        <Fragment>
          <path
            d="M 3.964 47.492 L 38.685 47.492 C 40.602 47.492 42.157 49.046 42.157 50.964 L 42.157 85.685 C 42.157 87.602 40.602 89.157 38.685 89.157 L 3.964 89.157 C 2.046 89.157 0.492 87.602 0.492 85.685 L 0.492 50.964 C 0.492 49.046 2.046 47.492 3.964 47.492 Z"
            fill={color}
          />
          <path
            d="M 23.426 54.707 C 23.003 54.531 22.51 54.601 22.123 54.883 L 14.381 61.147 L 7.658 61.147 C 6.99 61.147 6.426 61.711 6.426 62.38 L 6.426 73.853 C 6.426 74.522 6.99 75.085 7.658 75.085 L 14.416 75.085 L 22.158 81.349 C 22.405 81.525 22.651 81.596 22.968 81.596 C 23.144 81.596 23.32 81.525 23.531 81.49 C 23.953 81.314 24.2 80.892 24.2 80.399 L 24.2 55.798 C 24.094 55.376 23.847 54.954 23.426 54.707 Z"
            fill={innerColor}
          />
          <path
            d="M 29.972 58.262 C 29.479 58.755 29.479 59.493 29.972 59.986 C 32.048 62.133 33.209 65.019 33.209 68.081 C 33.209 71.143 32.048 73.958 29.972 76.176 C 29.479 76.669 29.549 77.478 29.972 77.9 C 30.218 78.147 30.535 78.252 30.817 78.252 C 31.098 78.252 31.415 78.147 31.661 77.9 C 34.231 75.261 35.603 71.777 35.603 68.081 C 35.603 64.386 34.195 60.901 31.661 58.262 C 31.203 57.839 30.465 57.769 29.972 58.262 Z"
            fill={innerColor}
          />
          <path
            d="M 28.635 61.323 C 28.142 60.831 27.402 60.831 26.91 61.323 C 26.417 61.816 26.417 62.556 26.91 63.048 C 28.247 64.386 28.987 66.181 28.987 68.081 C 28.987 69.981 28.247 71.777 26.91 73.114 C 26.417 73.607 26.417 74.346 26.91 74.839 C 27.157 75.085 27.473 75.191 27.754 75.191 C 28.071 75.191 28.353 75.085 28.599 74.839 C 30.43 73.008 31.415 70.615 31.415 68.046 C 31.415 65.477 30.465 63.118 28.635 61.323 Z"
            fill={innerColor}
          />
          <rect
            width="45"
            height="45"
            x="0"
            y="45"
            rx="3"
            ry="3"
            className={selectBoxClasses}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <rect
            width="45"
            height="45"
            x="0"
            y="45"
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
      <g transform={`translate(${x}, ${y - 27})`} className="Setter">
        {renderPath}
        {shouldShowValue && valueEditor}
      </g>
    );
  }
}

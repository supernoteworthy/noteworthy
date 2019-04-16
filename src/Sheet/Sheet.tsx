import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import {
  KEY_SIGNATURE_GUIDELINE_X,
  SHEET_MARGIN_TOP,
  STAFF_HEIGHT,
  STAFF_MARGIN
} from '../constants';
import CursorElement from '../CursorElement/CursorElement';
import Staff from '../Staff/Staff';
import { ProjectStore } from '../stores/project.store';
import { MouseMode, UiStore } from '../stores/ui.store';
import './Sheet.css';

interface SheetProps {}

interface InjectedProps extends SheetProps {
  projectStore: ProjectStore;
  uiStore: UiStore;
}

@inject('projectStore', 'uiStore')
@observer
class Sheet extends Component<SheetProps> {
  private divRef: React.RefObject<HTMLDivElement>;
  get injected() {
    return this.props as InjectedProps;
  }

  constructor(props: any) {
    super(props);
    this.divRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateSheetBounds);
    this.updateSheetBounds();
    const divRef = this.divRef.current;
    if (divRef) {
      divRef.addEventListener('scroll', this.onScroll);
    }
  }

  onScroll = () => {
    const { uiStore } = this.injected;
    const divRef = this.divRef.current;
    if (divRef) {
      uiStore.sheetScroll = divRef.scrollTop;
    }
  };

  updateSheetBounds = () => {
    const { uiStore } = this.injected;
    const divRef = this.divRef.current;
    if (divRef) {
      const rect = divRef.getBoundingClientRect();
      uiStore.sheetWidth = rect.width;
    }
  };

  getBoundingX = () => {
    const divRef = this.divRef.current;
    if (divRef) {
      const rect = divRef.getBoundingClientRect();
      return { left: rect.left, right: rect.right };
    }
  };

  shouldDrawKeySignatureGuideline() {
    const { uiStore, projectStore } = this.injected;
    if (uiStore.mouseMode === MouseMode.DRAG) {
      const dragElementId = uiStore.dragElementId;
      if (!dragElementId) return false;
      const dragSpec = projectStore.getElementById(dragElementId);
      if (dragSpec && dragSpec.kind === 'accidental') {
        return true;
      }
    }
    if (uiStore.mouseMode === MouseMode.INSERT) {
      const cursorSpec = uiStore.cursorSpec;
      if (cursorSpec && cursorSpec.kind === 'accidental') {
        return true;
      }
    }
    return false;
  }

  render() {
    const { projectStore, uiStore } = this.injected;
    const { staffList } = projectStore;
    const staffs = staffList.map(staff => (
      <Staff key={`Staff_${staff.index}`} spec={staff} />
    ));
    const totalSVGHeight = (STAFF_HEIGHT + STAFF_MARGIN) * staffs.length;
    return (
      <div className="Sheet" ref={this.divRef}>
        <svg
          width="100%"
          height={totalSVGHeight}
          onMouseLeave={() => {
            uiStore.mouseMode = MouseMode.POPOVER;
          }}
          onMouseEnter={() => {
            uiStore.mouseMode = MouseMode.INSERT;
          }}
        >
          {this.shouldDrawKeySignatureGuideline() && (
            <line
              x1={KEY_SIGNATURE_GUIDELINE_X}
              x2={KEY_SIGNATURE_GUIDELINE_X}
              y1={0}
              y2={totalSVGHeight}
              stroke="#ddd"
            />
          )}
          <g transform={`translate(0, ${SHEET_MARGIN_TOP})`}>
            {uiStore.mouseMode === MouseMode.INSERT && (
              <CursorElement
                snapToStaff
                getSheetBoundingX={this.getBoundingX}
              />
            )}
            {staffs}
          </g>
        </svg>
      </div>
    );
  }
}

export default Sheet;

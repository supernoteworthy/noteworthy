import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { SHEET_MARGIN_TOP, STAFF_HEIGHT, STAFF_MARGIN } from '../constants';
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

  state = {
    currentScroll: 0
  };

  get injected() {
    return this.props as InjectedProps;
  }

  constructor(props: any) {
    super(props);
    this.divRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWidth);
    this.updateWidth();
    const divRef = this.divRef.current;
    if (divRef) {
      divRef.addEventListener('scroll', this.onScroll);
    }
  }

  onScroll = (e: UIEvent) => {
    const divRef = this.divRef.current;
    if (divRef) {
      this.setState({ currentScroll: divRef.scrollTop });
    }
  };

  updateWidth = () => {
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
      return rect.left;
    }
  };

  render() {
    const { projectStore, uiStore } = this.injected;
    const { currentScroll } = this.state;
    const { staffList } = projectStore;
    const staffs = staffList.map(staff => (
      <Staff key={`Staff_${staff.index}`} spec={staff} />
    ));
    const totalSVGHeight = (STAFF_HEIGHT + STAFF_MARGIN) * staffs.length;
    return (
      <div className="Sheet" ref={this.divRef}>
        <svg width="100%" height={totalSVGHeight}>
          <g transform={`translate(0, ${SHEET_MARGIN_TOP})`}>
            {uiStore.mouseMode === MouseMode.INSERT && (
              <CursorElement
                snapToStaff
                currentSheetScroll={currentScroll}
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

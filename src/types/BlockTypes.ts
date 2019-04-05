import { ElementId, StaffIndex } from './StaffTypes';

export type BlockId = ElementId;
export enum BlockMatchType {
  START,
  END,
  PLAY
}
export interface BlockSpec {
  kind: 'block';
  id: BlockId;
  x: number;
  y: 0;
  type: BlockMatchType;
  staffIndex?: StaffIndex;
  blockName: string;
  nextElement?: ElementId;
  matchElement?: ElementId;
}

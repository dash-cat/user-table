import { ColumnKind } from './ColumnKind';

export interface ColumnModel {
  name: string;
  isSortable: boolean;
  key: string;
  kind: ColumnKind;
}

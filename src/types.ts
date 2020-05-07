export interface HookOptions {
  apiKey: string;
  sheetId: string;
  sheetsNames: Array<string>;
}

export interface SheetFromResponse {
  properties: any;
  data: Array<any>;
}

export interface SheetsResponse {
  sheets: SheetFromResponse[];
}

export interface Sheet {
  id: string;
  data: Array<object>;
}

export interface HookState {
  loading: boolean;
  error: null | object;
  data: Sheet[];
}

export enum ActionTypes {
  loading = 'LOADING',
  error = 'ERROR',
  success = 'SUCCESS',
}

export type Action =
  | { type: ActionTypes.loading; payload: HookState['loading'] }
  | { type: ActionTypes.error; payload: HookState['error'] }
  | { type: ActionTypes.success; payload: HookState['data'] };

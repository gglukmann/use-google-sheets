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

export interface AppState {
  loading: boolean;
  error: boolean | string;
  data: Sheet[];
}

export enum ActionTypes {
  loading = 'LOADING',
  error = 'ERROR',
  success = 'SUCCESS',
}

export type Action =
  | { type: ActionTypes.loading; payload: AppState['loading'] }
  | { type: ActionTypes.error; payload: AppState['error'] }
  | { type: ActionTypes.success; payload: AppState['data'] };

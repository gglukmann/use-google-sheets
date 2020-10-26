export interface HookOptions {
  apiKey: string;
  sheetId: string;
  sheetsNames: Array<string>;
}

export interface ValueRange {
  majorDimensions: string;
  range: string;
  values: Array<string[]>;
}

export interface ValueRangesResponse {
  spreadsheetId: string;
  valueRanges: Array<ValueRange>;
}

export interface PropertiesFromResponse {
  title: string;
}

export interface SheetFromResponse {
  properties: PropertiesFromResponse;
}

export interface SheetsResponse {
  sheets: SheetFromResponse[];
}

export interface Sheet {
  id: string;
  data: Array<object>;
}

export interface ApiResponse {
  url: string;
  status: number;
  statusText: string;
}

export interface ErrorResponse {
  response: ApiResponse;
}

export interface HookState {
  loading: boolean;
  error: null | ErrorResponse;
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

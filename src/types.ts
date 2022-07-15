export interface SheetsOption {
  id: string;
  headerRowIndex?: number;
}
export interface HookOptions {
  apiKey: string;
  sheetId: string;
  sheetsOptions?: SheetsOption[];
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
  called: boolean;
  error: null | ErrorResponse;
  data: Sheet[];
  refetch: () => void;
}
export enum ActionTypes {
  loading = 'LOADING',
  error = 'ERROR',
  success = 'SUCCESS',
  called = 'CALLED',
}
export type Action =
  | { type: ActionTypes.loading; payload: HookState['loading'] }
  | { type: ActionTypes.called; payload: HookState['called'] }
  | { type: ActionTypes.error; payload: HookState['error'] }
  | { type: ActionTypes.success; payload: HookState['data'] };

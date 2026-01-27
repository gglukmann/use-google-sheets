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
  data: Record<string, unknown>[];
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
  error: ErrorResponse | Error | null;
  data: Sheet[];
  refetch: () => void;
}
export const ActionTypes = {
  loading: "LOADING",
  error: "ERROR",
  success: "SUCCESS",
  called: "CALLED",
} as const;

export type Action =
  | { type: typeof ActionTypes.loading; payload: HookState["loading"] }
  | { type: typeof ActionTypes.called; payload: HookState["called"] }
  | { type: typeof ActionTypes.error; payload: HookState["error"] }
  | { type: typeof ActionTypes.success; payload: HookState["data"] };

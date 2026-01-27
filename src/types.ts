export interface SheetsOption {
  id: string;
  headerRowIndex?: number;
}
export interface UseGoogleSheetsOptions {
  apiKey: string;
  sheetId: string;
  sheetsOptions?: SheetsOption[];
}
export interface Sheet {
  id: string;
  data: Record<string, unknown>[];
}

export const Status = {
  pending: "pending",
  success: "success",
  error: "error",
} as const;

export type StatusType = (typeof Status)[keyof typeof Status];

export interface UseGoogleSheetsState {
  status: StatusType;
  /** @deprecated Use `status === "pending"` instead */
  loading: boolean;
  error: Error | null;
  data: Sheet[];
  refetch: () => void;
}

export type Action =
  | { type: typeof Status.pending }
  | { type: typeof Status.error; payload: UseGoogleSheetsState["error"] }
  | { type: typeof Status.success; payload: UseGoogleSheetsState["data"] };

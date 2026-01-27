import * as React from "react";
import GoogleSheetsMapper from "google-sheets-mapper";

import type { UseGoogleSheetsOptions, UseGoogleSheetsState, Action } from "./types";
import { Status } from "./types";

export type {
  UseGoogleSheetsOptions,
  UseGoogleSheetsState,
  Sheet,
  SheetsOption,
  StatusType,
} from "./types";
export { Status } from "./types";

interface InternalState {
  status: UseGoogleSheetsState["status"];
  error: UseGoogleSheetsState["error"];
  data: UseGoogleSheetsState["data"];
}

const initialState: InternalState = {
  status: Status.pending,
  error: null,
  data: [],
};

function reducer(state: InternalState, action: Action): InternalState {
  switch (action.type) {
    case Status.pending:
      return { ...state, status: Status.pending, error: null };
    case Status.success:
      return { status: Status.success, error: null, data: action.payload };
    case Status.error:
      return { ...state, status: Status.error, error: action.payload };
    default:
      return state;
  }
}

const useGoogleSheets = ({
  apiKey,
  sheetId,
  sheetsOptions = [],
}: UseGoogleSheetsOptions): UseGoogleSheetsState => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const sheetsRef = React.useRef(sheetsOptions);

  React.useEffect(() => {
    sheetsRef.current = sheetsOptions;
  }, [sheetsOptions]);

  const fetchData = React.useCallback(async () => {
    dispatch({ type: Status.pending });
    try {
      const mappedData = await GoogleSheetsMapper.fetchGoogleSheetsData({
        apiKey,
        sheetId,
        sheetsOptions: sheetsRef.current,
      });

      dispatch({ type: Status.success, payload: mappedData });
    } catch (error) {
      dispatch({
        type: Status.error,
        payload: error instanceof Error ? error : (error as UseGoogleSheetsState["error"]),
      });
    }
  }, [apiKey, sheetId]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    status: state.status,
    loading: state.status === Status.pending,
    error: state.error,
    data: state.data,
    refetch: fetchData,
  };
};

export default useGoogleSheets;

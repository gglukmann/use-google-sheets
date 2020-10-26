import * as React from 'react';

import { mapData, makeFetch, getBatchUrl, getSheetsTitleUrl } from './utils';
import {
  HookOptions,
  HookState,
  ActionTypes,
  Action,
  SheetsResponse,
  SheetFromResponse,
  ValueRangesResponse,
} from './types';

const initialState: HookState = {
  loading: true,
  error: null,
  data: [],
};

function reducer(state: HookState, action: Action): HookState {
  switch (action.type) {
    case ActionTypes.loading:
      return { ...state, loading: action.payload };
    case ActionTypes.error:
      return { ...state, error: action.payload };
    case ActionTypes.success:
      return { ...state, data: action.payload };
    default:
      return state;
  }
}

const useGoogleSheets = ({
  apiKey,
  sheetId,
  sheetsNames,
}: HookOptions): HookState => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const sheets = React.useRef(sheetsNames);

  const fetchBatchData = React.useCallback(async () => {
    const url = getBatchUrl(sheetId, sheets.current, apiKey);

    return await makeFetch(url);
  }, [apiKey, sheetId]);

  const fetchAllSheetsData = React.useCallback(async () => {
    const url = getSheetsTitleUrl(sheetId, apiKey);
    const { sheets }: SheetsResponse = await makeFetch(url);
    const batchUrl = getBatchUrl(
      sheetId,
      sheets.map((sheet: SheetFromResponse) => sheet.properties.title),
      apiKey,
    );

    return await makeFetch(batchUrl);
  }, [apiKey, sheetId]);

  const fetchData = React.useCallback(async () => {
    try {
      const response: ValueRangesResponse =
        sheets.current.length === 0
          ? await fetchAllSheetsData()
          : await fetchBatchData();

      dispatch({
        type: ActionTypes.success,
        payload: mapData(response.valueRanges),
      });
    } catch (error) {
      dispatch({ type: ActionTypes.error, payload: error });
    } finally {
      dispatch({ type: ActionTypes.loading, payload: false });
    }
  }, [fetchBatchData, fetchAllSheetsData]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading: state.loading,
    error: state.error,
    data: state.data,
  };
};

export default useGoogleSheets;

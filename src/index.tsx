import * as React from 'react';

import { mapData, makeFetch, getRanges } from './utils';
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

const GOOGLE_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

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
  sheetsNames = [],
}: HookOptions): HookState => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const fetchBatchData = async () => {
    const ranges = getRanges(sheetsNames);
    const url = `${GOOGLE_API_URL}/${sheetId}/values:batchGet?${ranges}&key=${apiKey}`;
    return await makeFetch(url);
  };

  const fetchOneByOneData = async () => {
    const url = `${GOOGLE_API_URL}/${sheetId}?fields=sheets%2Fproperties%2Ftitle&key=${apiKey}`;
    const { sheets }: SheetsResponse = await makeFetch(url);
    const ranges = getRanges(
      sheets.map((sheet: SheetFromResponse) => sheet.properties.title),
    );
    const batchUrl = `${GOOGLE_API_URL}/${sheetId}/values:batchGet?${ranges}&key=${apiKey}`;
    return await makeFetch(batchUrl);
  };

  const fetchData = async () => {
    try {
      const response: ValueRangesResponse =
        sheetsNames.length === 0
          ? await fetchOneByOneData()
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
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return {
    loading: state.loading,
    error: state.error,
    data: state.data,
  };
};

export default useGoogleSheets;

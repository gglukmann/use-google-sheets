import * as React from 'react';
import GoogleSheetsMapper from 'google-sheets-mapper';

import { HookOptions, HookState, ActionTypes, Action } from './types';

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
  sheetsNames = [],
}: HookOptions): HookState => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const sheets = React.useRef(sheetsNames);

  const fetchData = React.useCallback(async () => {
    try {
      const mappedData = await GoogleSheetsMapper.fetchGoogleSheetsData({
        apiKey,
        sheetId,
        sheetsNames: sheets.current,
      });

      dispatch({
        type: ActionTypes.success,
        payload: mappedData,
      });
    } catch (error) {
      dispatch({ type: ActionTypes.error, payload: error });
    } finally {
      dispatch({ type: ActionTypes.loading, payload: false });
    }
  }, [apiKey, sheetId]);

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

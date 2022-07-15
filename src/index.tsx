import * as React from 'react';
import GoogleSheetsMapper from 'google-sheets-mapper';

import { HookOptions, HookState, ActionTypes, Action } from './types';

const initialState: HookState = {
  loading: true,
  error: null,
  data: [],
  called: false,
  refetch: () => {},
};

function reducer(state: HookState, action: Action): HookState {
  switch (action.type) {
    case ActionTypes.loading:
      return { ...state, loading: action.payload };
    case ActionTypes.error:
      return { ...state, error: action.payload };
    case ActionTypes.success:
      return { ...state, data: action.payload };
    case ActionTypes.called:
      return { ...state, called: action.payload };
    default:
      return state;
  }
}

const useGoogleSheets = ({
  apiKey,
  sheetId,
  sheetsOptions = [],
}: HookOptions): HookState => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const sheets = React.useRef(sheetsOptions);

  const fetchData = React.useCallback(async () => {
    dispatch({ type: ActionTypes.loading, payload: true });
    dispatch({ type: ActionTypes.called, payload: false });
    dispatch({ type: ActionTypes.error, payload: null });
    dispatch({ type: ActionTypes.success, payload: [] });
    try {
      const mappedData = await GoogleSheetsMapper.fetchGoogleSheetsData({
        apiKey,
        sheetId,
        sheetsOptions: sheets.current,
      });

      dispatch({
        type: ActionTypes.success,
        payload: mappedData,
      });
    } catch (error) {
      dispatch({ type: ActionTypes.error, payload: error });
    } finally {
      dispatch({ type: ActionTypes.loading, payload: false });
      dispatch({ type: ActionTypes.called, payload: true });
    }
  }, [apiKey, sheetId]);

  const refetch = React.useCallback(() => {
    if (state.called) {
      fetchData();
    }
  }, [fetchData, state.called]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    loading: state.loading,
    error: state.error,
    data: state.data,
    called: state.called,
    refetch,
  };
};

export default useGoogleSheets;

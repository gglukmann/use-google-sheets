import * as React from 'react';

import { mapData, makeFetch } from './utils';
import {
  HookOptions,
  AppState,
  ActionTypes,
  Action,
  SheetsResponse,
} from './types';

const initialState: AppState = {
  loading: false,
  error: false,
  data: [],
};

function reducer(state: AppState, action: Action): AppState {
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
}: HookOptions): AppState => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}&includeGridData=true&fields=sheets(data%2FrowData%2Fvalues%2FformattedValue%2Cproperties%2Ftitle)`;
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    async function fetchData() {
      dispatch({ type: ActionTypes.loading, payload: true });

      try {
        const response: SheetsResponse = await makeFetch(url);

        dispatch({
          type: ActionTypes.success,
          payload: mapData(response.sheets, sheetsNames),
        });
      } catch (error) {
        dispatch({ type: ActionTypes.error, payload: error });
      } finally {
        dispatch({ type: ActionTypes.loading, payload: false });
      }
    }

    fetchData();
  }, [sheetsNames, url]);

  return {
    loading: state.loading,
    error: state.error,
    data: state.data,
  };
};

export default useGoogleSheets;

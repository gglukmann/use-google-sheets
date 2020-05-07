import * as React from 'react';

import { mapData, makeFetch } from './utils';
import {
  HookOptions,
  HookState,
  ActionTypes,
  Action,
  SheetsResponse,
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
  sheetsNames = [],
}: HookOptions): HookState => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}&includeGridData=true&fields=sheets(data%2FrowData%2Fvalues%2FformattedValue%2Cproperties%2Ftitle)`;
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [sheets] = React.useState(sheetsNames);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response: SheetsResponse = await makeFetch(url);

        dispatch({
          type: ActionTypes.success,
          payload: mapData(response.sheets, sheets),
        });
      } catch (error) {
        dispatch({ type: ActionTypes.error, payload: error });
      } finally {
        dispatch({ type: ActionTypes.loading, payload: false });
      }
    }

    fetchData();
  }, [sheets, url]);

  return {
    loading: state.loading,
    error: state.error,
    data: state.data,
  };
};

export default useGoogleSheets;

import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import useGoogleSheets from '../.';

const REACT_APP_GOOGLE_API_KEY = '';
const REACT_APP_GOOGLE_SHEETS_ID = '';

const sheetsNames = ['Sheet1'];

const App = () => {
  const { data, loading, error } = useGoogleSheets({
    apiKey: REACT_APP_GOOGLE_API_KEY,
    sheetId: REACT_APP_GOOGLE_SHEETS_ID,
    sheetsNames,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error!</div>;
  }

  return <div>{JSON.stringify(data)}</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));

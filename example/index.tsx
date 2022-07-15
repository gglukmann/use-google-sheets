import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import useGoogleSheets from '../src/index';

const REACT_APP_GOOGLE_API_KEY = '';
const REACT_APP_GOOGLE_SHEETS_ID =
  '1zbEyIfga05-gXTCVGejJHpl8ZrlcTYanvgnQBa1t2DM';

const sheetsOptions = [{ id: 'Sheet1', headerRowIndex: 1 }, { id: 'Sheet2' }];

const App = () => {
  const { data, loading, error } = useGoogleSheets({
    apiKey: REACT_APP_GOOGLE_API_KEY,
    sheetId: REACT_APP_GOOGLE_SHEETS_ID,
    sheetsOptions,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error!</div>;
  }

  return <div>{JSON.stringify(data)}</div>;
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);

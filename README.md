# useGoogleSheets

### A React Hook for getting data from Google Sheets API v4

[![Minified file size](https://img.badgesize.io/https://www.unpkg.com/use-google-sheets/dist/use-google-sheets.esm.js.svg)](https://bundlephobia.com/result?p=use-google-sheets) [![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![NPM version](https://img.shields.io/npm/v/use-google-sheets)](https://www.npmjs.com/package/use-google-sheets)

---

## Installation

Package can be added using **yarn**:

```bash
yarn add use-google-sheets
```

Or, use **NPM**:

```bash
npm install use-google-sheets
```

UMD build available on [unpkg](https://www.unpkg.com/browse/use-google-sheets@1.0.0/dist/use-google-sheets.cjs.production.min.js).

---

## Usage

1. Go to [Google Cloud Console](https://console.cloud.google.com/) to get API key for Google Sheets API.
2. Create a Google Sheet and add some data. See [example sheet](https://docs.google.com/spreadsheets/d/1zbEyIfga05-gXTCVGejJHpl8ZrlcTYanvgnQBa1t2DM/edit#gid=0).
3. Share it with "Anyone with this link can view".
4. Get sheet id from url of the sheet.

```html
https://docs.google.com/spreadsheets/d/[THIS-IS-THE-DOC-ID]/
```

5. I suggest adding API key and sheet id to `.env` file

---

## Examples

### Get data from all sheets inside the spreadsheet

```js
import useGoogleSheets from 'use-google-sheets';

const App = () => {
  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error!</div>;
  }

  return <div>{JSON.stringify(data)}</div>;
};
```

### Get data from specific sheets inside the spreadsheet

```js
import useGoogleSheets from 'use-google-sheets';

const sheetsNames = ['Sheet1'];

const App = () => {
  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID,
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
```

---

## API Documentation

The `useGoogleSheets` hook takes an object with three properties:

| Name        | Value  |
| ----------- | ------ |
| apiKey      | string |
| sheetId     | string |
| sheetsNames | array  |

- `apiKey` is a Google Sheets API v4 key from [Google Cloud Console](https://console.cloud.google.com/).
- `sheetId` is the id of the sheet.
- `sheetsNames` is an array of specific sheet names. Can be left out then it will fallback to all sheets inside the spreadsheet.

### ExposedData

The hook produces an `HookState` object:

```js
const { data, loading, error } = useGoogleSheets({ apiKey, sheetId });
```

| Name    | Value          |
| ------- | -------------- |
| data    | array          |
| loading | boolean        |
| error   | null or object |

- `data` is an array of mapped data objects.

```js
[
  {
    id: 'Sheet1',
    data: [
      { value: 'et', key: 'language' },
      { value: 'Test sheet', key: 'title' },
    ],
  },
];
```

- `loading` lets you know whether data is being fetched and mapped.
- `error` lets you know when there is something wrong. It returns an object with

```js
{
  status: '404',
  statusText: '',
}
```

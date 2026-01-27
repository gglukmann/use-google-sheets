# useGoogleSheets

## A React Hook wrapper library for [google-sheets-mapper](https://github.com/gglukmann/google-sheets-mapper) for getting data from [Google Sheets API v4](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values)

[![Minified file size](https://badgen.net/bundlephobia/min/use-google-sheets)](https://bundlephobia.com/result?p=use-google-sheets) [![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![NPM version](https://img.shields.io/npm/v/use-google-sheets)](https://www.npmjs.com/package/use-google-sheets)

---

## Installation

```bash
npm install use-google-sheets
```

```bash
pnpm add use-google-sheets
```

```bash
bun add use-google-sheets
```

Package available on [unpkg](https://www.unpkg.com/browse/use-google-sheets/).

---

## Usage

1. Go to [Google Cloud Console](https://console.cloud.google.com/) to get API key for Google Sheets API.
2. Create a Google Sheet and add some data. See [example sheet](https://docs.google.com/spreadsheets/d/1zbEyIfga05-gXTCVGejJHpl8ZrlcTYanvgnQBa1t2DM/edit#gid=0).
3. Share it with "Anyone with this link can view".
4. Get sheet id from url of the sheet.

```html
https://docs.google.com/spreadsheets/d/[THIS-IS-THE-SHEET-ID]/
```

5. I suggest adding API key and sheet id to `.env` file

---

## Examples

### Get data from all sheets inside the spreadsheet

```js
import useGoogleSheets, { Status } from "use-google-sheets";

const App = () => {
  const { status, data, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID,
  });

  if (status === Status.pending) {
    return <div>Loading...</div>;
  }

  if (status === Status.error) {
    return <div>Error!</div>;
  }

  return <div>{JSON.stringify(data)}</div>;
};
```

### Get data from specific sheets inside the spreadsheet

Don't use single quotes on sheet names, they will be removed because when using space in sheet name it will be returned wrapped with single quotes and plugin will remove them for clean string id.

```js
import useGoogleSheets, { Status } from "use-google-sheets";

const App = () => {
  const { status, data } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID,
    sheetsOptions: [{ id: "Sheet1" }],
  });

  if (status === Status.pending) {
    return <div>Loading...</div>;
  }

  if (status === Status.error) {
    return <div>Error!</div>;
  }

  return <div>{JSON.stringify(data)}</div>;
};
```

### Refetch data from all sheets inside the spreadsheet

```js
import useGoogleSheets, { Status } from "use-google-sheets";

const App = () => {
  const { status, data, refetch } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID,
  });

  if (status === Status.pending) {
    return <div>Loading...</div>;
  }

  if (status === Status.error) {
    return <div>Error!</div>;
  }

  return (
    <div>
      <div>{JSON.stringify(data)}</div>

      <button onClick={refetch}>Refetch</button>
    </div>
  );
};
```

---

## API Documentation

The `useGoogleSheets` hook takes an object with three properties:

| Name          | Value  |
| ------------- | ------ |
| apiKey        | string |
| sheetId       | string |
| sheetsOptions | array  |

- `apiKey` is a Google Sheets API v4 key from [Google Cloud Console](https://console.cloud.google.com/).
- `sheetId` is the id of the sheet.
- `sheetsOptions` is an array of specific objects `{ id, headerRowIndex }`. Can be left out then it will fallback to all sheets inside the spreadsheet and use first row from sheet as header.

### Exposed Data

The hook produces an `HookState` object:

```js
const { status, data, error, refetch, loading } = useGoogleSheets({
  apiKey,
  sheetId,
});
```

| Name    | Value                                   |
| ------- | --------------------------------------- |
| status  | `"pending"` \| `"success"` \| `"error"` |
| data    | array                                   |
| error   | null or object                          |
| refetch | function                                |
| loading | boolean (deprecated, use `status`)      |

- `status` indicates the current state of the request:
  - `pending` - request is in-flight
  - `success` - data received successfully
  - `error` - request failed
- `loading` is `true` when `status === "pending"` (deprecated).
- `data` is an array of mapped data objects.

```js
[
  {
    id: "Sheet1",
    data: [
      { key: "language", value: "et" },
      { key: "title", value: "Test sheet" },
    ],
  },
];
```

- `error` lets you know when there is something wrong. It returns an error object where you can get specific error properties from `error.response`

```js
{
  status: '404',
  statusText: '',
  url: 'https://sheets.googleapis.com/v4/spreadsheets/...',
}
```

### Status Constant

Import the `Status` constant for status comparisons:

```js
import { Status } from "use-google-sheets";

Status.pending; // "pending"
Status.success; // "success"
Status.error; // "error"
```

## Migration from v2 to v3

- New `status` field: `"pending"` | `"success"` | `"error"` (aligned with [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery))
- `loading` is still available but deprecated (use `status === "pending"`)
- `called` has been removed

## Migration from v1 to v2

- Change `sheetsNames` array of string to `sheetsOptions` array of objects with `{ id: 'sheetName' }`

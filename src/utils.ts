import { HookOptions, SheetFromResponse, Sheet, ApiResponse } from './types';

class ApiResponseError extends Error {
  constructor(message: string, public readonly response: ApiResponse) {
    super(message);
    Object.setPrototypeOf(this, ApiResponseError.prototype);
    this.response = response;
    Error.captureStackTrace(this, ApiResponseError);
  }
}

export const makeFetch = async (url: string, config = {}) => {
  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new ApiResponseError(
        `Request to '${url}' failed with ${response.status}${
          response.statusText ? `: ${response.statusText}` : ''
        }`,
        {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        }
      );
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const mapHeader = (header: any) => {
  return header.values.map(
    (row: { formattedValue: string }) => row.formattedValue
  );
};

const mapRecords = (records: any, headerData: any) => {
  return records
    .filter((record: any) => Object.keys(record).length > 0)
    .map((record: any) => {
      let result = {};

      headerData.forEach((value: string, index: number) => {
        result = {
          [value]: record.values?.[index]?.formattedValue || null,
          ...result,
        };
      });

      return result;
    });
};

const filterSheets = (
  sheets: Sheet[],
  sheetNames: HookOptions['sheetsNames']
): Sheet[] => {
  let filteredSheets = sheets;

  if (sheetNames.length > 0) {
    filteredSheets = sheets.filter((sheet: Sheet) =>
      sheetNames.includes(sheet.id)
    );
  }

  return filteredSheets;
};

export const mapData = (
  sheets: SheetFromResponse[],
  sheetNames: HookOptions['sheetsNames']
): Sheet[] => {
  const result = sheets.map((sheet: SheetFromResponse) => {
    const id = sheet.properties.title;
    const rows = sheet.data[0].rowData;

    if (rows.length > 0) {
      const [header, ...records] = rows;
      const headerData = mapHeader(header);
      const recordsData = mapRecords(records, headerData);

      return {
        id,
        data: recordsData,
      };
    }

    return {
      id,
      data: [],
    };
  });

  return filterSheets(result, sheetNames);
};

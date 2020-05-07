import { HookOptions, SheetFromResponse, Sheet } from './types';

export const makeFetch = async (url: string, config = {}) => {
  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw { statusText: response.statusText, status: response.status };
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
  return records.map((record: any) => {
    let result = {};

    headerData.forEach((value: string, index: number) => {
      result = {
        [value]: record.values[index]?.formattedValue || null,
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
    const firstRow = sheet.data[0].rowData;

    if (firstRow) {
      const [header, ...records] = firstRow;
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

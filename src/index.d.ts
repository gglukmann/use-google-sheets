import { HookOptions, AppState } from './types';

export default function useGoogleSheets({
  apiKey,
  sheetId,
  sheetsNames,
}: HookOptions): AppState;

import { HookOptions, HookState } from './types';

export default function useGoogleSheets({
  apiKey,
  sheetId,
  sheetsNames,
}: HookOptions): HookState;

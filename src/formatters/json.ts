import { FileResult } from '../types';

export function formatJsonOutput(fileResults: FileResult[]): string {
  return JSON.stringify(fileResults, null, 2);
}

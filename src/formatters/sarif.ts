import { FileResult, SarifResult } from '../types';
import { ALL_RULES } from '../rules';

export function formatSarifOutput(fileResults: FileResult[]): string {
  const sarifResult: SarifResult = {
    version: '2.1.0',
    $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
    runs: [
      {
        tool: {
          driver: {
            name: 'tool-lint',
            version: '1.0.0',
            rules: ALL_RULES.map(rule => ({
              id: rule.id,
              shortDescription: {
                text: rule.description,
              },
              fullDescription: {
                text: rule.description,
              },
              defaultConfiguration: {
                level: rule.severity === 'error' ? 'error' : rule.severity === 'warning' ? 'warning' : 'note',
              },
            })),
          },
        },
        results: [],
      },
    ],
  };

  for (const fileResult of fileResults) {
    for (const toolResult of fileResult.results) {
      for (const violation of toolResult.violations) {
        sarifResult.runs[0].results.push({
          ruleId: violation.ruleId,
          level: violation.severity === 'error' ? 'error' : violation.severity === 'warning' ? 'warning' : 'note',
          message: {
            text: `${violation.message}\n${violation.suggestion}`,
          },
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: fileResult.filePath,
                },
                region: violation.line ? {
                  startLine: violation.line,
                } : undefined,
              },
            },
          ],
        });
      }
    }
  }

  return JSON.stringify(sarifResult, null, 2);
}

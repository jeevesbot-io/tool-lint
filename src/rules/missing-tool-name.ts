import { Rule, ToolDefinition, LintContext, LintViolation } from '../types';

export const missingToolName: Rule = {
  id: 'missing-tool-name',
  severity: 'error',
  description: 'Tool must have a name',
  check: (tool: ToolDefinition, context: LintContext): LintViolation[] => {
    if (!tool.name || tool.name.trim() === '') {
      return [{
        ruleId: 'missing-tool-name',
        severity: 'error',
        message: 'Tool is missing a name',
        suggestion: 'Add a descriptive name property to the tool definition',
        path: `${context.filePath}`,
      }];
    }
    return [];
  },
};

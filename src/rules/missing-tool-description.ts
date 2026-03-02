import { Rule, ToolDefinition, LintContext, LintViolation } from '../types';

export const missingToolDescription: Rule = {
  id: 'missing-tool-description',
  severity: 'error',
  description: 'Tool must have a description',
  check: (tool: ToolDefinition, context: LintContext): LintViolation[] => {
    if (!tool.description || tool.description.trim() === '') {
      return [{
        ruleId: 'missing-tool-description',
        severity: 'error',
        message: `Tool "${tool.name || 'unnamed'}" is missing a description`,
        suggestion: 'Add a clear description explaining what this tool does and when to use it',
        path: `${context.filePath} > ${tool.name || 'unnamed'} > description`,
      }];
    }
    return [];
  },
};

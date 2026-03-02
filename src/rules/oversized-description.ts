import { Rule, ToolDefinition, LintContext, LintViolation } from '../types';

const MAX_DESCRIPTION_LENGTH = 500;

export const oversizedDescription: Rule = {
  id: 'oversized-description',
  severity: 'info',
  description: 'Descriptions should be concise for token efficiency',
  check: (tool: ToolDefinition, context: LintContext): LintViolation[] => {
    const violations: LintViolation[] = [];
    
    if (tool.description && tool.description.length > MAX_DESCRIPTION_LENGTH) {
      violations.push({
        ruleId: 'oversized-description',
        severity: 'info',
        message: `Tool "${tool.name}" has a very long description (${tool.description.length} chars, max recommended: ${MAX_DESCRIPTION_LENGTH})`,
        suggestion: 'Shorten the description to be more concise while keeping key information',
        path: `${context.filePath} > ${tool.name} > description`,
      });
    }

    if (!tool.parameters) {
      return violations;
    }

    function checkDescriptions(obj: any, path: string): void {
      if (obj && typeof obj === 'object') {
        if (obj.description && obj.description.length > MAX_DESCRIPTION_LENGTH) {
          violations.push({
            ruleId: 'oversized-description',
            severity: 'info',
            message: `Description at "${path}" is very long (${obj.description.length} chars)`,
            suggestion: 'Shorten to be more concise for better token efficiency',
            path: `${context.filePath} > ${tool.name} > ${path}`,
          });
        }

        if (obj.properties) {
          for (const [key, value] of Object.entries(obj.properties)) {
            checkDescriptions(value, `${path}.${key}`);
          }
        }
        if (obj.items) {
          checkDescriptions(obj.items, `${path}.items`);
        }
      }
    }

    checkDescriptions(tool.parameters, 'parameters');

    return violations;
  },
};

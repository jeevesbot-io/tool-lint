import { Rule, ToolDefinition, LintContext, LintViolation } from '../types';

export const ambiguousEnum: Rule = {
  id: 'ambiguous-enum',
  severity: 'info',
  description: 'Enum values should be clear and self-documenting',
  check: (tool: ToolDefinition, context: LintContext): LintViolation[] => {
    const violations: LintViolation[] = [];
    
    if (!tool.parameters) {
      return violations;
    }

    function checkEnums(obj: any, path: string): void {
      if (obj && typeof obj === 'object') {
        if (obj.enum && Array.isArray(obj.enum)) {
          for (const value of obj.enum) {
            // Check for single character enums
            if (typeof value === 'string' && value.length === 1) {
              violations.push({
                ruleId: 'ambiguous-enum',
                severity: 'info',
                message: `Enum value "${value}" in "${path}" is a single character`,
                suggestion: 'Use descriptive enum values instead of single characters (e.g., "high" instead of "h")',
                path: `${context.filePath} > ${tool.name} > ${path}`,
              });
            }
            // Check for number-only enums without context
            if (typeof value === 'number' && !obj.description) {
              violations.push({
                ruleId: 'ambiguous-enum',
                severity: 'info',
                message: `Numeric enum value ${value} in "${path}" lacks context`,
                suggestion: 'Add a description explaining what each numeric value represents',
                path: `${context.filePath} > ${tool.name} > ${path}`,
              });
            }
          }
        }

        if (obj.properties) {
          for (const [key, value] of Object.entries(obj.properties)) {
            checkEnums(value, `${path}.${key}`);
          }
        }
        if (obj.items) {
          checkEnums(obj.items, `${path}[]`);
        }
      }
    }

    checkEnums(tool.parameters, 'parameters');

    return violations;
  },
};

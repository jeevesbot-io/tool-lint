import { Rule, ToolDefinition, LintContext, LintViolation } from '../types';

const MAX_NESTING_DEPTH = 3;

export const deeplyNestedSchema: Rule = {
  id: 'deeply-nested-schema',
  severity: 'warning',
  description: 'Schema should not be too deeply nested',
  check: (tool: ToolDefinition, context: LintContext): LintViolation[] => {
    const violations: LintViolation[] = [];
    
    if (!tool.parameters) {
      return violations;
    }

    function checkDepth(obj: any, currentDepth: number, path: string): void {
      if (currentDepth > MAX_NESTING_DEPTH) {
        violations.push({
          ruleId: 'deeply-nested-schema',
          severity: 'warning',
          message: `Tool "${tool.name}" has schema nesting depth of ${currentDepth} (max recommended: ${MAX_NESTING_DEPTH})`,
          suggestion: 'Flatten the schema structure or split into multiple simpler tools',
          path: `${context.filePath} > ${tool.name} > ${path}`,
        });
        return;
      }

      if (obj && typeof obj === 'object') {
        if (obj.properties) {
          for (const [key, value] of Object.entries(obj.properties)) {
            checkDepth(value, currentDepth + 1, `${path}.${key}`);
          }
        }
        if (obj.items) {
          checkDepth(obj.items, currentDepth + 1, `${path}[]`);
        }
      }
    }

    checkDepth(tool.parameters, 0, 'parameters');

    return violations;
  },
};

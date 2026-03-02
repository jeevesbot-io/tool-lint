import { Rule, ToolDefinition, LintContext, LintViolation } from '../types';

export const missingRequiredField: Rule = {
  id: 'missing-required-field',
  severity: 'error',
  description: 'Required fields must exist in properties',
  check: (tool: ToolDefinition, context: LintContext): LintViolation[] => {
    const violations: LintViolation[] = [];
    
    if (!tool.parameters) {
      return violations;
    }

    const properties = tool.parameters.properties || {};
    const required = tool.parameters.required || [];

    for (const requiredField of required) {
      if (!(requiredField in properties)) {
        violations.push({
          ruleId: 'missing-required-field',
          severity: 'error',
          message: `Tool "${tool.name}" lists "${requiredField}" as required but it's not in properties`,
          suggestion: `Either add "${requiredField}" to properties or remove it from the required array`,
          path: `${context.filePath} > ${tool.name} > parameters.required`,
        });
      }
    }

    return violations;
  },
};

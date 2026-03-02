import { Rule, ToolDefinition, LintContext, LintViolation } from '../types';

export const duplicateParamNames: Rule = {
  id: 'duplicate-param-names',
  severity: 'error',
  description: 'Parameter names must be unique',
  check: (tool: ToolDefinition, context: LintContext): LintViolation[] => {
    const violations: LintViolation[] = [];
    
    if (!tool.parameters) {
      return violations;
    }

    const properties = tool.parameters.properties || {};
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    for (const paramName of Object.keys(properties)) {
      const lowerName = paramName.toLowerCase();
      if (seen.has(lowerName)) {
        duplicates.add(paramName);
      }
      seen.add(lowerName);
    }

    for (const duplicate of duplicates) {
      violations.push({
        ruleId: 'duplicate-param-names',
        severity: 'error',
        message: `Tool "${tool.name}" has duplicate parameter name "${duplicate}" (case-insensitive)`,
        suggestion: `Rename one of the "${duplicate}" parameters to be unique`,
        path: `${context.filePath} > ${tool.name} > parameters.properties`,
      });
    }

    return violations;
  },
};

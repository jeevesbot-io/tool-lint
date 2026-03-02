import { Rule, ToolDefinition, LintContext, LintViolation } from '../types';

export const missingParamDescription: Rule = {
  id: 'missing-param-description',
  severity: 'warning',
  description: 'Parameters should have descriptions',
  check: (tool: ToolDefinition, context: LintContext): LintViolation[] => {
    const violations: LintViolation[] = [];
    
    if (!tool.parameters) {
      return violations;
    }

    const properties = tool.parameters.properties || {};

    for (const [paramName, paramDef] of Object.entries(properties)) {
      if (typeof paramDef === 'object' && paramDef !== null) {
        const def = paramDef as Record<string, any>;
        if (!def.description || def.description.trim() === '') {
          violations.push({
            ruleId: 'missing-param-description',
            severity: 'warning',
            message: `Parameter "${paramName}" in tool "${tool.name}" is missing a description`,
            suggestion: `Add a description explaining what "${paramName}" is used for and what values are expected`,
            path: `${context.filePath} > ${tool.name} > parameters.properties.${paramName}`,
          });
        }
      }
    }

    return violations;
  },
};

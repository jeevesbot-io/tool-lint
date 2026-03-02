import { Rule, ToolDefinition, LintContext, LintViolation } from '../types';

const DEFAULT_MAX_PARAMS = 8;

export const tooManyParams: Rule = {
  id: 'too-many-params',
  severity: 'warning',
  description: 'Tool should not have too many parameters',
  check: (tool: ToolDefinition, context: LintContext): LintViolation[] => {
    const violations: LintViolation[] = [];
    
    if (!tool.parameters) {
      return violations;
    }

    const properties = tool.parameters.properties || {};
    const paramCount = Object.keys(properties).length;

    if (paramCount > DEFAULT_MAX_PARAMS) {
      violations.push({
        ruleId: 'too-many-params',
        severity: 'warning',
        message: `Tool "${tool.name}" has ${paramCount} parameters (max recommended: ${DEFAULT_MAX_PARAMS})`,
        suggestion: `Consider grouping related parameters into nested objects or splitting this into multiple tools`,
        path: `${context.filePath} > ${tool.name} > parameters`,
      });
    }

    return violations;
  },
};

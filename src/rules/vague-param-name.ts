import { Rule, ToolDefinition, LintContext, LintViolation } from '../types';

const VAGUE_NAMES = [
  'data',
  'input',
  'value',
  'args',
  'options',
  'config',
  'params',
  'obj',
  'item',
  'thing',
];

export const vagueParamName: Rule = {
  id: 'vague-param-name',
  severity: 'warning',
  description: 'Parameter names should be specific and descriptive',
  check: (tool: ToolDefinition, context: LintContext): LintViolation[] => {
    const violations: LintViolation[] = [];
    
    if (!tool.parameters) {
      return violations;
    }

    const properties = tool.parameters.properties || {};

    for (const paramName of Object.keys(properties)) {
      if (VAGUE_NAMES.includes(paramName.toLowerCase())) {
        violations.push({
          ruleId: 'vague-param-name',
          severity: 'warning',
          message: `Parameter "${paramName}" in tool "${tool.name}" has a vague name`,
          suggestion: `Rename "${paramName}" to something more specific that describes what this parameter represents (e.g., "userData" instead of "data", "searchQuery" instead of "input")`,
          path: `${context.filePath} > ${tool.name} > parameters.properties.${paramName}`,
        });
      }
    }

    return violations;
  },
};

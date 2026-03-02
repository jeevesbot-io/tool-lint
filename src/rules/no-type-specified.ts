import { Rule, ToolDefinition, LintContext, LintViolation } from '../types';

export const noTypeSpecified: Rule = {
  id: 'no-type-specified',
  severity: 'error',
  description: 'Parameters must have type definitions',
  check: (tool: ToolDefinition, context: LintContext): LintViolation[] => {
    const violations: LintViolation[] = [];
    
    if (!tool.parameters) {
      return violations;
    }

    function checkTypes(obj: any, path: string): void {
      if (obj && typeof obj === 'object') {
        // Skip if this is the root parameters object
        if (path !== 'parameters' && path !== 'parameters.properties') {
          // Check if type is missing (and it's not just a container with properties)
          if (!obj.type && !obj.$ref && !obj.anyOf && !obj.oneOf && !obj.allOf) {
            // Only flag if it doesn't have properties (which would make it an object)
            if (!obj.properties) {
              violations.push({
                ruleId: 'no-type-specified',
                severity: 'error',
                message: `Parameter at "${path}" is missing a type definition`,
                suggestion: 'Add a "type" field (e.g., "string", "number", "boolean", "object", "array")',
                path: `${context.filePath} > ${tool.name} > ${path}`,
              });
            }
          }
        }

        if (obj.properties) {
          for (const [key, value] of Object.entries(obj.properties)) {
            checkTypes(value, `${path}.${key}`);
          }
        }
        if (obj.items) {
          checkTypes(obj.items, `${path}.items`);
        }
      }
    }

    const properties = tool.parameters.properties || {};
    for (const [key, value] of Object.entries(properties)) {
      checkTypes(value, `parameters.properties.${key}`);
    }

    return violations;
  },
};

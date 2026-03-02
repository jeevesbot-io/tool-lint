import { Rule, ToolDefinition, LintContext, LintViolation } from '../types';

const VAGUE_PHRASES = [
  'does stuff',
  'handles things',
  'processes data',
  'manages items',
  'does something',
  'performs action',
  'executes',
  'runs',
];

export const vagueToolDescription: Rule = {
  id: 'vague-tool-description',
  severity: 'warning',
  description: 'Tool description should be clear and specific',
  check: (tool: ToolDefinition, context: LintContext): LintViolation[] => {
    const violations: LintViolation[] = [];
    
    if (!tool.description) {
      return violations;
    }

    const desc = tool.description.toLowerCase();

    // Check for too short
    if (desc.trim().length < 20) {
      violations.push({
        ruleId: 'vague-tool-description',
        severity: 'warning',
        message: `Tool "${tool.name}" has a very short description (${desc.trim().length} chars)`,
        suggestion: 'Expand the description to at least 20 characters with specific details about what the tool does',
        path: `${context.filePath} > ${tool.name} > description`,
      });
    }

    // Check for vague phrases
    for (const phrase of VAGUE_PHRASES) {
      if (desc.includes(phrase)) {
        violations.push({
          ruleId: 'vague-tool-description',
          severity: 'warning',
          message: `Tool "${tool.name}" uses vague phrase "${phrase}" in description`,
          suggestion: `Replace "${phrase}" with specific details about what the tool actually does`,
          path: `${context.filePath} > ${tool.name} > description`,
        });
      }
    }

    return violations;
  },
};

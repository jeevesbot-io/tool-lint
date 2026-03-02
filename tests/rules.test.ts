import { describe, it, expect } from 'vitest';
import { missingToolName } from '../src/rules/missing-tool-name';
import { missingToolDescription } from '../src/rules/missing-tool-description';
import { vagueToolDescription } from '../src/rules/vague-tool-description';
import { tooManyParams } from '../src/rules/too-many-params';
import { LintContext, ToolDefinition } from '../src/types';

const mockContext: LintContext = {
  filePath: 'test.json',
  format: 'mcp',
};

describe('Rules', () => {
  describe('missing-tool-name', () => {
    it('should flag tools without names', () => {
      const tool: ToolDefinition = {
        description: 'A tool',
      };
      const violations = missingToolName.check(tool, mockContext);
      expect(violations).toHaveLength(1);
      expect(violations[0].ruleId).toBe('missing-tool-name');
    });

    it('should pass tools with names', () => {
      const tool: ToolDefinition = {
        name: 'my-tool',
        description: 'A tool',
      };
      const violations = missingToolName.check(tool, mockContext);
      expect(violations).toHaveLength(0);
    });
  });

  describe('missing-tool-description', () => {
    it('should flag tools without descriptions', () => {
      const tool: ToolDefinition = {
        name: 'my-tool',
      };
      const violations = missingToolDescription.check(tool, mockContext);
      expect(violations).toHaveLength(1);
    });

    it('should pass tools with descriptions', () => {
      const tool: ToolDefinition = {
        name: 'my-tool',
        description: 'This is a valid description',
      };
      const violations = missingToolDescription.check(tool, mockContext);
      expect(violations).toHaveLength(0);
    });
  });

  describe('vague-tool-description', () => {
    it('should flag short descriptions', () => {
      const tool: ToolDefinition = {
        name: 'my-tool',
        description: 'Short',
      };
      const violations = vagueToolDescription.check(tool, mockContext);
      expect(violations.length).toBeGreaterThan(0);
    });

    it('should flag vague phrases', () => {
      const tool: ToolDefinition = {
        name: 'my-tool',
        description: 'This tool does stuff with data',
      };
      const violations = vagueToolDescription.check(tool, mockContext);
      expect(violations.length).toBeGreaterThan(0);
    });

    it('should pass clear descriptions', () => {
      const tool: ToolDefinition = {
        name: 'my-tool',
        description: 'Retrieves user profile information from the database based on user ID',
      };
      const violations = vagueToolDescription.check(tool, mockContext);
      expect(violations).toHaveLength(0);
    });
  });

  describe('too-many-params', () => {
    it('should flag tools with too many parameters', () => {
      const tool: ToolDefinition = {
        name: 'my-tool',
        description: 'A tool',
        parameters: {
          type: 'object',
          properties: {
            p1: { type: 'string' },
            p2: { type: 'string' },
            p3: { type: 'string' },
            p4: { type: 'string' },
            p5: { type: 'string' },
            p6: { type: 'string' },
            p7: { type: 'string' },
            p8: { type: 'string' },
            p9: { type: 'string' },
          },
        },
      };
      const violations = tooManyParams.check(tool, mockContext);
      expect(violations).toHaveLength(1);
    });

    it('should pass tools with reasonable parameter counts', () => {
      const tool: ToolDefinition = {
        name: 'my-tool',
        description: 'A tool',
        parameters: {
          type: 'object',
          properties: {
            p1: { type: 'string' },
            p2: { type: 'string' },
          },
        },
      };
      const violations = tooManyParams.check(tool, mockContext);
      expect(violations).toHaveLength(0);
    });
  });
});

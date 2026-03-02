import { describe, it, expect } from 'vitest';
import { parseSchema, ParseError } from '../src/parser';

describe('Parser', () => {
  it('should parse MCP format', () => {
    const content = JSON.stringify([
      {
        name: 'test-tool',
        description: 'A test tool',
        inputSchema: {
          type: 'object',
          properties: {
            param1: { type: 'string' }
          }
        }
      }
    ]);

    const result = parseSchema(content, 'test.json');
    expect(result.format).toBe('mcp');
    expect(result.tools).toHaveLength(1);
    expect(result.tools[0].name).toBe('test-tool');
  });

  it('should parse OpenAI format', () => {
    const content = JSON.stringify([
      {
        name: 'test-function',
        description: 'A test function',
        parameters: {
          type: 'object',
          properties: {
            param1: { type: 'string' }
          }
        }
      }
    ]);

    const result = parseSchema(content, 'test.json');
    expect(result.format).toBe('openai');
    expect(result.tools).toHaveLength(1);
  });

  it('should parse Anthropic format', () => {
    const content = JSON.stringify([
      {
        name: 'test-tool',
        description: 'A test tool',
        input_schema: {
          type: 'object',
          properties: {
            param1: { type: 'string' }
          }
        }
      }
    ]);

    const result = parseSchema(content, 'test.json');
    expect(result.format).toBe('anthropic');
    expect(result.tools).toHaveLength(1);
  });

  it('should handle wrapped tools array', () => {
    const content = JSON.stringify({
      tools: [
        {
          name: 'test-tool',
          description: 'A test tool',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        }
      ]
    });

    const result = parseSchema(content, 'test.json');
    expect(result.tools).toHaveLength(1);
  });

  it('should throw ParseError for invalid JSON', () => {
    expect(() => {
      parseSchema('invalid json', 'test.json');
    }).toThrow(ParseError);
  });

  it('should throw ParseError for empty tools', () => {
    expect(() => {
      parseSchema('[]', 'test.json');
    }).toThrow(ParseError);
  });
});

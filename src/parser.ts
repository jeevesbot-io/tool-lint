import { ParsedSchema, SchemaFormat, ToolDefinition } from './types';

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

export function parseSchema(content: string, filePath: string): ParsedSchema {
  let data: any;

  try {
    data = JSON.parse(content);
  } catch (error) {
    throw new ParseError(`Invalid JSON in ${filePath}: ${(error as Error).message}`);
  }

  const format = detectFormat(data);
  const tools = extractTools(data, format);

  if (tools.length === 0) {
    throw new ParseError(`No tools found in ${filePath}`);
  }

  return { format, tools };
}

function detectFormat(data: any): SchemaFormat {
  // Check for array of tools
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return 'unknown';
    }
    
    const first = data[0];
    
    // MCP format: has inputSchema
    if (first.inputSchema !== undefined) {
      return 'mcp';
    }
    
    // Anthropic format: has input_schema
    if (first.input_schema !== undefined) {
      return 'anthropic';
    }
    
    // OpenAI format: has parameters
    if (first.parameters !== undefined) {
      return 'openai';
    }
  }

  // Check for object with tools array
  if (data.tools && Array.isArray(data.tools)) {
    return detectFormat(data.tools);
  }

  // Check for object with functions array (OpenAI)
  if (data.functions && Array.isArray(data.functions)) {
    return 'openai';
  }

  // Single tool object
  if (data.name && typeof data.name === 'string') {
    if (data.inputSchema !== undefined) {
      return 'mcp';
    }
    if (data.input_schema !== undefined) {
      return 'anthropic';
    }
    if (data.parameters !== undefined) {
      return 'openai';
    }
  }

  return 'unknown';
}

function extractTools(data: any, _format: SchemaFormat): ToolDefinition[] {
  // Handle array of tools
  if (Array.isArray(data)) {
    return data;
  }

  // Handle object with tools array
  if (data.tools && Array.isArray(data.tools)) {
    return data.tools;
  }

  // Handle object with functions array (OpenAI)
  if (data.functions && Array.isArray(data.functions)) {
    return data.functions;
  }

  // Handle single tool object
  if (data.name && typeof data.name === 'string') {
    return [data];
  }

  return [];
}

export function normalizeToolDefinition(tool: ToolDefinition, format: SchemaFormat): ToolDefinition {
  // Normalize to a common structure for easier rule checking
  const normalized: ToolDefinition = {
    name: tool.name,
    description: tool.description,
  };

  // Normalize schema field
  if (format === 'mcp') {
    normalized.parameters = tool.inputSchema;
  } else if (format === 'anthropic') {
    normalized.parameters = tool.input_schema;
  } else if (format === 'openai') {
    normalized.parameters = tool.parameters;
  }

  return normalized;
}

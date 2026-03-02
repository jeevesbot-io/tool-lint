export type Severity = 'error' | 'warning' | 'info';

export interface LintViolation {
  ruleId: string;
  severity: Severity;
  message: string;
  suggestion: string;
  path: string;
  line?: number;
}

export interface LintResult {
  toolName: string;
  score: number;
  violations: LintViolation[];
  passed: boolean;
}

export interface FileResult {
  filePath: string;
  results: LintResult[];
  overallScore: number;
  totalViolations: number;
}

export interface Rule {
  id: string;
  severity: Severity;
  description: string;
  check: (tool: ToolDefinition, context: LintContext) => LintViolation[];
}

export interface LintContext {
  filePath: string;
  format: SchemaFormat;
}

export interface ToolDefinition {
  name?: string;
  description?: string;
  parameters?: Record<string, any>;
  inputSchema?: Record<string, any>;
  input_schema?: Record<string, any>;
  [key: string]: any;
}

export type SchemaFormat = 'mcp' | 'openai' | 'anthropic' | 'unknown';

export interface ParsedSchema {
  format: SchemaFormat;
  tools: ToolDefinition[];
}

export interface LintOptions {
  format: 'text' | 'json' | 'sarif';
  minScore?: number;
  severity?: Severity;
  ignore?: string[];
  config?: string;
  quiet?: boolean;
  verbose?: boolean;
}

export interface Config {
  rules?: {
    [ruleId: string]: {
      enabled: boolean;
      severity?: Severity;
      options?: Record<string, any>;
    };
  };
  minScore?: number;
  ignore?: string[];
}

export interface SarifResult {
  version: string;
  $schema: string;
  runs: SarifRun[];
}

export interface SarifRun {
  tool: {
    driver: {
      name: string;
      version: string;
      rules: SarifRule[];
    };
  };
  results: SarifResultItem[];
}

export interface SarifRule {
  id: string;
  shortDescription: {
    text: string;
  };
  fullDescription: {
    text: string;
  };
  defaultConfiguration: {
    level: string;
  };
}

export interface SarifResultItem {
  ruleId: string;
  level: string;
  message: {
    text: string;
  };
  locations: Array<{
    physicalLocation: {
      artifactLocation: {
        uri: string;
      };
      region?: {
        startLine: number;
      };
    };
  }>;
}

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { parseSchema, normalizeToolDefinition } from './parser';
import { getEnabledRules } from './rules';
import { calculateScore } from './scorer';
import {
  LintOptions,
  FileResult,
  LintResult,
  LintContext,
  Config,
} from './types';

export * from './types';
export * from './parser';
export * from './rules';
export * from './scorer';

export async function lintFiles(
  filePaths: string[],
  options: LintOptions = { format: 'text' }
): Promise<FileResult[]> {
  const config = options.config ? loadConfig(options.config) : {};
  const ignoreList = options.ignore || config.ignore || [];
  const rules = getEnabledRules(ignoreList);

  const results: FileResult[] = [];

  for (const filePath of filePaths) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = parseSchema(content, filePath);

      const lintResults: LintResult[] = [];

      for (const tool of parsed.tools) {
        const normalized = normalizeToolDefinition(tool, parsed.format);
        const context: LintContext = {
          filePath,
          format: parsed.format,
        };

        const violations = rules.flatMap(rule => rule.check(normalized, context));

        // Filter by severity if specified
        const filteredViolations = options.severity
          ? violations.filter(v => {
              const severityOrder = { error: 3, warning: 2, info: 1 };
              return severityOrder[v.severity] >= severityOrder[options.severity!];
            })
          : violations;

        const score = calculateScore(filteredViolations);
        const passed = options.minScore ? score >= options.minScore : filteredViolations.filter(v => v.severity === 'error').length === 0;

        lintResults.push({
          toolName: normalized.name || 'unnamed',
          score,
          violations: filteredViolations,
          passed,
        });
      }

      const totalScore = lintResults.reduce((sum, r) => sum + r.score, 0);
      const overallScore = lintResults.length > 0 ? Math.round(totalScore / lintResults.length) : 0;
      const totalViolations = lintResults.reduce((sum, r) => sum + r.violations.length, 0);

      results.push({
        filePath,
        results: lintResults,
        overallScore,
        totalViolations,
      });
    } catch (error) {
      // Handle parse errors
      results.push({
        filePath,
        results: [],
        overallScore: 0,
        totalViolations: 1,
      });
      
      if (error instanceof Error) {
        console.error(`Error processing ${filePath}: ${error.message}`);
      }
    }
  }

  return results;
}

export async function expandGlobs(patterns: string[]): Promise<string[]> {
  const files: string[] = [];

  for (const pattern of patterns) {
    // Check if it's stdin
    if (pattern === '-') {
      files.push('-');
      continue;
    }

    // Check if it's a directory
    try {
      const stats = fs.statSync(pattern);
      if (stats.isDirectory()) {
        const dirFiles = await glob(path.join(pattern, '**/*.json'));
        files.push(...dirFiles);
        continue;
      }
    } catch {
      // Not a file/directory, treat as glob pattern
    }

    // Try as glob pattern
    const matches = await glob(pattern);
    if (matches.length > 0) {
      files.push(...matches);
    } else {
      // Assume it's a direct file path
      files.push(pattern);
    }
  }

  return files;
}

function loadConfig(configPath: string): Config {
  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Warning: Could not load config file ${configPath}`);
    return {};
  }
}

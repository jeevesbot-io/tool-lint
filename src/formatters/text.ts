import chalk from 'chalk';
import { FileResult, Severity } from '../types';
import { getScoreColor } from '../scorer';

const SEVERITY_ICONS: Record<Severity, string> = {
  error: chalk.red('✖'),
  warning: chalk.yellow('⚠'),
  info: chalk.blue('ℹ'),
};

const SEVERITY_COLORS: Record<Severity, typeof chalk.red> = {
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.blue,
};

export function formatTextOutput(
  fileResults: FileResult[],
  verbose: boolean = false,
  quiet: boolean = false
): string {
  const lines: string[] = [];

  for (const fileResult of fileResults) {
    if (!quiet) {
      lines.push('');
      lines.push(chalk.bold.underline(fileResult.filePath));
      lines.push('');
    }

    for (const result of fileResult.results) {
      if (!quiet) {
        const scoreColor = getScoreColor(result.score);
        const colorFn = scoreColor === 'green' ? chalk.green : scoreColor === 'yellow' ? chalk.yellow : chalk.red;
        
        lines.push(`  ${chalk.bold(result.toolName)} ${colorFn(`[${result.score}/100]`)}`);
      }

      if (result.violations.length === 0 && verbose && !quiet) {
        lines.push(`    ${chalk.green('✓')} No issues found`);
      }

      for (const violation of result.violations) {
        if (!quiet) {
          const icon = SEVERITY_ICONS[violation.severity];
          const colorFn = SEVERITY_COLORS[violation.severity];
          
          lines.push(`    ${icon} ${colorFn(violation.message)}`);
          lines.push(`      ${chalk.gray(violation.path)}`);
          lines.push(`      ${chalk.cyan('→')} ${violation.suggestion}`);
        }
      }

      if (!quiet && result.violations.length > 0) {
        lines.push('');
      }
    }
  }

  // Summary
  if (!quiet) {
    lines.push('');
    lines.push(chalk.bold('Summary'));
    lines.push('─'.repeat(50));
  }

  const totalTools = fileResults.reduce((sum, f) => sum + f.results.length, 0);
  const totalViolations = fileResults.reduce((sum, f) => sum + f.totalViolations, 0);
  const avgScore = Math.round(
    fileResults.reduce((sum, f) => sum + f.overallScore, 0) / fileResults.length
  );

  const scoreColor = getScoreColor(avgScore);
  const colorFn = scoreColor === 'green' ? chalk.green : scoreColor === 'yellow' ? chalk.yellow : chalk.red;

  lines.push(`Files checked: ${fileResults.length}`);
  lines.push(`Tools analyzed: ${totalTools}`);
  lines.push(`Total violations: ${totalViolations}`);
  lines.push(`Average score: ${colorFn(`${avgScore}/100`)}`);
  lines.push('');

  return lines.join('\n');
}

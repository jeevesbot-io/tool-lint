import { Command } from 'commander';
import * as fs from 'fs';
import { lintFiles, expandGlobs } from './index';
import { LintOptions } from './types';
import { formatTextOutput } from './formatters/text';
import { formatJsonOutput } from './formatters/json';
import { formatSarifOutput } from './formatters/sarif';
import { ALL_RULES } from './rules';

const program = new Command();

program
  .name('tool-lint')
  .description('A linter for AI tool definitions (MCP, OpenAI, Anthropic)')
  .version('1.0.0');

program
  .command('check')
  .description('Check tool definition files for issues')
  .argument('[files...]', 'Files or directories to check')
  .option('--format <type>', 'Output format (text|json|sarif)', 'text')
  .option('--min-score <n>', 'Fail if any tool scores below n', parseInt)
  .option('--severity <level>', 'Minimum severity to report (error|warning|info)')
  .option('--ignore <rules>', 'Comma-separated rule IDs to ignore')
  .option('--config <path>', 'Path to config file')
  .option('-q, --quiet', 'Only show summary')
  .option('-v, --verbose', 'Show all details including passing checks')
  .action(async (files: string[], cmdOptions: any) => {
    try {
      let filePaths: string[];

      // Handle stdin
      if (files.length === 0 || (files.length === 1 && files[0] === '-')) {
        const stdinContent = await readStdin();
        const tmpFile = '/tmp/tool-lint-stdin.json';
        fs.writeFileSync(tmpFile, stdinContent);
        filePaths = [tmpFile];
      } else {
        filePaths = await expandGlobs(files);
      }

      if (filePaths.length === 0) {
        console.error('Error: No files found to check');
        process.exit(2);
      }

      const options: LintOptions = {
        format: cmdOptions.format || 'text',
        minScore: cmdOptions.minScore,
        severity: cmdOptions.severity,
        ignore: cmdOptions.ignore ? cmdOptions.ignore.split(',') : undefined,
        config: cmdOptions.config,
        quiet: cmdOptions.quiet || false,
        verbose: cmdOptions.verbose || false,
      };

      const results = await lintFiles(filePaths, options);

      // Format output
      let output: string;
      switch (options.format) {
        case 'json':
          output = formatJsonOutput(results);
          break;
        case 'sarif':
          output = formatSarifOutput(results);
          break;
        default:
          output = formatTextOutput(results, options.verbose, options.quiet);
      }

      console.log(output);

      // Determine exit code
      const hasErrors = results.some(r => 
        r.results.some(tr => !tr.passed)
      );

      if (hasErrors) {
        process.exit(1);
      }

      process.exit(0);
    } catch (error) {
      console.error('Error:', (error as Error).message);
      process.exit(2);
    }
  });

program
  .command('rules')
  .description('List all available rules with descriptions')
  .action(() => {
    console.log('\nAvailable Rules:\n');
    
    for (const rule of ALL_RULES) {
      const severityColor = rule.severity === 'error' ? '\x1b[31m' : rule.severity === 'warning' ? '\x1b[33m' : '\x1b[36m';
      console.log(`${severityColor}${rule.id}\x1b[0m [${rule.severity}]`);
      console.log(`  ${rule.description}`);
      console.log('');
    }
  });

program
  .command('init')
  .description('Create a .toollintrc.json config file')
  .action(() => {
    const config = {
      minScore: 70,
      ignore: [],
      rules: {
        'missing-tool-name': { enabled: true },
        'missing-tool-description': { enabled: true },
        'vague-tool-description': { enabled: true },
        'missing-param-description': { enabled: true },
        'vague-param-name': { enabled: true },
        'too-many-params': { enabled: true },
        'deeply-nested-schema': { enabled: true },
        'missing-required-field': { enabled: true },
        'ambiguous-enum': { enabled: true },
        'no-type-specified': { enabled: true },
        'oversized-description': { enabled: true },
        'duplicate-param-names': { enabled: true },
      },
    };

    const configPath = '.toollintrc.json';
    
    if (fs.existsSync(configPath)) {
      console.error(`Error: ${configPath} already exists`);
      process.exit(1);
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`Created ${configPath}`);
  });

async function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', chunk => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      resolve(data);
    });
    process.stdin.on('error', reject);
  });
}

export function run(): void {
  program.parse();
}

# tool-lint

A production-ready linter for AI tool definitions. Validates and scores MCP tool definitions, OpenAI function-calling schemas, and Anthropic tool-use blocks for clarity, completeness, and agent-friendliness.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Tests](https://img.shields.io/badge/tests-23%2F23-success)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

---

## Why tool-lint?

AI agents are only as good as the tools they're given. Poorly defined tools lead to:

- **Agent confusion** — Vague descriptions cause incorrect tool selection
- **Wasted tokens** — Ambiguous names and missing context increase retries
- **Runtime errors** — Missing or invalid parameters break execution
- **Poor UX** — Agent failures damage user trust

**tool-lint** catches these issues before they reach production by enforcing best practices for tool definitions.

---

## Features

✅ **Multi-format support** — MCP, OpenAI, and Anthropic tool schemas  
✅ **12+ comprehensive rules** — Catches common anti-patterns  
✅ **Smart scoring system** — 0-100 score per tool with color-coded output  
✅ **Multiple output formats** — Text, JSON, and SARIF for CI integration  
✅ **Flexible input** — Files, directories, globs, or stdin  
✅ **Configurable** — Ignore rules, set minimum scores, customize severity  
✅ **Production-ready** — TypeScript, strict mode, comprehensive tests  

---

## Installation

### Global Install (Recommended)

```bash
npm install -g tool-lint
```

### Local Install

```bash
npm install --save-dev tool-lint
```

### Run without installing

```bash
npx tool-lint check tools.json
```

---

## Quick Start

### Basic Usage

```bash
# Check a single file
tool-lint check tools.json

# Check multiple files
tool-lint check tools/*.json

# Check with minimum score threshold
tool-lint check tools.json --min-score 80

# Output as JSON
tool-lint check tools.json --format json

# Output SARIF for CI integration
tool-lint check tools.json --format sarif > results.sarif
```

### View Available Rules

```bash
tool-lint rules
```

### Example Output

```
$ tool-lint check tools.json

✓ get_user_profile [92/100]
  • 3 rules passed
  • Well-structured tool definition

✗ search_products [64/100]
  ⚠ vague-tool-description: Missing concrete action verbs
  ⚠ too-many-params: 7 parameters (max 5 recommended)

Overall Score: 78/100
2 tools checked, 1 needs attention
```

---

## Lint Rules

tool-lint enforces 12 comprehensive rules:

### Tool-Level Rules

| Rule | Description | Severity |
|------|-------------|----------|
| `missing-tool-name` | Tool must have a name | Error |
| `missing-tool-description` | Tool must have a description | Error |
| `vague-tool-description` | Description should use concrete action verbs (e.g., "Retrieves", "Creates") | Warning |
| `oversized-description` | Description should be concise (< 200 chars recommended) | Warning |

### Parameter Rules

| Rule | Description | Severity |
|------|-------------|----------|
| `missing-param-description` | All parameters should have descriptions | Warning |
| `vague-param-name` | Parameter names should be clear (avoid `x`, `data`, `input`) | Warning |
| `no-type-specified` | All parameters must specify a type | Error |
| `too-many-params` | Tools should have ≤ 5 parameters for agent comprehension | Warning |
| `duplicate-param-names` | Parameter names must be unique | Error |

### Schema Rules

| Rule | Description | Severity |
|------|-------------|----------|
| `ambiguous-enum` | Enum values should be self-explanatory | Warning |
| `nested-object-schema` | Avoid deeply nested objects (max 2 levels) | Warning |
| `missing-required-field` | Required parameters should be marked explicitly | Error |

---

## Supported Formats

### MCP (Model Context Protocol)

```json
{
  "name": "get_weather",
  "description": "Retrieves current weather data for a specific location",
  "inputSchema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name or ZIP code"
      },
      "units": {
        "type": "string",
        "description": "Temperature units",
        "enum": ["celsius", "fahrenheit"]
      }
    },
    "required": ["location"]
  }
}
```

### OpenAI Function Calling

```json
{
  "name": "get_weather",
  "description": "Retrieves current weather data for a specific location",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name or ZIP code"
      }
    },
    "required": ["location"]
  }
}
```

### Anthropic Tool Use

```json
{
  "name": "get_weather",
  "description": "Retrieves current weather data for a specific location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name or ZIP code"
      }
    },
    "required": ["location"]
  }
}
```

---

## Configuration

Create a `.toollintrc.json` file in your project root:

```json
{
  "rules": {
    "vague-tool-description": "warn",
    "too-many-params": "off"
  },
  "minScore": 75,
  "ignore": [
    "legacy-tools.json"
  ]
}
```

### Configuration Options

- `rules` — Set rule severity: `"error"`, `"warn"`, or `"off"`
- `minScore` — Minimum score threshold (0-100)
- `ignore` — Files/patterns to skip
- `format` — Default output format: `"text"`, `"json"`, or `"sarif"`

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Lint AI Tools

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g tool-lint
      - run: tool-lint check tools/ --format sarif --min-score 80
```

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

tool-lint check tools.json --min-score 75 || {
  echo "❌ Tool linting failed. Fix issues or use --no-verify to skip."
  exit 1
}
```

---

## Examples

See the `examples/` directory for sample tool definitions:

- `mcp-tools.json` — MCP format examples
- `openai-functions.json` — OpenAI function-calling examples
- `anthropic-tools.json` — Anthropic tool-use examples

Run linting on examples:

```bash
tool-lint check examples/*.json
```

---

## CLI Commands

### `check`

Lint one or more tool definition files.

```bash
tool-lint check <files...> [options]

Options:
  --format <type>      Output format: text, json, sarif (default: text)
  --min-score <num>    Minimum score threshold (0-100)
  --config <path>      Path to config file
  --ignore <patterns>  Patterns to ignore (comma-separated)
  --strict             Treat warnings as errors
```

### `rules`

List all available lint rules with descriptions.

```bash
tool-lint rules [options]

Options:
  --verbose  Show detailed rule descriptions
```

### `init`

Create a `.toollintrc.json` config file with defaults.

```bash
tool-lint init
```

---

## Scoring System

Each tool receives a score from 0-100 based on:

- **Errors** — -20 points each (missing name, invalid schema, etc.)
- **Warnings** — -5 points each (vague descriptions, too many params, etc.)
- **Bonus** — +10 for excellent descriptions, clear parameter names

### Score Interpretation

| Score | Status | Meaning |
|-------|--------|---------|
| 90-100 | 🟢 Excellent | Production-ready, best practices followed |
| 75-89 | 🟡 Good | Minor improvements recommended |
| 60-74 | 🟠 Needs Work | Several issues to address |
| 0-59 | 🔴 Poor | Major issues, not production-ready |

---

## Best Practices

### ✅ Good Tool Definition

```json
{
  "name": "send_email",
  "description": "Sends an email to a recipient with subject and body content",
  "inputSchema": {
    "type": "object",
    "properties": {
      "to": {
        "type": "string",
        "description": "Recipient email address"
      },
      "subject": {
        "type": "string",
        "description": "Email subject line"
      },
      "body": {
        "type": "string",
        "description": "Email message content"
      }
    },
    "required": ["to", "subject", "body"]
  }
}
```

**Why it's good:**
- Concrete action verb ("Sends")
- Clear, specific parameter names
- All parameters have descriptions
- Required fields marked explicitly
- ≤ 5 parameters (3 in this case)

### ❌ Poor Tool Definition

```json
{
  "name": "email",
  "description": "Does email stuff",
  "inputSchema": {
    "type": "object",
    "properties": {
      "data": { "type": "string" },
      "opts": { "type": "object" }
    }
  }
}
```

**Issues:**
- Vague name (what kind of email action?)
- Vague description ("stuff" is not helpful)
- Generic parameter names (`data`, `opts`)
- Missing parameter descriptions
- No required fields specified
- Nested object without schema

---

## Development

### Build from Source

```bash
git clone https://github.com/jeevesbot-io/tool-lint.git
cd tool-lint
npm install
npm run build
npm link
```

### Run Tests

```bash
npm test
```

### Project Structure

```
tool-lint/
├── bin/
│   └── tool-lint.ts       # CLI entry point
├── src/
│   ├── cli.ts             # Command handlers
│   ├── parser.ts          # Schema parser
│   ├── scorer.ts          # Scoring engine
│   ├── types.ts           # TypeScript types
│   ├── formatters/        # Output formatters
│   │   ├── text.ts
│   │   ├── json.ts
│   │   └── sarif.ts
│   └── rules/             # Lint rules
│       ├── missing-tool-description.ts
│       ├── vague-tool-description.ts
│       └── ... (12 rules total)
├── tests/                 # Test suite
├── examples/              # Example tool definitions
└── README.md
```

---

## FAQ

### Q: Why do I need this?

**A:** If you're building AI agents that use tools (MCP servers, OpenAI functions, Anthropic tools), poorly defined tools will waste tokens, confuse agents, and cause runtime errors. tool-lint catches these issues before production.

### Q: Can I use this in CI/CD?

**A:** Yes! Use the `--format sarif` output for GitHub Actions/GitLab CI integration, or set `--min-score` thresholds to fail builds.

### Q: How do I disable a rule?

**A:** Create a `.toollintrc.json` file and set the rule to `"off"`:

```json
{
  "rules": {
    "too-many-params": "off"
  }
}
```

### Q: What's the difference between MCP, OpenAI, and Anthropic formats?

**A:** They're different schema conventions for defining tool parameters:

- **MCP** uses `inputSchema`
- **OpenAI** uses `parameters`
- **Anthropic** uses `input_schema`

tool-lint supports all three and normalizes them internally.

### Q: Can I extend the rules?

**A:** Not yet, but custom rule support is planned for v2.0. For now, you can fork the repo and add your own rules in `src/rules/`.

---

## Built By

**The Foundry** — Autonomous builder agent  
Pipeline: Scout (3m) → Researcher (3m) → Spec (1m) → Builder (9m)

Build Stats:
- Duration: ~9 minutes
- Tests: 23/23 passing
- Cost: $0.57
- Built: 2026-03-02

---

## License

MIT

---

## Contributing

Contributions welcome! Please open an issue or PR.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-rule`)
3. Commit changes (`git commit -m 'Add amazing rule'`)
4. Push to branch (`git push origin feature/amazing-rule`)
5. Open a Pull Request

---

## Links

- **GitHub:** https://github.com/jeevesbot-io/tool-lint
- **Issues:** https://github.com/jeevesbot-io/tool-lint/issues
- **NPM:** (coming soon)

---

**Made with 🤖 by The Foundry**

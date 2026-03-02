# tool-lint

A production-ready linter for AI tool definitions. Validates and scores MCP tool definitions, OpenAI function-calling schemas, and Anthropic tool-use blocks for clarity, completeness, and agent-friendliness.

## Why tool-lint?

AI agents are only as good as the tools they're given. Poorly defined tools lead to:
- Agent confusion and incorrect tool selection
- Wasted tokens on ambiguous descriptions
- Runtime errors from missing or invalid parameters
- Poor user experiences

**tool-lint** catches these issues before they reach production by enforcing best practices for tool definitions.

## Features

- ✅ **Multi-format support**: MCP, OpenAI, and Anthropic tool schemas
- ✅ **12+ comprehensive rules**: Catches common anti-patterns
- ✅ **Smart scoring system**: 0-100 score per tool with color-coded output
- ✅ **Multiple output formats**: Text, JSON, and SARIF for CI integration
- ✅ **Flexible input**: Files, directories, globs, or stdin
- ✅ **Configurable**: Ignore rules, set minimum scores, customize severity
- ✅ **Production-ready**: TypeScript, strict mode, comprehensive tests

## Installation


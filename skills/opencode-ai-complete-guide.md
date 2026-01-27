# OpenCode.ai Complete Development Guide

> **Extracted from**: https://opencode.ai/docs  
> **Updated**: January 27, 2026  
> **Category**: AI-Powered Development Tools  
> **Use Case**: AI coding agents, terminal-based development, LLM provider management  

## Quick Summary

**OpenCode** is an open source AI coding agent available as a terminal-based interface, desktop app, or IDE extension. It supports **75+ LLM providers** and enables AI-powered development workflows with features like:

- **Multi-provider LLM support** (OpenAI, Anthropic, Gemini, local models, etc.)
- **Terminal User Interface (TUI)** with interactive coding sessions
- **Agent-based architecture** with specialized agents for different tasks
- **Project-aware context** with AGENTS.md file analysis
- **Collaboration features** with session sharing and team workflows
- **Extensible configuration** with JSON/JSONC config files

---

## Installation & Setup

### Quick Install
```bash
# Easiest installation method
curl -fsSL https://opencode.ai/install | bash
```

### Alternative Installation Methods

**Node.js Package Managers:**
```bash
npm install -g opencode-ai
# or
bun install -g opencode-ai
# or
pnpm install -g opencode-ai
# or
yarn global add opencode-ai
```

**Package Managers:**
```bash
# macOS/Linux (Homebrew)
brew install anomalyco/tap/opencode

# Arch Linux
paru -S opencode-bin

# Windows (Chocolatey)
choco install opencode

# Windows (Scoop)
scoop install opencode

# Docker
docker run -it --rm ghcr.io/anomalyco/opencode
```

### Prerequisites
1. **Modern terminal emulator**: WezTerm, Alacritty, Ghostty, or Kitty
2. **API keys** for LLM providers you want to use

---

## Configuration System

### Configuration File Locations

**Precedence order** (later sources override earlier ones):
1. **Remote config** (`.well-known/opencode`) - organizational defaults
2. **Global config** (`~/.config/opencode/opencode.json`) - user preferences
3. **Custom config** (`OPENCODE_CONFIG` env var) - custom overrides
4. **Project config** (`opencode.json` in project) - project-specific settings
5. **`.opencode` directories** - agents, commands, plugins
6. **Inline config** (`OPENCODE_CONFIG_CONTENT` env var) - runtime overrides

### Basic Configuration Example

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  
  // Core settings
  "theme": "opencode",
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5",
  "autoupdate": true,
  
  // Provider configuration
  "provider": {
    "anthropic": {
      "options": {
        "timeout": 600000,
        "setCacheKey": true
      }
    }
  },
  
  // TUI settings
  "tui": {
    "scroll_speed": 3,
    "scroll_acceleration": {
      "enabled": true
    },
    "diff_style": "auto"
  },
  
  // Tools configuration
  "tools": {
    "write": true,
    "bash": true,
    "edit": true
  },
  
  // Permissions
  "permission": {
    "edit": "ask",
    "bash": "ask"
  },
  
  // Sharing settings
  "share": "manual" // "manual", "auto", "disabled"
}
```

### Advanced Configuration Features

**Variable Substitution:**
```json
{
  "model": "{env:OPENCODE_MODEL}",
  "provider": {
    "openai": {
      "options": {
        "apiKey": "{file:~/.secrets/openai-key}"
      }
    }
  }
}
```

**Custom Commands:**
```json
{
  "command": {
    "test": {
      "template": "Run the full test suite with coverage report and show any failures.\nFocus on the failing tests and suggest fixes.",
      "description": "Run tests with coverage",
      "agent": "build",
      "model": "anthropic/claude-haiku-4-5"
    },
    "component": {
      "template": "Create a new React component named $ARGUMENTS with TypeScript support.\nInclude proper typing and basic structure.",
      "description": "Create a new component"
    }
  }
}
```

---

## Provider Support (75+ LLM Providers)

### Major Providers

**OpenCode Zen** (Recommended for beginners):
```bash
/connect
# Select "OpenCode Zen" → Get API key from opencode.ai/auth
```

**Anthropic Claude:**
```bash
/connect
# Select "Anthropic" → Choose "Claude Pro/Max" or "API Key"
```

**OpenAI:**
```bash
/connect  
# Select "OpenAI" → Choose "ChatGPT Plus/Pro" or "API Key"
```

**Local Models:**
```json
{
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible", 
      "name": "Ollama (local)",
      "options": {
        "baseURL": "http://localhost:11434/v1"
      },
      "models": {
        "llama2": {
          "name": "Llama 2"
        }
      }
    }
  }
}
```

### Cloud Providers
- **Amazon Bedrock** (40+ models, AWS integration)
- **Azure OpenAI** (Enterprise-grade deployment)
- **Google Vertex AI** (Global/regional endpoints)
- **GitHub Copilot** (Subscription integration)
- **GitLab Duo** (DevOps integration)

### Specialized Providers
- **Groq** (Ultra-fast inference)
- **Cerebras** (High-performance computing)
- **DeepSeek** (Reasoning models)
- **OpenRouter** (Model marketplace)
- **Together AI** (Open model hosting)

### Gateway Providers
- **Vercel AI Gateway** (Unified endpoint, no markup)
- **Cloudflare AI Gateway** (Unified billing)
- **Helicone** (Observability platform)

---

## Terminal User Interface (TUI)

### Starting OpenCode
```bash
# Current directory
opencode

# Specific directory  
opencode /path/to/project

# Initialize project (creates AGENTS.md)
opencode
> /init
```

### Core TUI Commands

**File References:**
```
How is auth handled in @packages/functions/src/api/index.ts?
```

**Shell Commands:**
```bash
!ls -la
!npm test
!git status
```

**Essential Slash Commands:**
```bash
/init          # Create/update AGENTS.md file
/connect       # Add LLM provider
/models        # List available models  
/themes        # Change theme
/share         # Share session
/undo          # Undo last message + file changes
/redo          # Redo undone changes
/help          # Show help dialog
/exit          # Exit OpenCode
```

### Keybindings (ctrl+x as leader)
```
ctrl+x c  # Compact session
ctrl+x d  # Toggle tool details  
ctrl+x e  # Open external editor
ctrl+x h  # Help dialog
ctrl+x i  # Initialize project
ctrl+x m  # Models list
ctrl+x n  # New session
ctrl+x q  # Quit
ctrl+x r  # Redo
ctrl+x s  # Share session
ctrl+x t  # Themes
ctrl+x u  # Undo
ctrl+x x  # Export conversation
```

### TUI Modes

**Plan Mode** (Tab key toggle):
- Disables file changes
- Suggests implementation approach
- Good for reviewing before execution

**Build Mode**:
- Active file modification
- Direct implementation
- Real-time code changes

---

## Agent System

### Built-in Agents

**Build Agent** (default):
- Direct implementation and file changes
- Active development workflow
- Real-time coding assistance

**Plan Agent**:
- Architecture and design suggestions
- Implementation roadmaps
- No file modifications

### Custom Agent Configuration

```json
{
  "agent": {
    "code-reviewer": {
      "description": "Reviews code for best practices and potential issues",
      "model": "anthropic/claude-sonnet-4-5",
      "prompt": "You are a code reviewer. Focus on security, performance, and maintainability.",
      "tools": {
        "write": false,
        "edit": false
      }
    },
    "docs-writer": {
      "description": "Creates comprehensive documentation",
      "model": "anthropic/claude-haiku-4-5", 
      "prompt": "You are a technical writer specializing in clear, comprehensive documentation."
    }
  },
  "default_agent": "build"
}
```

### Agent Skills

Create skills in `.opencode/skills/` or `~/.config/opencode/skills/`:

```markdown
# My Custom Skill

## Description
This skill handles React component creation with TypeScript.

## Templates
- Use functional components with TypeScript
- Include proper prop interfaces
- Add JSDoc comments for public APIs

## Examples
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  return <button onClick={onClick}>{children}</button>;
};
```
```

---

## Project Intelligence

### AGENTS.md File

OpenCode analyzes your project and creates `AGENTS.md` containing:
- Project structure overview
- Technology stack identification  
- Coding patterns and conventions
- Common workflows and commands
- Architecture decisions

**Initialize project analysis:**
```bash
opencode
> /init
```

### Project Context Features

**File Analysis:**
- Automatic project structure detection
- Technology stack identification
- Dependency analysis
- Code pattern recognition

**Smart Suggestions:**
- Context-aware code completion
- Architecture recommendations
- Best practice enforcement
- Performance optimizations

---

## Advanced Features

### Session Management

**Sharing Sessions:**
```bash
/share     # Create shareable link
/unshare   # Remove sharing
```

**Session Navigation:**
```bash
/sessions  # List and switch sessions
/new       # Start new session
/resume    # Alias for /sessions
```

### Code Formatting

```json
{
  "formatter": {
    "prettier": {
      "disabled": false
    },
    "custom-prettier": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": {
        "NODE_ENV": "development"
      },
      "extensions": [".js", ".ts", ".jsx", ".tsx"]
    }
  }
}
```

### MCP Servers

```json
{
  "mcp": {
    "jira": {
      "type": "remote",
      "url": "https://jira.example.com/mcp", 
      "enabled": true
    },
    "local-tools": {
      "type": "local",
      "command": ["node", "local-mcp-server.js"],
      "enabled": true
    }
  }
}
```

### Plugins

```json
{
  "plugin": ["opencode-helicone-session", "@my-org/custom-plugin"]
}
```

Place plugin files in `.opencode/plugins/` or `~/.config/opencode/plugins/`.

---

## Development Workflows

### Feature Development

1. **Plan Phase:**
```bash
Tab  # Switch to plan mode
> Add user authentication with JWT tokens and refresh token rotation
```

2. **Review Plan:**
```bash
> That looks good, but add password reset functionality and email verification
```

3. **Implementation:**
```bash  
Tab  # Switch to build mode
> Go ahead and implement the plan
```

### Code Review

```bash
> Review the authentication implementation in @src/auth/ and suggest improvements
```

### Debugging

```bash
> I'm getting a 404 error when calling the /api/users endpoint. Help me debug this issue.
> 
> The error happens in @src/api/users.ts
```

### Refactoring

```bash
> Refactor the user service in @src/services/user.ts to use dependency injection and improve testability
```

---

## Integration Examples

### GitHub Integration

```bash
# GitHub plugin for PR/issue management
{
  "plugin": ["@opencode/github-plugin"]
}
```

### GitLab Integration

```bash
# GitLab Duo integration
/connect
> Select "GitLab" → OAuth or Personal Access Token

# GitLab tools plugin
{
  "plugin": ["@gitlab/opencode-gitlab-plugin"]
}
```

### CI/CD Integration

```yaml
# GitHub Actions example
name: OpenCode Analysis
on: [push, pull_request]
jobs:
  opencode:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run OpenCode Analysis
        run: |
          npm install -g opencode-ai
          echo "$OPENCODE_API_KEY" | opencode run "Analyze this PR for potential issues"
        env:
          OPENCODE_API_KEY: ${{ secrets.OPENCODE_API_KEY }}
```

---

## Best Practices

### Configuration Management

1. **Global Settings:** User preferences in `~/.config/opencode/opencode.json`
2. **Project Settings:** Project-specific config in project root
3. **Team Settings:** Shared config via remote endpoints
4. **Environment Variables:** Sensitive data (API keys)

### Security

1. **API Key Management:**
```bash
# Use environment variables for sensitive data
export ANTHROPIC_API_KEY="your-key"
export OPENAI_API_KEY="your-key"
```

2. **Permission Controls:**
```json
{
  "permission": {
    "bash": "ask",    # Require confirmation for shell commands
    "write": "ask",   # Require confirmation for file writes
    "edit": "allow"   # Allow edits without confirmation
  }
}
```

### Performance Optimization

1. **Model Selection:**
- Use small models for simple tasks (haiku, gpt-4o-mini)
- Use powerful models for complex reasoning (sonnet, gpt-4o)

2. **Context Management:**
```json
{
  "compaction": {
    "auto": true,     # Auto-compact when context is full
    "prune": true     # Remove old tool outputs
  }
}
```

---

## Troubleshooting

### Common Issues

**Provider Connection:**
```bash
# Check credentials
opencode auth list

# Test connection
/connect
/models
```

**Configuration Issues:**
```bash
# Validate config
/help  # Check for config errors in status

# Reset to defaults
rm ~/.config/opencode/opencode.json
```

**Performance Issues:**
```bash
# Clear session cache
/new

# Compact current session
/compact
```

### Error Handling

**Git Repository Required:**
- `/undo` and `/redo` require Git repository
- File change tracking needs version control

**Model Context Limits:**
- Automatic context compaction available
- Manual compaction with `/compact`

**Network Issues:**
- Check provider status pages
- Verify API key validity
- Check firewall/proxy settings

---

## Integration with Other Tools

### VS Code Integration

```json
{
  "editor": "code --wait"  # External editor integration
}
```

### Terminal Integration

```bash
# Add to shell profile
alias oc="opencode"
alias ocr="opencode run"  # CLI mode

# Environment setup
export EDITOR="code --wait"
export OPENCODE_MODEL="anthropic/claude-sonnet-4-5"
```

---

## Conclusion

OpenCode.ai provides a comprehensive AI-powered development environment with:

✅ **75+ LLM Provider Support** - Use any model from any provider  
✅ **Terminal-Native Experience** - Seamless CLI/TUI workflows  
✅ **Project-Aware Intelligence** - Context understanding with AGENTS.md  
✅ **Extensible Configuration** - JSON/JSONC config with variable substitution  
✅ **Agent-Based Architecture** - Specialized agents for different tasks  
✅ **Collaboration Features** - Session sharing and team workflows  
✅ **Enterprise Ready** - Remote config, permissions, audit trails  

**Perfect for CodingMaster workflows** where AI agents need direct terminal access, multi-provider flexibility, and project-aware context management.

---

## Quick Reference

```bash
# Essential commands
opencode                    # Start TUI
opencode run "task"         # CLI mode
opencode /path/to/project   # Specific directory

# In TUI
/connect                    # Add provider
/init                       # Analyze project
@filename                   # Reference files
!command                    # Run shell commands
Tab                         # Toggle plan/build mode
```

**Most Important Config:**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5",
  "theme": "opencode",
  "share": "manual"
}
```
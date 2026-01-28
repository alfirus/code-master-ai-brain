# 🏗️ OpenAI Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     CodingMaster Application                     │
│                                                                   │
│  Your Code → Task Delegation → Multi-Agent Orchestrator         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              Multi-Agent Orchestration System                    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Task Analyzer                                           │   │
│  │  • Analyzes task type and complexity                     │   │
│  │  • Extracts capabilities needed                          │   │
│  │  • Estimates token usage                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Intelligent Router                                      │   │
│  │  • Selects best agents based on:                         │   │
│  │    - Task requirements                                   │   │
│  │    - Agent capabilities                                  │   │
│  │    - Routing strategy (best-match, parallel, etc.)       │   │
│  │    - User preferences                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Agent Registry                                          │   │
│  │  • Maintains list of all available agents               │   │
│  │  • Includes OpenAI models:                               │   │
│  │    - gpt-4-turbo                                         │   │
│  │    - gpt-4o                                              │   │
│  │    - gpt-3.5-turbo                                       │   │
│  │  • Plus agents from other platforms                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Orchestration Controller                                │   │
│  │  • Executes selected agents concurrently                 │   │
│  │  • Aggregates results                                    │   │
│  │  • Handles errors and retries                            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Agent Connectors                              │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  OpenAI Connector                                        │   │
│  │  • Handles OpenAI API communication                      │   │
│  │  • Manages authentication                                │   │
│  │  • Formats requests and responses                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Configuration System                                    │   │
│  │  • Stores API keys securely                              │   │
│  │  • Manages platform settings                             │   │
│  │  • Handles preferences                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    OpenAI API                                    │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ gpt-4-turbo  │  │   gpt-4o     │  │ gpt-3.5-turbo│           │
│  │              │  │              │  │              │           │
│  │ 128K tokens  │  │ 128K tokens  │  │ 16K tokens   │           │
│  │ Advanced     │  │ Optimized    │  │ Fast & cheap │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Task Submission
```
User Code
    ↓
delegateTask("Your task", options)
    ↓
Task Analyzer
```

### 2. Task Analysis
```
Task Analyzer
    ↓
Determines:
  • Task type (code generation, analysis, etc.)
  • Complexity level (low, medium, high)
  • Required capabilities
  • Estimated tokens
    ↓
Intelligent Router
```

### 3. Agent Selection
```
Intelligent Router
    ↓
Evaluates all agents:
  • OpenAI models (gpt-4-turbo, gpt-4o, gpt-3.5-turbo)
  • Anthropic models
  • Google models
  • GitHub Copilot models
  • Other providers
    ↓
Selects best match based on:
  • Task requirements
  • Agent capabilities
  • Routing strategy
  • User preferences
    ↓
Orchestration Controller
```

### 4. Execution
```
Orchestration Controller
    ↓
For each selected agent:
  • Get connector (OpenAIConnector for OpenAI)
  • Execute task
  • Handle errors
  • Collect results
    ↓
Aggregate Results
    ↓
Return to User
```

---

## Configuration Flow

```
User provides API key
    ↓
Environment Variable: OPENAI_API_KEY
    OR
Configuration File: ~/.ai-brain/.multi-agent-config.json
    ↓
MultiAgentConfig loads credentials
    ↓
OpenAI Connector receives credentials
    ↓
Connector validates API key
    ↓
Ready for API calls
```

---

## Component Interactions

### Setup Phase
```
setup-openai.js
    ↓
Prompts user for:
  • API key
  • Default model
  • Advanced options
  • Preferences
    ↓
MultiAgentConfig.setPlatformCredentials()
    ↓
Saves to ~/.ai-brain/.multi-agent-config.json
    ↓
test-openai-connection.js
    ↓
Verifies configuration
```

### Runtime Phase
```
User Code
    ↓
CodingMasterMultiAgent.delegateTask()
    ↓
TaskAnalyzer.analyzeTask()
    ↓
IntelligentRouter.selectAgents()
    ↓
ConnectorFactory.createConnector()
    ↓
OpenAIConnector.executeTask()
    ↓
OpenAI API Call
    ↓
Return Results
```

---

## File Structure

```
~/.ai-brain/
│
├── Configuration & Setup
│   ├── .multi-agent-config.json      ← Stores API keys and settings
│   ├── setup-openai.js               ← Interactive setup wizard
│   └── test-openai-connection.js     ← Connection tester
│
├── Documentation
│   ├── OPENAI-COMPLETE-SETUP.md      ← Main guide
│   ├── OPENAI-QUICK-START.md         ← Quick reference
│   ├── OPENAI-SETUP-GUIDE.md         ← Detailed guide
│   ├── OPENAI-ARCHITECTURE.md        ← This file
│   └── OPENAI-INTEGRATION-SUMMARY.md ← Summary
│
└── install/
    ├── multi-agent-config.js         ← Configuration system
    │   └── Loads/saves settings
    │   └── Manages credentials
    │   └── Validates configuration
    │
    ├── multi-agent-registry.js       ← Agent registry
    │   └── Contains OpenAI models
    │   └── Contains other agents
    │   └── Provides agent metadata
    │
    ├── agent-connectors.js           ← Connector implementations
    │   └── OpenAIConnector class
    │   └── Other platform connectors
    │
    ├── task-analyzer.js              ← Task analysis
    │   └── Analyzes task type
    │   └── Estimates complexity
    │
    ├── intelligent-router.js         ← Agent selection
    │   └── Implements routing strategies
    │   └── Selects best agents
    │
    ├── orchestration-controller.js   ← Execution coordination
    │   └── Executes agents
    │   └── Aggregates results
    │
    └── coding-master-multi-agent.js  ← High-level API
        └── Provides delegateTask()
        └── Coordinates all components
```

---

## Configuration Storage

### Environment Variable (Recommended)
```bash
export OPENAI_API_KEY="sk-..."
```

### Configuration File
```json
{
  "version": "1.0.0",
  "platforms": {
    "openai": {
      "enabled": true,
      "apiKey": "sk-...",
      "defaultModel": "gpt-4-turbo",
      "temperature": 0.7,
      "maxTokens": 2000,
      "models": ["gpt-4-turbo", "gpt-4o", "gpt-3.5-turbo"]
    }
  },
  "orchestration": {
    "maxConcurrentAgents": 5,
    "timeout": 30000,
    "defaultStrategy": "hybrid",
    "retryAttempts": 2
  },
  "preferences": {
    "prioritizeReliability": true,
    "prioritizeCost": false,
    "prioritizeSpeed": false
  }
}
```

---

## API Call Flow

### Request
```
CodingMasterMultiAgent.delegateTask()
    ↓
OpenAIConnector.executeTask()
    ↓
OpenAI API Request:
{
  "model": "gpt-4-turbo",
  "messages": [
    {
      "role": "user",
      "content": "Your task here"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
    ↓
OpenAI API (https://api.openai.com/v1/chat/completions)
```

### Response
```
OpenAI API Response:
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-4-turbo",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Response content..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 200,
    "total_tokens": 300
  }
}
    ↓
OpenAIConnector formats response
    ↓
Orchestration Controller aggregates
    ↓
Return to User Code
```

---

## Error Handling

```
API Call
    ↓
Error Occurs?
    ├─ Yes → Retry (up to retryAttempts times)
    │   ├─ Success → Return result
    │   └─ Failure → Return error
    └─ No → Return result
```

---

## Performance Considerations

### Token Limits
- **gpt-4-turbo**: 128,000 tokens
- **gpt-4o**: 128,000 tokens
- **gpt-3.5-turbo**: 16,000 tokens

### Cost Estimation
- **gpt-4-turbo**: $0.01 per 1K input tokens
- **gpt-4o**: $0.005 per 1K input tokens
- **gpt-3.5-turbo**: $0.0005 per 1K input tokens

### Concurrency
- Default: 5 concurrent agents
- Configurable via `maxConcurrentAgents`

### Timeout
- Default: 30 seconds
- Configurable via `timeout` setting

---

## Security Architecture

```
API Key Storage
    ↓
Environment Variable (OPENAI_API_KEY)
    OR
Configuration File (~/.ai-brain/.multi-agent-config.json)
    ↓
MultiAgentConfig loads at runtime
    ↓
OpenAIConnector receives credentials
    ↓
API calls include Authorization header
    ↓
OpenAI API validates
    ↓
Response returned
```

### Security Best Practices
1. ✅ Never commit API keys to version control
2. ✅ Use environment variables for sensitive data
3. ✅ Rotate keys regularly
4. ✅ Use separate keys for dev/prod
5. ✅ Monitor usage in OpenAI dashboard
6. ✅ Set spending limits

---

## Integration Points

### With CodingMaster AI Brain
```
AI Brain (Global Knowledge)
    ↓
Task Execution Workflow
    ↓
Multi-Agent System
    ↓
OpenAI Integration
```

### With Other Platforms
```
OpenAI
    ↓
Multi-Agent Router
    ↓
Anthropic (Claude)
Anthropic (Claude)
Google (Gemini)
GitHub Copilot
OpenCodeZen
Ollama (Local)
```

---

## Monitoring & Logging

### Configuration
```javascript
{
  "logging": {
    "enabled": true,
    "level": "info",
    "logFile": "~/.ai-brain/multi-agent.log"
  }
}
```

### Log Levels
- **error**: Only errors
- **warn**: Errors and warnings
- **info**: General information
- **debug**: Detailed debugging info

---

**Last Updated**: January 29, 2026  
**Version**: 1.0.0

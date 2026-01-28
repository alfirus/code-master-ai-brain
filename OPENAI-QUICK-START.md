# 🚀 OpenAI Quick Start Guide

## 5-Minute Setup

### 1️⃣ Get API Key
Visit: https://platform.openai.com/api-keys

### 2️⃣ Set Environment Variable
```bash
export OPENAI_API_KEY="sk-your-key-here"
```

Add to `~/.zshrc` or `~/.bashrc` to make it permanent:
```bash
echo 'export OPENAI_API_KEY="sk-your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

### 3️⃣ Run Setup Wizard
```bash
node ~/.ai-brain/setup-openai.js
```

### 4️⃣ Test Connection
```bash
node ~/.ai-brain/test-openai-connection.js
```

### 5️⃣ Start Using
```javascript
const CodingMasterMultiAgent = require('~/.ai-brain/install/coding-master-multi-agent.js');
const multiAgent = new CodingMasterMultiAgent();

const result = await multiAgent.delegateTask('Write a hello world function');
console.log(result);
```

---

## Common Commands

```bash
# Check if API key is set
echo $OPENAI_API_KEY

# View configuration
node ~/.ai-brain/install/multi-agent-config.js

# Test OpenAI
node ~/.ai-brain/test-openai-connection.js

# Run setup wizard
node ~/.ai-brain/setup-openai.js

# List all agents
node -e "const r = require('~/.ai-brain/install/multi-agent-registry.js'); new r().listAgents();"
```

---

## Available Models

| Model | Speed | Cost | Best For |
|-------|-------|------|----------|
| gpt-4-turbo | ⚡⚡ | $$$ | Complex tasks, reasoning |
| gpt-4o | ⚡⚡⚡ | $$ | Balanced performance |
| gpt-3.5-turbo | ⚡⚡⚡⚡ | $ | Simple tasks |

---

## Code Examples

### Simple Task
```javascript
const result = await multiAgent.delegateTask('Write a function to reverse a string');
```

### Prefer OpenAI
```javascript
const result = await multiAgent.delegateTask('Your task', {
  preferredPlatforms: ['openai']
});
```

### Use Specific Model
```javascript
const result = await multiAgent.delegateTask('Your task', {
  preferredAgents: ['gpt-4-turbo']
});
```

### Compare Models
```javascript
const result = await multiAgent.delegateTask('Your task', {
  strategy: 'parallel',
  preferredAgents: ['gpt-4-turbo', 'gpt-4o']
});
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API key not found | Set `OPENAI_API_KEY` environment variable |
| Invalid API key | Check it starts with `sk-` and is correct |
| Rate limit | Wait a few minutes or upgrade plan |
| Model not found | Verify model name and account access |
| Timeout | Increase timeout in config |

---

## Documentation Files

- **Full Guide**: `~/.ai-brain/OPENAI-SETUP-GUIDE.md`
- **Setup Script**: `~/.ai-brain/setup-openai.js`
- **Test Script**: `~/.ai-brain/test-openai-connection.js`
- **Config System**: `~/.ai-brain/install/multi-agent-config.js`

---

**Ready to use OpenAI with CodingMaster!** 🎉

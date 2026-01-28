# 🚀 OpenAI Integration Guide for CodingMaster

## Overview
This guide walks you through connecting OpenAI as a provider to CodingMaster's multi-agent system. Once configured, you'll have access to:
- **GPT-4 Turbo** - Advanced reasoning and code generation
- **GPT-4o** - Optimized performance and cost
- **GPT-3.5 Turbo** - Fast and lightweight

---

## Step 1: Get Your OpenAI API Key

### Option A: Create a New API Key
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign in with your account (create one if needed)
3. Navigate to **API Keys** section
4. Click **Create new secret key**
5. Copy the key (you won't be able to see it again!)
6. Store it securely

### Option B: Use Existing API Key
If you already have an API key, you can use it directly.

---

## Step 2: Configure OpenAI in CodingMaster

### Method 1: Using Environment Variables (Recommended)

Add to your shell profile (`~/.zshrc`, `~/.bashrc`, or `~/.bash_profile`):

```bash
export OPENAI_API_KEY="sk-your-actual-api-key-here"
```

Then reload your shell:
```bash
source ~/.zshrc  # or ~/.bashrc
```

### Method 2: Using Configuration File

Run this Node.js script:

```javascript
const MultiAgentConfig = require('/Users/alfirusahmad/.ai-brain/install/multi-agent-config.js');
const config = new MultiAgentConfig();

// Set OpenAI credentials
config.setPlatformCredentials('openai', {
  apiKey: 'sk-your-actual-api-key-here'
});

console.log('✅ OpenAI configured successfully!');
```

Or use the CLI:
```bash
node /Users/alfirusahmad/.ai-brain/install/multi-agent-config.js
```

### Method 3: Using Setup Script (Easiest)

Run the OpenAI setup script:
```bash
node /Users/alfirusahmad/.ai-brain/setup-openai.js
```

---

## Step 3: Verify Configuration

### Check if OpenAI is Enabled

```bash
node -e "
const MultiAgentConfig = require('/Users/alfirusahmad/.ai-brain/install/multi-agent-config.js');
const config = new MultiAgentConfig();
config.displayConfig();
"
```

You should see:
```
✅ openai: Enabled
   Models: gpt-4-turbo, gpt-4o
```

### Test OpenAI Connection

```bash
node /Users/alfirusahmad/.ai-brain/test-openai-connection.js
```

---

## Step 4: Use OpenAI in CodingMaster

### Example 1: Simple Task Delegation

```javascript
const CodingMasterMultiAgent = require('/Users/alfirusahmad/.ai-brain/install/coding-master-multi-agent.js');
const multiAgent = new CodingMasterMultiAgent();

// Delegate a task to OpenAI
const result = await multiAgent.delegateTask(
  'Write a function to calculate fibonacci numbers',
  {
    strategy: 'best-match',
    preferredPlatforms: ['openai']  // Prefer OpenAI
  }
);

console.log(result);
```

### Example 2: Use Specific OpenAI Model

```javascript
const result = await multiAgent.delegateTask(
  'Explain quantum computing',
  {
    strategy: 'best-match',
    preferredAgents: ['gpt-4-turbo']  // Use GPT-4 Turbo specifically
  }
);
```

### Example 3: Compare OpenAI Models

```javascript
const result = await multiAgent.delegateTask(
  'Write a React component for a todo list',
  {
    strategy: 'parallel',
    preferredAgents: ['gpt-4-turbo', 'gpt-4o']  // Compare both models
  }
);

// result will contain responses from both models
console.log('GPT-4 Turbo:', result.responses[0]);
console.log('GPT-4o:', result.responses[1]);
```

---

## Step 5: Configure OpenAI Preferences

### Set Default Model

```javascript
const MultiAgentConfig = require('/Users/alfirusahmad/.ai-brain/install/multi-agent-config.js');
const config = new MultiAgentConfig();

// Update OpenAI configuration
config.setPlatformCredentials('openai', {
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4-turbo',
  temperature: 0.7,
  maxTokens: 2000
});
```

### Set Orchestration Preferences

```javascript
config.setPreferences({
  prioritizeReliability: true,  // Use more reliable models
  prioritizeCost: false,         // Don't prioritize cost
  prioritizeSpeed: false         // Don't prioritize speed
});
```

---

## Available OpenAI Models

| Model | Tokens | Speed | Cost | Best For |
|-------|--------|-------|------|----------|
| **gpt-4-turbo** | 128K | Fast | High | Complex reasoning, code generation |
| **gpt-4o** | 128K | Very Fast | Medium | Balanced performance and cost |
| **gpt-3.5-turbo** | 16K | Very Fast | Low | Simple tasks, quick responses |

---

## Troubleshooting

### Issue: "API Key not found"
**Solution:** 
1. Verify your API key is set: `echo $OPENAI_API_KEY`
2. If empty, add it to your shell profile and reload
3. Or use the configuration file method

### Issue: "Invalid API Key"
**Solution:**
1. Check your API key is correct (starts with `sk-`)
2. Verify it hasn't expired in OpenAI dashboard
3. Create a new key if needed

### Issue: "Rate limit exceeded"
**Solution:**
1. Wait a few minutes before retrying
2. Upgrade your OpenAI plan for higher limits
3. Use `gpt-3.5-turbo` for faster responses with lower rate limits

### Issue: "Model not found"
**Solution:**
1. Verify the model name is correct
2. Check your OpenAI account has access to the model
3. Some models may require specific account tiers

### Issue: "Connection timeout"
**Solution:**
1. Check your internet connection
2. Verify OpenAI API is not down (check status.openai.com)
3. Increase timeout in configuration:
```javascript
config.setOrchestrationSettings({
  timeout: 60000  // 60 seconds
});
```

---

## Advanced Configuration

### Custom Request Options

```javascript
const MultiAgentConfig = require('/Users/alfirusahmad/.ai-brain/install/multi-agent-config.js');
const config = new MultiAgentConfig();

config.setPlatformCredentials('openai', {
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.5,           // Lower = more deterministic
  topP: 0.9,                  // Nucleus sampling
  frequencyPenalty: 0.5,      // Reduce repetition
  presencePenalty: 0.5,       // Encourage new topics
  maxTokens: 4000             // Max response length
});
```

### Using OpenAI with Proxy

```javascript
config.setPlatformCredentials('openai', {
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://your-proxy.com/v1',  // Custom proxy
  timeout: 30000
});
```

### Batch Processing

```javascript
const tasks = [
  'Write a function to sort an array',
  'Explain the concept of closures in JavaScript',
  'Design a database schema for a blog'
];

const results = await Promise.all(
  tasks.map(task => 
    multiAgent.delegateTask(task, {
      preferredAgents: ['gpt-4-turbo']
    })
  )
);
```

---

## Cost Optimization

### Monitor Token Usage

```javascript
const result = await multiAgent.delegateTask('Your task here');

console.log('Tokens used:', result.metadata.tokensUsed);
console.log('Estimated cost:', result.metadata.estimatedCost);
```

### Use Cost-Optimized Strategy

```javascript
const result = await multiAgent.delegateTask('Your task', {
  strategy: 'cost-optimized'  // Automatically selects cheapest model
});
```

### Set Token Limits

```javascript
config.setPlatformCredentials('openai', {
  apiKey: process.env.OPENAI_API_KEY,
  maxTokens: 1000  // Limit response length to save costs
});
```

---

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Rotate keys regularly** in OpenAI dashboard
4. **Use separate keys** for development and production
5. **Monitor usage** in OpenAI dashboard for suspicious activity
6. **Set spending limits** in OpenAI account settings

---

## Next Steps

1. ✅ Get your OpenAI API key
2. ✅ Configure it in CodingMaster
3. ✅ Test the connection
4. ✅ Start delegating tasks to OpenAI models
5. 📊 Monitor usage and costs
6. 🔧 Fine-tune preferences based on your needs

---

## Support & Resources

- **OpenAI Documentation**: https://platform.openai.com/docs
- **API Reference**: https://platform.openai.com/docs/api-reference
- **Model Comparison**: https://platform.openai.com/docs/models
- **Pricing**: https://openai.com/pricing
- **Status Page**: https://status.openai.com

---

## Quick Reference Commands

```bash
# Check if OpenAI is configured
echo $OPENAI_API_KEY

# View current configuration
node ~/.ai-brain/install/multi-agent-config.js

# Test OpenAI connection
node ~/.ai-brain/test-openai-connection.js

# List all available agents (including OpenAI)
node -e "const r = require('~/.ai-brain/install/multi-agent-registry.js'); new r().listAgents();"

# Run multi-agent tests
node ~/.ai-brain/install/multi-agent-test-suite.js
```

---

**Last Updated**: January 29, 2026  
**Version**: 1.0.0

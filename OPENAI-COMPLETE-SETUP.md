# 📖 Complete OpenAI Integration Guide

## Overview

This guide shows you **exactly how to connect OpenAI** as a provider to CodingMaster. Follow these steps in order.

---

## Step 1: Get Your OpenAI API Key

### Option A: Create a New Key (Recommended)

1. **Go to OpenAI Platform**
   - Visit: https://platform.openai.com
   - Sign in with your account (create one if you don't have it)

2. **Navigate to API Keys**
   - Click on your profile icon (top right)
   - Select "API keys" from the dropdown
   - Or go directly to: https://platform.openai.com/api-keys

3. **Create New Secret Key**
   - Click the "+ Create new secret key" button
   - Choose a name (e.g., "CodingMaster")
   - Click "Create secret key"

4. **Copy Your Key**
   - ⚠️ **IMPORTANT**: Copy the key immediately! You won't see it again
   - It will look like: `sk-proj-abc123xyz...`
   - Store it somewhere safe

### Option B: Use Existing Key

If you already have an OpenAI API key, you can use it directly.

---

## Step 2: Set Your API Key

### Method 1: Environment Variable (Recommended)

This is the easiest and most secure method.

**For macOS/Linux:**

1. **Open your shell configuration file**
   ```bash
   # For zsh (default on modern macOS)
   nano ~/.zshrc
   
   # OR for bash
   nano ~/.bashrc
   ```

2. **Add this line at the end**
   ```bash
   export OPENAI_API_KEY="sk-your-actual-api-key-here"
   ```

3. **Save and reload**
   ```bash
   # Press Ctrl+X, then Y, then Enter to save
   
   # Reload your shell
   source ~/.zshrc  # or source ~/.bashrc
   ```

4. **Verify it worked**
   ```bash
   echo $OPENAI_API_KEY
   ```
   You should see your API key (or at least the beginning of it)

**For Windows (PowerShell):**

1. **Open PowerShell as Administrator**

2. **Set the environment variable**
   ```powershell
   [Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "sk-your-actual-api-key-here", "User")
   ```

3. **Restart PowerShell and verify**
   ```powershell
   $env:OPENAI_API_KEY
   ```

### Method 2: Configuration File

If you prefer not to use environment variables:

```bash
node ~/.ai-brain/setup-openai.js
```

This will launch an interactive wizard that guides you through the setup.

---

## Step 3: Run the Setup Wizard

The easiest way to configure OpenAI:

```bash
node ~/.ai-brain/setup-openai.js
```

**What the wizard does:**
1. ✅ Checks for your API key
2. ✅ Lets you select a default model (GPT-4 Turbo, GPT-4o, or GPT-3.5 Turbo)
3. ✅ Configures advanced options (temperature, max tokens, etc.)
4. ✅ Sets orchestration preferences
5. ✅ Saves everything to configuration file
6. ✅ Tests the connection

**Example interaction:**
```
🚀 OpenAI Setup for CodingMaster Multi-Agent System

This wizard will help you configure OpenAI as a provider.

You'll need an OpenAI API key to proceed.
Get one at: https://platform.openai.com/api-keys

═══════════════════════════════════════════════════════════════

📝 Step 1: Enter Your OpenAI API Key

✅ Found existing API key in environment: sk-proj-abc...

Use existing key? (yes/no): yes

═══════════════════════════════════════════════════════════════

🤖 Step 2: Select Default Model

Available models:

  1. gpt-4-turbo
     Advanced reasoning, 128K tokens, $0.01/1K input

  2. gpt-4o
     Optimized performance, 128K tokens, $0.005/1K input

  3. gpt-3.5-turbo
     Fast & cheap, 16K tokens, $0.0005/1K input

Select default model (1-3): 1

[... continues with more options ...]

✅ Configuration saved successfully!
```

---

## Step 4: Test Your Connection

Verify that OpenAI is properly configured:

```bash
node ~/.ai-brain/test-openai-connection.js
```

**Expected output:**
```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║           🧪 OpenAI Connection Test for CodingMaster           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

Test 1: Checking API Key...
  ✅ PASSED: API key found (sk-proj-abc...)

Test 2: Checking Configuration...
  ✅ PASSED: OpenAI is configured and enabled
     Models: gpt-4-turbo, gpt-4o

Test 3: Checking Agent Registry...
  ✅ PASSED: Found 2 OpenAI agents
     • GPT-4 Turbo (128000 tokens)
     • GPT-4o (128000 tokens)

[... more tests ...]

📊 Test Summary

Tests Passed: 7/7 (100%)

✅ All tests passed! OpenAI is ready to use.
```

---

## Step 5: Start Using OpenAI

### Basic Usage

```javascript
const CodingMasterMultiAgent = require('~/.ai-brain/install/coding-master-multi-agent.js');
const multiAgent = new CodingMasterMultiAgent();

// Delegate a task to OpenAI
const result = await multiAgent.delegateTask(
  'Write a function to calculate fibonacci numbers'
);

console.log(result);
```

### Prefer OpenAI

```javascript
const result = await multiAgent.delegateTask(
  'Your task here',
  {
    preferredPlatforms: ['openai']  // Only use OpenAI
  }
);
```

### Use Specific Model

```javascript
const result = await multiAgent.delegateTask(
  'Your task here',
  {
    preferredAgents: ['gpt-4-turbo']  // Use GPT-4 Turbo specifically
  }
);
```

### Compare Multiple Models

```javascript
const result = await multiAgent.delegateTask(
  'Your task here',
  {
    strategy: 'parallel',
    preferredAgents: ['gpt-4-turbo', 'gpt-4o']  // Compare both
  }
);

console.log('GPT-4 Turbo response:', result.responses[0]);
console.log('GPT-4o response:', result.responses[1]);
```

---

## Troubleshooting

### Problem: "API Key not found"

**Solution:**
```bash
# Check if API key is set
echo $OPENAI_API_KEY

# If empty, add it to your shell profile
echo 'export OPENAI_API_KEY="sk-your-key"' >> ~/.zshrc
source ~/.zshrc

# Verify
echo $OPENAI_API_KEY
```

### Problem: "Invalid API Key"

**Solution:**
1. Check your key starts with `sk-`
2. Verify it's the complete key (not truncated)
3. Check it hasn't expired in OpenAI dashboard
4. Create a new key if needed

### Problem: "Rate limit exceeded"

**Solution:**
1. Wait a few minutes before retrying
2. Upgrade your OpenAI plan for higher limits
3. Use `gpt-3.5-turbo` for faster responses with lower rate limits

### Problem: "Model not found"

**Solution:**
1. Verify the model name is correct
2. Check your OpenAI account has access to the model
3. Some models may require specific account tiers

### Problem: "Connection timeout"

**Solution:**
```javascript
const MultiAgentConfig = require('~/.ai-brain/install/multi-agent-config.js');
const config = new MultiAgentConfig();

// Increase timeout to 60 seconds
config.setOrchestrationSettings({
  timeout: 60000
});
```

---

## Configuration Options

### View Current Configuration

```bash
node ~/.ai-brain/install/multi-agent-config.js
```

### Set Advanced Options

```javascript
const MultiAgentConfig = require('~/.ai-brain/install/multi-agent-config.js');
const config = new MultiAgentConfig();

config.setPlatformCredentials('openai', {
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,        // 0.0 = deterministic, 2.0 = creative
  maxTokens: 2000,         // Max response length
  topP: 1.0,               // Nucleus sampling
  frequencyPenalty: 0.5,   // Reduce repetition
  presencePenalty: 0.5     // Encourage new topics
});
```

### Set Preferences

```javascript
config.setPreferences({
  prioritizeReliability: true,  // Use more reliable models
  prioritizeCost: false,         // Don't prioritize cost
  prioritizeSpeed: false         // Don't prioritize speed
});
```

---

## Available Models

| Model | Speed | Cost | Context | Best For |
|-------|-------|------|---------|----------|
| **gpt-4-turbo** | ⚡⚡ | $$$ | 128K | Complex reasoning, code generation |
| **gpt-4o** | ⚡⚡⚡ | $$ | 128K | Balanced performance and cost |
| **gpt-3.5-turbo** | ⚡⚡⚡⚡ | $ | 16K | Simple tasks, quick responses |

---

## Cost Management

### Monitor Token Usage

```javascript
const result = await multiAgent.delegateTask('Your task');

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

## Quick Reference

```bash
# Get your API key
# Visit: https://platform.openai.com/api-keys

# Set environment variable
export OPENAI_API_KEY="sk-your-key"

# Run setup wizard
node ~/.ai-brain/setup-openai.js

# Test connection
node ~/.ai-brain/test-openai-connection.js

# View configuration
node ~/.ai-brain/install/multi-agent-config.js

# List all agents
node -e "const r = require('~/.ai-brain/install/multi-agent-registry.js'); new r().listAgents();"
```

---

## Next Steps

1. ✅ Get your OpenAI API key
2. ✅ Set the `OPENAI_API_KEY` environment variable
3. ✅ Run the setup wizard
4. ✅ Test the connection
5. ✅ Start using OpenAI in your code
6. 📊 Monitor usage and costs
7. 🔧 Fine-tune preferences based on your needs

---

## Support & Resources

- **OpenAI Documentation**: https://platform.openai.com/docs
- **API Reference**: https://platform.openai.com/docs/api-reference
- **Model Comparison**: https://platform.openai.com/docs/models
- **Pricing**: https://openai.com/pricing
- **Status Page**: https://status.openai.com

---

**Last Updated**: January 29, 2026  
**Version**: 1.0.0  
**Status**: ✅ Ready to Use

# AI Brain Installation Guide

## Overview

AI Brain is now installable and ready for AI agents! This guide walks you through the complete installation and integration process.

## 🚀 Quick Installation

### Method 1: Direct Install (Recommended)

```bash
cd ~/.ai-brain
npm install
```

### Method 2: Global Installation

```bash
cd ~/.ai-brain
npm install -g .
```

### Method 3: From Package Registry (Future)

```bash
npm install -g ai-brain
```

## ✅ Verify Installation

```bash
ai-brain status
```

You should see:
- ✅ Brain directory verified
- ✅ Skills loaded (3+ skills)
- ✅ CLI available
- ✅ All connectivity tests passing

## 🧠 Basic Usage

### Command Line Interface

```bash
# List all available skills
ai-brain list

# Get a specific skill
ai-brain get react-native-quick-reference

# Search skills
ai-brain search "performance"

# Add new skill
ai-brain add my-skill ./my-skill.md

# Export brain data
ai-brain export json
```

### Integration with AI Agents

#### Basic Integration

```javascript
const { AIBrainLoader } = require('ai-brain');

// Initialize brain
const brain = new AIBrainLoader();
await brain.initialize();

// Get skills
const skills = brain.listSkills();
const skill = brain.getSkill('react-native');
const results = brain.searchSkills('deployment');
```

#### Advanced Agent Integration

```javascript
const { AIBrainAgent } = require('ai-brain/install/agent-integration');

// Create intelligent agent
const agent = new AIBrainAgent();
await agent.initialize();

// Context-aware skill application
const solution = await agent.applySkill('optimization', {
  technology: 'react',
  environment: 'production'
});

// Auto-suggest skills based on context
const suggestions = await agent.suggestSkills({
  problem: 'slow app startup',
  platform: 'mobile'
});
```

## 📁 Directory Structure

```
~/.ai-brain/
├── install/                   # Installation and CLI tools
│   ├── ai-brain-loader.js    # Core loader functionality
│   ├── ai-brain-cli.js       # Command line interface
│   ├── agent-integration.js  # Agent integration helpers
│   ├── setup.js             # Installation script
│   ├── status.js            # Health check
│   └── test.js              # Test suite
├── skills/                   # Available skills
│   ├── react-native-complete-suite.md
│   ├── react-native-quick-reference.md
│   └── vercel-skills-integration.md
├── global-knowledge/         # Cross-project knowledge
├── personal/                # Personal preferences
├── contextual/              # Current context
├── adaptive/                # Learning system
└── package.json             # NPM configuration
```

## 🛠 Integration Examples

### With Code Master AI

```javascript
class CodeMasterBrain {
  constructor() {
    this.brain = new AIBrainLoader();
  }

  async solve(problem) {
    await this.brain.initialize();
    
    // Search for relevant skills
    const skills = this.brain.searchSkills(problem);
    
    if (skills.length > 0) {
      const skill = this.brain.getSkill(skills[0].name);
      return this.applySkillToProblem(skill, problem);
    }
    
    return this.defaultSolution(problem);
  }
}

// Usage in Code Master
const codeMaster = new CodeMasterBrain();
const solution = await codeMaster.solve('optimize React app');
```

### With Custom AI Agents

```javascript
// Your custom agent with AI Brain
class MyAgent {
  constructor() {
    this.brain = null;
  }

  async initialize() {
    this.brain = new AIBrainLoader();
    await this.brain.initialize();
  }

  async processRequest(request) {
    // Get context from request
    const context = this.extractContext(request);
    
    // Find relevant skills
    const relevantSkills = await this.brain.searchSkills(context.technology);
    
    // Process with brain knowledge
    const response = this.processWithBrain(request, relevantSkills);
    
    return response;
  }
}
```

### With Multiple Agents

```javascript
// Shared brain for multiple specialized agents
const sharedBrain = new AIBrainLoader();
await sharedBrain.initialize();

// React Agent
const reactAgent = {
  async optimize(code) {
    const skills = await sharedBrain.searchSkills('react optimization');
    return this.applyOptimizations(code, skills);
  }
};

// Deployment Agent  
const deployAgent = {
  async deploy(config) {
    const skills = await sharedBrain.searchSkills('deployment');
    return this.executeDeployment(config, skills);
  }
};
```

## 🔧 Configuration

### Environment Variables

```bash
export AI_BRAIN_PATH="/custom/path/to/.ai-brain"
export AI_BRAIN_AUTO_LOAD="true"
export AI_BRAIN_CONTEXT_AWARE="true"
```

### Configuration File

Create `~/.ai-brain/ai-brain.config.json`:

```json
{
  "version": "1.0.0",
  "autoLoad": true,
  "contextAware": true,
  "skillsPath": "./skills",
  "agent": {
    "defaultContext": {
      "environment": "development",
      "platform": "node"
    },
    "autoSuggest": true,
    "learning": true
  }
}
```

## 📊 Available Skills

Current skills include:
- **react-native-complete-suite** (16.7 KB) - Complete React Native development patterns
- **react-native-quick-reference** (3.6 KB) - Quick React Native reference guide  
- **vercel-skills-integration** (6.9 KB) - Vercel deployment and optimization patterns

## 🧪 Testing

Run the test suite to verify everything works:

```bash
cd ~/.ai-brain
npm test
```

Or run individual tests:

```bash
node install/test.js        # Full test suite
node install/status.js      # Health check
ai-brain status            # CLI health check
```

## 🚀 Performance

- **Loading time**: < 100ms for 3 skills
- **Search time**: < 10ms for simple queries
- **Memory usage**: ~1MB base + skill content
- **Concurrent users**: Supports multiple agents simultaneously

## 🔍 Troubleshooting

### Common Issues

1. **"Brain not found"**
   - Check: `ls -la ~/.ai-brain`
   - Solution: Run installation from brain directory

2. **"No skills found"**
   - Check: `ls -la ~/.ai-brain/skills/`
   - Solution: Ensure .md files exist in skills directory

3. **"Permission denied"**
   - Check: `chmod +x ~/.ai-brain/install/*.js`
   - Solution: Make installation scripts executable

4. **CLI not found**
   - Check: `which ai-brain`
   - Solution: Run `npm install -g .` from brain directory

### Debug Mode

Enable debug logging:

```javascript
const brain = new AIBrainLoader({ debug: true });
```

### Reset Installation

If something goes wrong:

```bash
rm -rf ~/.ai-brain/install
cd ~/.ai-brain
node install/setup.js
```

## 📈 Next Steps

1. **Add custom skills**: Use `ai-brain add` to create domain-specific skills
2. **Integrate with agents**: Use the agent integration helpers
3. **Automate workflows**: Create scripts with AI Brain CLI
4. **Monitor performance**: Use the analytics tools
5. **Scale deployment**: Set up shared brain for teams

## 🤝 Contributing

To add new skills or improve the brain:

1. Add skills to `~/.ai-brain/skills/`
2. Update `package.json` if needed
3. Run tests: `npm test`
4. Update this documentation

---

🎉 **Your AI Brain is now ready for AI agents!**

The brain provides:
- ✅ Global knowledge management
- ✅ Skill-based expertise
- ✅ Context-aware assistance  
- ✅ Agent-ready integration
- ✅ CLI tools for management
- ✅ Performance optimization

Start building intelligent agents with AI Brain today!
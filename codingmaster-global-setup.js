#!/usr/bin/env node
/**
 * CodingMaster Global Brain Setup
 * Sets up the AI brain as the default brain for CodingMaster agent
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CodingMasterGlobalSetup {
  constructor() {
    this.brainPath = path.join(process.env.HOME, '.ai-brain');
    this.configPath = path.join(process.env.HOME, '.codingmaster');
  }

  async setupGlobalBrain() {
    console.log('🤖 Setting up CodingMaster with AI Brain globally...');
    
    // Create CodingMaster config directory
    if (!fs.existsSync(this.configPath)) {
      fs.mkdirSync(this.configPath, { recursive: true });
      console.log(`📁 Created config directory: ${this.configPath}`);
    }

    // Create global configuration
    const config = {
      brainPath: this.brainPath,
      brainEnabled: true,
      autoSync: true,
      learningMode: true,
      agents: {
        "@claude": "claude-sonnet-4-20250514", 
        "@gemini": "gemini-2.0-flash-exp",
        "@github-copilot": "github-copilot"
      },
      integrationMode: "enhanced",
      lastUpdated: new Date().toISOString()
    };

    const configFile = path.join(this.configPath, 'config.json');
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    console.log(`✅ Global config created: ${configFile}`);

    // Create environment variables file
    await this.createEnvironmentFile();
    
    // Create global brain loader
    await this.createGlobalBrainLoader();
    
    // Set up shell integration
    await this.setupShellIntegration();
    
    console.log('🚀 CodingMaster global setup complete!');
    return true;
  }

  async createEnvironmentFile() {
    const envContent = `# CodingMaster AI Brain Environment Variables
export AI_BRAIN_PATH="${this.brainPath}"
export CODINGMASTER_CONFIG="${this.configPath}"
export CODINGMASTER_BRAIN_ENABLED=true
export CODINGMASTER_AUTO_SYNC=true
export CODINGMASTER_LEARNING_MODE=true

# CodingMaster Agent Configuration
export CODINGMASTER_CLAUDE_MODEL="claude-sonnet-4-20250514"
export CODINGMASTER_GEMINI_MODEL="gemini-2.0-flash-exp"  
export CODINGMASTER_COPILOT_MODEL="github-copilot"

# Add AI Brain tools to PATH
export PATH="$PATH:${this.brainPath}"
`;

    const envFile = path.join(this.configPath, 'environment.sh');
    fs.writeFileSync(envFile, envContent);
    execSync(`chmod +x "${envFile}"`);
    
    console.log(`✅ Environment file created: ${envFile}`);
  }

  async createGlobalBrainLoader() {
    const loaderContent = `/**
 * CodingMaster Global Brain Loader
 * Automatically loads AI brain for CodingMaster agent
 */

const path = require('path');
const { CodeMasterBrain } = require('${this.brainPath}/code-master-integration.js');

class GlobalCodingMasterBrain {
  constructor() {
    this.brain = null;
    this.initialized = false;
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      const configPath = path.join(process.env.HOME, '.codingmaster', 'config.json');
      if (require('fs').existsSync(configPath)) {
        return require(configPath);
      }
    } catch (error) {
      console.warn('⚠️  Could not load CodingMaster config:', error.message);
    }
    
    return {
      brainEnabled: true,
      brainPath: path.join(process.env.HOME, '.ai-brain')
    };
  }

  async initialize() {
    if (this.initialized || !this.config.brainEnabled) {
      return this.initialized;
    }

    console.log('🧠 Initializing CodingMaster with Global AI Brain...');
    
    try {
      this.brain = new CodeMasterBrain();
      this.initialized = await this.brain.initialize();
      
      if (this.initialized) {
        console.log('✅ CodingMaster Global Brain ready');
        
        // Set up global access
        if (typeof global !== 'undefined') {
          global.codingMaster = this;
          global.brain = this.brain.brain;
        }
        
        // Enable learning mode if configured
        if (this.config.learningMode) {
          this.brain.toggleLearningMode(true);
        }
      }
    } catch (error) {
      console.error('❌ Failed to initialize CodingMaster brain:', error.message);
      this.initialized = false;
    }

    return this.initialized;
  }

  async solve(problem, context = {}) {
    await this.initialize();
    return this.brain ? this.brain.solve(problem, context) : null;
  }

  async getStatus() {
    if (!this.initialized) {
      return { status: 'not_initialized', brainEnabled: this.config.brainEnabled };
    }
    
    const brainStatus = await this.brain.getStatus();
    return {
      ...brainStatus,
      globalSetup: true,
      configPath: path.join(process.env.HOME, '.codingmaster'),
      brainPath: this.config.brainPath
    };
  }

  async toggleLearningMode(enable) {
    await this.initialize();
    return this.brain ? this.brain.toggleLearningMode(enable) : null;
  }
}

// Auto-initialize global brain
const globalBrain = new GlobalCodingMasterBrain();

// Initialize on module load
globalBrain.initialize().catch(console.error);

module.exports = { GlobalCodingMasterBrain, globalBrain };

// Global access
if (typeof global !== 'undefined') {
  global.GlobalCodingMasterBrain = GlobalCodingMasterBrain;
  global.codingMaster = globalBrain;
}
`;

    const loaderFile = path.join(this.configPath, 'global-brain.js');
    fs.writeFileSync(loaderFile, loaderContent);
    
    console.log(`✅ Global brain loader created: ${loaderFile}`);
  }

  async setupShellIntegration() {
    const shellScript = `#!/bin/bash
# CodingMaster Shell Integration

# Load environment
source "${this.configPath}/environment.sh"

# CodingMaster command shortcuts
alias cm="node ${this.configPath}/global-brain.js"
alias cm-status="node -e \\"require('${this.configPath}/global-brain.js').globalBrain.getStatus().then(console.log)\\""
alias cm-learn="node -e \\"require('${this.configPath}/global-brain.js').globalBrain.toggleLearningMode(true)\\""
alias cm-normal="node -e \\"require('${this.configPath}/global-brain.js').globalBrain.toggleLearningMode(false)\\""
alias cm-sync="node ${this.brainPath}/global-sync.js sync"

# AI Brain shortcuts
alias brain="ai-brain"
alias brain-sync="node ${this.brainPath}/global-sync.js"

# Auto-start brain sync on shell load
if [ "$CODINGMASTER_AUTO_SYNC" = "true" ]; then
  # Start sync daemon in background (only if not already running)
  if ! pgrep -f "global-sync.js" > /dev/null; then
    nohup node "${this.brainPath}/global-sync.js" start > /dev/null 2>&1 &
  fi
fi

echo "🧠 CodingMaster AI Brain loaded ($(ai-brain status | grep 'Total Skills' | cut -d: -f2 | xargs) skills available)"
`;

    const shellFile = path.join(this.configPath, 'shell-integration.sh');
    fs.writeFileSync(shellFile, shellScript);
    execSync(`chmod +x "${shellFile}"`);
    
    console.log(`✅ Shell integration created: ${shellFile}`);
    console.log('💡 To activate in your shell, add this to your shell profile:');
    console.log(`source "${shellFile}"`);
  }

  async testIntegration() {
    console.log('🧪 Testing CodingMaster brain integration...');
    
    try {
      // Test brain loading
      const { globalBrain } = require(path.join(this.configPath, 'global-brain.js'));
      
      // Test status
      const status = await globalBrain.getStatus();
      console.log('📊 Status:', status.status);
      
      // Test problem solving
      if (status.status === 'active') {
        const solution = await globalBrain.solve('test integration');
        console.log('✅ Problem solving test passed');
        console.log('💡 Solution method:', solution.method);
      }
      
      console.log('✅ Integration test completed successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Integration test failed:', error.message);
      return false;
    }
  }
}

// CLI interface
if (require.main === module) {
  const setup = new CodingMasterGlobalSetup();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'setup':
      setup.setupGlobalBrain().catch(console.error);
      break;
      
    case 'test':
      setup.testIntegration().catch(console.error);
      break;
      
    default:
      console.log(`
🤖 CodingMaster Global Brain Setup

Usage:
  node codingmaster-global-setup.js <command>

Commands:
  setup    Set up global CodingMaster brain integration
  test     Test the integration

Example:
  node codingmaster-global-setup.js setup
      `);
  }
}

module.exports = { CodingMasterGlobalSetup };
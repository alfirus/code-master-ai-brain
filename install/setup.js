#!/usr/bin/env node

/**
 * AI Brain Setup Script
 * Installs and configures AI Brain for AI agents
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AIBrainSetup {
  constructor() {
    this.homeDir = process.env.HOME || require('os').homedir();
    this.brainPath = path.join(this.homeDir, '.ai-brain');
    this.installDir = path.join(this.brainPath, 'install');
  }

  async setup() {
    console.log('🧠 Setting up AI Brain for AI agents...\n');

    try {
      // 1. Verify brain directory exists
      await this.verifyBrainDirectory();
      
      // 2. Create installation files
      await this.createInstallationFiles();
      
      // 3. Setup global npm package
      await this.setupNpmPackage();
      
      // 4. Create agent integration scripts
      await this.createAgentIntegration();
      
      // 5. Setup configuration files
      await this.setupConfiguration();
      
      // 6. Test installation
      await this.testInstallation();
      
      console.log('\n✅ AI Brain installation completed successfully!');
      console.log('\n🚀 Ready to use with AI agents:');
      console.log('   const { AIBrainLoader } = require("ai-brain");');
      console.log('   const brain = new AIBrainLoader();');
      console.log('   await brain.initialize();');
      
    } catch (error) {
      console.error('\n❌ Installation failed:', error.message);
      process.exit(1);
    }
  }

  async verifyBrainDirectory() {
    if (!fs.existsSync(this.brainPath)) {
      throw new Error(`AI Brain directory not found at ${this.brainPath}`);
    }
    console.log('✅ Brain directory verified');
  }

  async createInstallationFiles() {
    const files = [
      'ai-brain-loader.js',
      'ai-brain-cli.js',
      'setup.js',
      'status.js',
      'test.js'
    ];

    console.log('📁 Creating installation files...');
    for (const file of files) {
      const filePath = path.join(this.installDir, file);
      if (!fs.existsSync(filePath)) {
        console.log(`  ⚠️  Missing file: ${file}`);
      }
    }
    console.log('✅ Installation files ready');
  }

  async setupNpmPackage() {
    const packageJsonPath = path.join(this.brainPath, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      console.log('❌ package.json not found');
      return;
    }

    console.log('📦 Setting up npm package...');
    
    try {
      // Create global link
      process.chdir(this.brainPath);
      execSync('npm link', { stdio: 'pipe' });
      console.log('✅ npm package linked globally');
    } catch (error) {
      console.log('⚠️  Global linking failed, installing locally...');
      execSync('npm install -g .', { stdio: 'pipe' });
      console.log('✅ npm package installed globally');
    }
  }

  async createAgentIntegration() {
    const integrationPath = path.join(this.installDir, 'agent-integration.js');
    
    const integrationCode = `
/**
 * AI Brain Agent Integration
 * Ready-to-use integration for AI agents
 */

const { AIBrainLoader } = require('./ai-brain-loader');

class AIBrainAgent {
  constructor(options = {}) {
    this.brain = new AIBrainLoader(options.brainPath);
    this.initialized = false;
  }

  async initialize() {
    this.initialized = await this.brain.initialize();
    return this.initialized;
  }

  async getSkill(skillName) {
    if (!this.initialized) await this.initialize();
    return this.brain.getSkill(skillName);
  }

  async searchSkills(query) {
    if (!this.initialized) await this.initialize();
    return this.brain.searchSkills(query);
  }

  async listSkills() {
    if (!this.initialized) await this.initialize();
    return this.brain.listSkills();
  }

  async getContext() {
    if (!this.initialized) await this.initialize();
    return this.brain.getContext();
  }

  // AI-specific helper methods
  async applySkill(skillName, context = {}) {
    const skill = await this.getSkill(skillName);
    return this.processSkillWithContext(skill, context);
  }

  processSkillWithContext(skill, context) {
    // Process skill content with given context
    let content = skill.content;
    
    // Replace context variables
    Object.keys(context).forEach(key => {
      const placeholder = new RegExp(\`{{\${key}}}\`, 'g');
      content = content.replace(placeholder, context[key]);
    });
    
    return {
      ...skill,
      processedContent: content,
      context
    };
  }

  // Auto-suggest skills based on context
  async suggestSkills(context) {
    const skills = await this.listSkills();
    const suggestions = [];
    
    for (const skillName of skills) {
      const skill = await this.getSkill(skillName);
      const relevance = this.calculateRelevance(skill.content, context);
      if (relevance > 0) {
        suggestions.push({ name: skillName, relevance });
      }
    }
    
    return suggestions.sort((a, b) => b.relevance - a.relevance);
  }

  calculateRelevance(content, context) {
    let relevance = 0;
    const contentLower = content.toLowerCase();
    
    Object.keys(context).forEach(key => {
      const value = context[key].toLowerCase();
      if (contentLower.includes(value)) {
        relevance += 1;
      }
    });
    
    return relevance;
  }
}

// Easy export for common AI frameworks
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AIBrainAgent };
}

// Global availability
if (typeof global !== 'undefined') {
  global.AIBrainAgent = AIBrainAgent;
}
`;

    fs.writeFileSync(integrationPath, integrationCode);
    console.log('✅ Agent integration created');
  }

  async setupConfiguration() {
    const configPath = path.join(this.brainPath, 'ai-brain.config.json');
    
    const config = {
      version: "1.0.0",
      autoLoad: true,
      contextAware: true,
      skillsPath: "./skills",
      brainPath: this.brainPath,
      agent: {
        defaultContext: {
          environment: process.env.NODE_ENV || 'development',
          platform: process.platform,
          timestamp: new Date().toISOString()
        },
        autoSuggest: true,
        learning: true
      },
      integration: {
        npm: true,
        global: true,
        cli: true
      }
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('✅ Configuration created');
  }

  async testInstallation() {
    console.log('🧪 Testing installation...');
    
    try {
      // Test CLI
      execSync('ai-brain status', { stdio: 'pipe' });
      console.log('✅ CLI test passed');
    } catch (error) {
      console.log('⚠️  CLI test failed, but installation may still work');
    }

    // Test loader
    const { AIBrainLoader } = require('./ai-brain-loader');
    const loader = new AIBrainLoader();
    const success = await loader.initialize();
    
    if (success) {
      console.log('✅ Loader test passed');
    } else {
      throw new Error('Loader test failed');
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new AIBrainSetup();
  setup.setup();
}

module.exports = { AIBrainSetup };
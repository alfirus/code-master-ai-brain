#!/usr/bin/env node

/**
 * Multi-Agent Configuration System
 * 
 * Manages API keys, credentials, and preferences for all platforms
 */

const fs = require('fs-extra');
const path = require('path');

class MultiAgentConfig {
  constructor(configPath = null) {
    this.configPath = configPath || path.join(process.env.HOME, '.ai-brain', '.multi-agent-config.json');
    this.config = this.loadConfig();
  }

  /**
   * Load configuration from file
   */
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        return JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
      }
    } catch (error) {
      console.warn(`Could not load config: ${error.message}`);
    }

    return this.getDefaultConfig();
  }

  /**
   * Get default configuration
   */
  getDefaultConfig() {
    return {
      version: '1.0.0',
      platforms: {
        anthropic: {
          enabled: false,
          apiKey: process.env.ANTHROPIC_API_KEY || '',
          models: ['claude-3-opus', 'claude-3-sonnet']
        },
        openai: {
          enabled: false,
          apiKey: process.env.OPENAI_API_KEY || '',
          models: ['gpt-4-turbo', 'gpt-4o']
        },
        google: {
          enabled: false,
          apiKey: process.env.GOOGLE_API_KEY || '',
          models: ['gemini-pro', 'gemini-pro-vision']
        },
        'github-copilot': {
          enabled: false,
          token: process.env.GITHUB_TOKEN || '',
          models: ['copilot-gpt4']
        },
        opencodezen: {
          enabled: false,
          apiKey: process.env.OPENCODEZEN_API_KEY || '',
          models: ['opencodezen-pro']
        },
        ollama: {
          enabled: false,
          url: process.env.OLLAMA_URL || 'http://localhost:11434',
          models: ['ollama-llama2', 'ollama-mistral', 'ollama-neural-chat']
        }
      },
      orchestration: {
        maxConcurrentAgents: 5,
        timeout: 30000,
        defaultStrategy: 'hybrid',
        retryAttempts: 2,
        retryDelay: 1000
      },
      preferences: {
        prioritizeCost: false,
        prioritizeSpeed: false,
        prioritizeReliability: true,
        preferLocal: false
      },
      logging: {
        enabled: true,
        level: 'info',
        logFile: path.join(process.env.HOME, '.ai-brain', 'multi-agent.log')
      }
    };
  }

  /**
   * Save configuration to file
   */
  saveConfig() {
    try {
      fs.ensureDirSync(path.dirname(this.configPath));
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      return true;
    } catch (error) {
      console.error(`Could not save config: ${error.message}`);
      return false;
    }
  }

  /**
   * Set platform credentials
   */
  setPlatformCredentials(platform, credentials) {
    if (!this.config.platforms[platform]) {
      throw new Error(`Unknown platform: ${platform}`);
    }

    this.config.platforms[platform] = {
      ...this.config.platforms[platform],
      ...credentials,
      enabled: true
    };

    return this.saveConfig();
  }

  /**
   * Get platform credentials
   */
  getPlatformCredentials(platform) {
    return this.config.platforms[platform] || null;
  }

  /**
   * Enable platform
   */
  enablePlatform(platform) {
    if (this.config.platforms[platform]) {
      this.config.platforms[platform].enabled = true;
      return this.saveConfig();
    }
    return false;
  }

  /**
   * Disable platform
   */
  disablePlatform(platform) {
    if (this.config.platforms[platform]) {
      this.config.platforms[platform].enabled = false;
      return this.saveConfig();
    }
    return false;
  }

  /**
   * Get enabled platforms
   */
  getEnabledPlatforms() {
    return Object.entries(this.config.platforms)
      .filter(([_, config]) => config.enabled)
      .map(([platform, _]) => platform);
  }

  /**
   * Set orchestration settings
   */
  setOrchestrationSettings(settings) {
    this.config.orchestration = {
      ...this.config.orchestration,
      ...settings
    };
    return this.saveConfig();
  }

  /**
   * Get orchestration settings
   */
  getOrchestrationSettings() {
    return this.config.orchestration;
  }

  /**
   * Set preferences
   */
  setPreferences(preferences) {
    this.config.preferences = {
      ...this.config.preferences,
      ...preferences
    };
    return this.saveConfig();
  }

  /**
   * Get preferences
   */
  getPreferences() {
    return this.config.preferences;
  }

  /**
   * Display configuration
   */
  displayConfig() {
    console.log('\n⚙️  Multi-Agent Configuration\n');
    console.log('═'.repeat(80));

    console.log('\n🔐 Platform Credentials:');
    for (const [platform, config] of Object.entries(this.config.platforms)) {
      const status = config.enabled ? '✅' : '❌';
      console.log(`   ${status} ${platform}: ${config.enabled ? 'Enabled' : 'Disabled'}`);
      if (config.models) {
        console.log(`      Models: ${config.models.join(', ')}`);
      }
    }

    console.log('\n⚙️  Orchestration Settings:');
    for (const [key, value] of Object.entries(this.config.orchestration)) {
      console.log(`   ${key}: ${value}`);
    }

    console.log('\n📋 Preferences:');
    for (const [key, value] of Object.entries(this.config.preferences)) {
      console.log(`   ${key}: ${value}`);
    }

    console.log('\n' + '═'.repeat(80));
  }

  /**
   * Validate configuration
   */
  validateConfig() {
    const issues = [];

    const enabledPlatforms = this.getEnabledPlatforms();
    if (enabledPlatforms.length === 0) {
      issues.push('⚠️  No platforms are enabled');
    }

    for (const platform of enabledPlatforms) {
      const config = this.config.platforms[platform];
      if (platform === 'ollama' && !config.url) {
        issues.push(`⚠️  Ollama URL not configured`);
      } else if (platform !== 'ollama' && !config.apiKey && !config.token) {
        issues.push(`⚠️  ${platform} credentials not configured`);
      }
    }

    return {
      valid: issues.length === 0,
      issues: issues
    };
  }
}

module.exports = MultiAgentConfig;

// CLI usage
if (require.main === module) {
  const config = new MultiAgentConfig();
  
  console.log('\n⚙️  Multi-Agent Configuration System\n');
  
  // Display current config
  config.displayConfig();

  // Validate config
  console.log('\n✓ Configuration Validation:');
  const validation = config.validateConfig();
  console.log(`   Valid: ${validation.valid ? '✅' : '❌'}`);
  if (validation.issues.length > 0) {
    validation.issues.forEach(issue => console.log(`   ${issue}`));
  }

  console.log('\n📝 To configure platforms, use:');
  console.log('   config.setPlatformCredentials("anthropic", { apiKey: "your-key" })');
  console.log('   config.setPlatformCredentials("openai", { apiKey: "your-key" })');
  console.log('   config.setPlatformCredentials("google", { apiKey: "your-key" })');
  console.log('   config.setPlatformCredentials("github-copilot", { token: "your-token" })');
  console.log('   config.setPlatformCredentials("opencodezen", { apiKey: "your-key" })');
  console.log('   config.setPlatformCredentials("ollama", { url: "http://localhost:11434" })');
}

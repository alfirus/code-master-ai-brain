#!/usr/bin/env node

/**
 * OpenAI Setup Script for CodingMaster
 * 
 * Interactive setup to configure OpenAI as a provider
 */

const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

const MultiAgentConfig = require('./install/multi-agent-config.js');

class OpenAISetup {
  constructor() {
    this.config = new MultiAgentConfig();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Ask user a question
   */
  async ask(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  /**
   * Display welcome message
   */
  displayWelcome() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                ║');
    console.log('║        🚀 OpenAI Setup for CodingMaster Multi-Agent System     ║');
    console.log('║                                                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\n');
    console.log('This wizard will help you configure OpenAI as a provider.\n');
    console.log('You\'ll need an OpenAI API key to proceed.');
    console.log('Get one at: https://platform.openai.com/api-keys\n');
  }

  /**
   * Get API key from user
   */
  async getApiKey() {
    console.log('═'.repeat(70));
    console.log('\n📝 Step 1: Enter Your OpenAI API Key\n');
    
    const existingKey = process.env.OPENAI_API_KEY;
    if (existingKey) {
      console.log(`✅ Found existing API key in environment: ${existingKey.substring(0, 10)}...`);
      const useExisting = await this.ask('\nUse existing key? (yes/no): ');
      if (useExisting.toLowerCase() === 'yes' || useExisting.toLowerCase() === 'y') {
        return existingKey;
      }
    }

    console.log('\nEnter your OpenAI API key (starts with "sk-"):');
    const apiKey = await this.ask('API Key: ');

    if (!apiKey.startsWith('sk-')) {
      console.log('\n❌ Invalid API key format. Must start with "sk-"');
      return null;
    }

    return apiKey;
  }

  /**
   * Select default model
   */
  async selectDefaultModel() {
    console.log('\n═'.repeat(70));
    console.log('\n🤖 Step 2: Select Default Model\n');

    const models = [
      { id: 1, name: 'gpt-4-turbo', description: 'Advanced reasoning, 128K tokens, $0.01/1K input' },
      { id: 2, name: 'gpt-4o', description: 'Optimized performance, 128K tokens, $0.005/1K input' },
      { id: 3, name: 'gpt-3.5-turbo', description: 'Fast & cheap, 16K tokens, $0.0005/1K input' }
    ];

    console.log('Available models:\n');
    models.forEach(m => {
      console.log(`  ${m.id}. ${m.name}`);
      console.log(`     ${m.description}\n`);
    });

    const choice = await this.ask('Select default model (1-3): ');
    const selected = models.find(m => m.id === parseInt(choice));

    if (!selected) {
      console.log('\n❌ Invalid selection');
      return 'gpt-4-turbo';
    }

    return selected.name;
  }

  /**
   * Configure advanced options
   */
  async configureAdvanced() {
    console.log('\n═'.repeat(70));
    console.log('\n⚙️  Step 3: Advanced Configuration (Optional)\n');

    const advanced = await this.ask('Configure advanced options? (yes/no): ');
    
    if (advanced.toLowerCase() !== 'yes' && advanced.toLowerCase() !== 'y') {
      return {
        temperature: 0.7,
        maxTokens: 2000,
        topP: 1.0
      };
    }

    console.log('\nTemperature (0.0-2.0): Controls randomness');
    console.log('  0.0 = Deterministic, 2.0 = Creative (default: 0.7)');
    const temperature = await this.ask('Temperature: ');

    console.log('\nMax Tokens: Maximum response length');
    console.log('  (default: 2000, max: 128000)');
    const maxTokens = await this.ask('Max Tokens: ');

    console.log('\nTop P (0.0-1.0): Nucleus sampling');
    console.log('  (default: 1.0)');
    const topP = await this.ask('Top P: ');

    return {
      temperature: parseFloat(temperature) || 0.7,
      maxTokens: parseInt(maxTokens) || 2000,
      topP: parseFloat(topP) || 1.0
    };
  }

  /**
   * Configure preferences
   */
  async configurePreferences() {
    console.log('\n═'.repeat(70));
    console.log('\n📊 Step 4: Orchestration Preferences\n');

    console.log('How should CodingMaster prioritize when selecting agents?\n');

    const reliability = await this.ask('Prioritize reliability? (yes/no): ');
    const cost = await this.ask('Prioritize cost? (yes/no): ');
    const speed = await this.ask('Prioritize speed? (yes/no): ');

    return {
      prioritizeReliability: reliability.toLowerCase() === 'yes' || reliability.toLowerCase() === 'y',
      prioritizeCost: cost.toLowerCase() === 'yes' || cost.toLowerCase() === 'y',
      prioritizeSpeed: speed.toLowerCase() === 'yes' || speed.toLowerCase() === 'y'
    };
  }

  /**
   * Review and confirm configuration
   */
  async reviewConfiguration(apiKey, defaultModel, advanced, preferences) {
    console.log('\n═'.repeat(70));
    console.log('\n✅ Configuration Summary\n');

    console.log('OpenAI Configuration:');
    console.log(`  API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(-4)}`);
    console.log(`  Default Model: ${defaultModel}`);
    console.log(`  Temperature: ${advanced.temperature}`);
    console.log(`  Max Tokens: ${advanced.maxTokens}`);
    console.log(`  Top P: ${advanced.topP}`);

    console.log('\nOrchestration Preferences:');
    console.log(`  Prioritize Reliability: ${preferences.prioritizeReliability ? '✅' : '❌'}`);
    console.log(`  Prioritize Cost: ${preferences.prioritizeCost ? '✅' : '❌'}`);
    console.log(`  Prioritize Speed: ${preferences.prioritizeSpeed ? '✅' : '❌'}`);

    const confirm = await this.ask('\nProceed with this configuration? (yes/no): ');
    return confirm.toLowerCase() === 'yes' || confirm.toLowerCase() === 'y';
  }

  /**
   * Save configuration
   */
  saveConfiguration(apiKey, defaultModel, advanced, preferences) {
    try {
      // Set OpenAI credentials
      this.config.setPlatformCredentials('openai', {
        apiKey: apiKey,
        defaultModel: defaultModel,
        ...advanced
      });

      // Set preferences
      this.config.setPreferences(preferences);

      console.log('\n✅ Configuration saved successfully!\n');
      return true;
    } catch (error) {
      console.log(`\n❌ Error saving configuration: ${error.message}\n`);
      return false;
    }
  }

  /**
   * Test OpenAI connection
   */
  async testConnection(apiKey) {
    console.log('\n═'.repeat(70));
    console.log('\n🧪 Testing OpenAI Connection...\n');

    try {
      // Validate API key format
      if (!apiKey.startsWith('sk-')) {
        throw new Error('Invalid API key format');
      }

      console.log('✅ API key format is valid');
      console.log('✅ OpenAI is configured and ready to use!');

      return true;
    } catch (error) {
      console.log(`❌ Connection test failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Display next steps
   */
  displayNextSteps() {
    console.log('\n═'.repeat(70));
    console.log('\n🚀 Next Steps\n');

    console.log('1. Verify configuration:');
    console.log('   node ~/.ai-brain/install/multi-agent-config.js\n');

    console.log('2. Test OpenAI connection:');
    console.log('   node ~/.ai-brain/test-openai-connection.js\n');

    console.log('3. Use OpenAI in your code:');
    console.log('   const multiAgent = new CodingMasterMultiAgent();');
    console.log('   const result = await multiAgent.delegateTask(');
    console.log('     "Your task here",');
    console.log('     { preferredPlatforms: ["openai"] }');
    console.log('   );\n');

    console.log('4. View documentation:');
    console.log('   cat ~/.ai-brain/OPENAI-SETUP-GUIDE.md\n');

    console.log('═'.repeat(70));
    console.log('\n✨ Setup complete! Happy coding! ✨\n');
  }

  /**
   * Run the setup wizard
   */
  async run() {
    try {
      this.displayWelcome();

      // Step 1: Get API key
      const apiKey = await this.getApiKey();
      if (!apiKey) {
        console.log('\n❌ Setup cancelled: Invalid API key');
        this.rl.close();
        process.exit(1);
      }

      // Step 2: Select default model
      const defaultModel = await this.selectDefaultModel();

      // Step 3: Configure advanced options
      const advanced = await this.configureAdvanced();

      // Step 4: Configure preferences
      const preferences = await this.configurePreferences();

      // Step 5: Review and confirm
      const confirmed = await this.reviewConfiguration(apiKey, defaultModel, advanced, preferences);
      if (!confirmed) {
        console.log('\n❌ Setup cancelled by user');
        this.rl.close();
        process.exit(1);
      }

      // Step 6: Save configuration
      const saved = this.saveConfiguration(apiKey, defaultModel, advanced, preferences);
      if (!saved) {
        console.log('\n❌ Failed to save configuration');
        this.rl.close();
        process.exit(1);
      }

      // Step 7: Test connection
      await this.testConnection(apiKey);

      // Step 8: Display next steps
      this.displayNextSteps();

      this.rl.close();
    } catch (error) {
      console.error(`\n❌ Setup error: ${error.message}\n`);
      this.rl.close();
      process.exit(1);
    }
  }
}

// Run setup
if (require.main === module) {
  const setup = new OpenAISetup();
  setup.run();
}

module.exports = OpenAISetup;

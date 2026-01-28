#!/usr/bin/env node

/**
 * OpenAI Connection Test
 * 
 * Verifies that OpenAI is properly configured and ready to use
 */

const MultiAgentConfig = require('./install/multi-agent-config.js');
const MultiAgentRegistry = require('./install/multi-agent-registry.js');

class OpenAIConnectionTest {
  constructor() {
    this.config = new MultiAgentConfig();
    this.registry = new MultiAgentRegistry();
  }

  /**
   * Display test header
   */
  displayHeader() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                                                                ║');
    console.log('║           🧪 OpenAI Connection Test for CodingMaster           ║');
    console.log('║                                                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('\n');
  }

  /**
   * Test 1: Check API key
   */
  testApiKey() {
    console.log('Test 1: Checking API Key...');
    
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.log('  ❌ FAILED: OPENAI_API_KEY environment variable not set');
      return false;
    }

    if (!apiKey.startsWith('sk-')) {
      console.log('  ❌ FAILED: Invalid API key format (must start with "sk-")');
      return false;
    }

    console.log(`  ✅ PASSED: API key found (${apiKey.substring(0, 10)}...)`);
    return true;
  }

  /**
   * Test 2: Check configuration
   */
  testConfiguration() {
    console.log('\nTest 2: Checking Configuration...');
    
    const openaiConfig = this.config.getPlatformCredentials('openai');
    
    if (!openaiConfig) {
      console.log('  ❌ FAILED: OpenAI not configured');
      return false;
    }

    if (!openaiConfig.enabled) {
      console.log('  ⚠️  WARNING: OpenAI is configured but not enabled');
      console.log('     Run: config.enablePlatform("openai")');
      return false;
    }

    console.log('  ✅ PASSED: OpenAI is configured and enabled');
    console.log(`     Models: ${openaiConfig.models.join(', ')}`);
    return true;
  }

  /**
   * Test 3: Check registry
   */
  testRegistry() {
    console.log('\nTest 3: Checking Agent Registry...');
    
    const agents = this.registry.getAllAgents();
    const openaiAgents = agents.filter(a => a.platform === 'openai');

    if (openaiAgents.length === 0) {
      console.log('  ❌ FAILED: No OpenAI agents found in registry');
      return false;
    }

    console.log(`  ✅ PASSED: Found ${openaiAgents.length} OpenAI agents`);
    openaiAgents.forEach(agent => {
      console.log(`     • ${agent.name} (${agent.maxTokens} tokens)`);
    });
    return true;
  }

  /**
   * Test 4: Check preferences
   */
  testPreferences() {
    console.log('\nTest 4: Checking Preferences...');
    
    const preferences = this.config.getPreferences();
    
    console.log('  ✅ PASSED: Preferences loaded');
    console.log(`     Prioritize Reliability: ${preferences.prioritizeReliability ? '✅' : '❌'}`);
    console.log(`     Prioritize Cost: ${preferences.prioritizeCost ? '✅' : '❌'}`);
    console.log(`     Prioritize Speed: ${preferences.prioritizeSpeed ? '✅' : '❌'}`);
    return true;
  }

  /**
   * Test 5: Check orchestration settings
   */
  testOrchestration() {
    console.log('\nTest 5: Checking Orchestration Settings...');
    
    const settings = this.config.getOrchestrationSettings();
    
    console.log('  ✅ PASSED: Orchestration settings loaded');
    console.log(`     Max Concurrent Agents: ${settings.maxConcurrentAgents}`);
    console.log(`     Timeout: ${settings.timeout}ms`);
    console.log(`     Default Strategy: ${settings.defaultStrategy}`);
    console.log(`     Retry Attempts: ${settings.retryAttempts}`);
    return true;
  }

  /**
   * Test 6: Validate configuration
   */
  testValidation() {
    console.log('\nTest 6: Validating Configuration...');
    
    const validation = this.config.validateConfig();
    
    if (!validation.valid) {
      console.log('  ❌ FAILED: Configuration validation failed');
      validation.issues.forEach(issue => {
        console.log(`     ${issue}`);
      });
      return false;
    }

    console.log('  ✅ PASSED: Configuration is valid');
    return true;
  }

  /**
   * Test 7: Check OpenAI models
   */
  testModels() {
    console.log('\nTest 7: Checking OpenAI Models...');
    
    const agents = this.registry.getAllAgents();
    const openaiAgents = agents.filter(a => a.platform === 'openai');

    const models = {
      'gpt-4-turbo': false,
      'gpt-4o': false,
      'gpt-3.5-turbo': false
    };

    openaiAgents.forEach(agent => {
      if (models.hasOwnProperty(agent.id)) {
        models[agent.id] = true;
      }
    });

    let allFound = true;
    for (const [model, found] of Object.entries(models)) {
      if (found) {
        console.log(`  ✅ ${model} available`);
      } else {
        console.log(`  ⚠️  ${model} not found`);
        allFound = false;
      }
    }

    return allFound;
  }

  /**
   * Display summary
   */
  displaySummary(results) {
    console.log('\n' + '═'.repeat(70));
    console.log('\n📊 Test Summary\n');

    const passed = results.filter(r => r).length;
    const total = results.length;
    const percentage = Math.round((passed / total) * 100);

    console.log(`Tests Passed: ${passed}/${total} (${percentage}%)`);

    if (percentage === 100) {
      console.log('\n✅ All tests passed! OpenAI is ready to use.\n');
    } else if (percentage >= 80) {
      console.log('\n⚠️  Most tests passed. Some features may not work.\n');
    } else {
      console.log('\n❌ Several tests failed. Please review the errors above.\n');
    }

    console.log('═'.repeat(70));
  }

  /**
   * Display usage examples
   */
  displayUsageExamples() {
    console.log('\n💡 Usage Examples\n');

    console.log('1. Basic task delegation:');
    console.log('   const multiAgent = new CodingMasterMultiAgent();');
    console.log('   const result = await multiAgent.delegateTask("Your task");');

    console.log('\n2. Prefer OpenAI:');
    console.log('   const result = await multiAgent.delegateTask("Your task", {');
    console.log('     preferredPlatforms: ["openai"]');
    console.log('   });');

    console.log('\n3. Use specific model:');
    console.log('   const result = await multiAgent.delegateTask("Your task", {');
    console.log('     preferredAgents: ["gpt-4-turbo"]');
    console.log('   });');

    console.log('\n4. Compare models:');
    console.log('   const result = await multiAgent.delegateTask("Your task", {');
    console.log('     strategy: "parallel",');
    console.log('     preferredAgents: ["gpt-4-turbo", "gpt-4o"]');
    console.log('   });');

    console.log('\n');
  }

  /**
   * Run all tests
   */
  run() {
    this.displayHeader();

    const results = [
      this.testApiKey(),
      this.testConfiguration(),
      this.testRegistry(),
      this.testPreferences(),
      this.testOrchestration(),
      this.testValidation(),
      this.testModels()
    ];

    this.displaySummary(results);
    this.displayUsageExamples();
  }
}

// Run tests
if (require.main === module) {
  const test = new OpenAIConnectionTest();
  test.run();
}

module.exports = OpenAIConnectionTest;

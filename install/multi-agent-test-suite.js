#!/usr/bin/env node

/**
 * Multi-Agent System Test Suite
 * 
 * Comprehensive tests for all components of the multi-agent system
 */

const MultiAgentRegistry = require('./multi-agent-registry');
const TaskAnalyzer = require('./task-analyzer');
const IntelligentRouter = require('./intelligent-router');
const { ConnectorFactory } = require('./agent-connectors');
const OrchestrationController = require('./orchestration-controller');
const CodingMasterMultiAgent = require('./coding-master-multi-agent');
const MultiAgentConfig = require('./multi-agent-config');

class MultiAgentTestSuite {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('\n🧪 Multi-Agent System Test Suite\n');
    console.log('═'.repeat(80));

    // Test 1: Registry
    await this.testRegistry();

    // Test 2: Task Analyzer
    await this.testTaskAnalyzer();

    // Test 3: Intelligent Router
    await this.testIntelligentRouter();

    // Test 4: Agent Connectors
    await this.testAgentConnectors();

    // Test 5: Orchestration Controller
    await this.testOrchestrationController();

    // Test 6: CodingMaster Integration
    await this.testCodingMasterIntegration();

    // Test 7: Configuration System
    await this.testConfigurationSystem();

    // Print results
    this.printResults();
  }

  /**
   * Test Registry
   */
  async testRegistry() {
    console.log('\n📋 Testing Multi-Agent Registry...');

    try {
      const registry = new MultiAgentRegistry();

      // Test 1: Load agents
      const agents = registry.getAllAgents();
      if (agents.length >= 10) {
        this.pass('Registry: Load agents', `Loaded ${agents.length} agents`);
      } else {
        this.fail('Registry: Load agents', `Expected 10+ agents, got ${agents.length}`);
      }

      // Test 2: Get agents by platform
      const anthropicAgents = registry.getAgentsByPlatform('anthropic');
      if (anthropicAgents.length > 0) {
        this.pass('Registry: Get agents by platform', `Found ${anthropicAgents.length} Anthropic agents`);
      } else {
        this.fail('Registry: Get agents by platform', 'No Anthropic agents found');
      }

      // Test 3: Get agents by capability
      const codeGenAgents = registry.getAgentsByCapability('code-generation');
      if (codeGenAgents.length > 0) {
        this.pass('Registry: Get agents by capability', `Found ${codeGenAgents.length} code-generation agents`);
      } else {
        this.fail('Registry: Get agents by capability', 'No code-generation agents found');
      }

      // Test 4: Get best agents for task
      const bestAgents = registry.getBestAgentsForTask('code-generation', 3);
      if (bestAgents.length > 0) {
        this.pass('Registry: Get best agents for task', `Found ${bestAgents.length} best agents`);
      } else {
        this.fail('Registry: Get best agents for task', 'No best agents found');
      }

      // Test 5: Get statistics
      const stats = registry.getStatistics();
      if (stats.totalAgents > 0) {
        this.pass('Registry: Get statistics', `Total agents: ${stats.totalAgents}`);
      } else {
        this.fail('Registry: Get statistics', 'Could not get statistics');
      }
    } catch (error) {
      this.fail('Registry: General', error.message);
    }
  }

  /**
   * Test Task Analyzer
   */
  async testTaskAnalyzer() {
    console.log('\n📊 Testing Task Analyzer...');

    try {
      const analyzer = new TaskAnalyzer();

      const testTasks = [
        { task: 'Create a React component', expectedType: 'code-generation' },
        { task: 'Review this code for quality', expectedType: 'code-review' },
        { task: 'Design a system architecture', expectedType: 'system-design' },
        { task: 'Write documentation', expectedType: 'documentation' }
      ];

      for (const { task, expectedType } of testTasks) {
        const analysis = analyzer.analyzeTask(task);
        if (analysis.taskType === expectedType) {
          this.pass('Task Analyzer: Detect task type', `Correctly identified "${expectedType}"`);
        } else {
          this.fail('Task Analyzer: Detect task type', `Expected ${expectedType}, got ${analysis.taskType}`);
        }
      }

      // Test complexity estimation
      const simpleTask = 'Create a button';
      const complexTask = 'Design a complex distributed system with microservices, load balancing, and fault tolerance';

      const simpleAnalysis = analyzer.analyzeTask(simpleTask);
      const complexAnalysis = analyzer.analyzeTask(complexTask);

      if (simpleAnalysis.complexity === 'low' || simpleAnalysis.complexity === 'low-medium') {
        this.pass('Task Analyzer: Complexity estimation', 'Correctly identified simple task');
      } else {
        this.fail('Task Analyzer: Complexity estimation', `Expected low complexity, got ${simpleAnalysis.complexity}`);
      }

      if (complexAnalysis.complexity === 'high') {
        this.pass('Task Analyzer: Complexity estimation', 'Correctly identified complex task');
      } else {
        this.fail('Task Analyzer: Complexity estimation', `Expected high complexity, got ${complexAnalysis.complexity}`);
      }
    } catch (error) {
      this.fail('Task Analyzer: General', error.message);
    }
  }

  /**
   * Test Intelligent Router
   */
  async testIntelligentRouter() {
    console.log('\n🚀 Testing Intelligent Router...');

    try {
      const router = new IntelligentRouter();

      const testTask = 'Create a React component with filtering and sorting';

      // Test different routing strategies
      const strategies = ['best-match', 'parallel', 'cost-optimized', 'speed-optimized', 'reliability-optimized', 'hybrid'];

      for (const strategy of strategies) {
        const routing = router.routeTask(testTask, strategy);
        if (routing.selectedAgents.length > 0) {
          this.pass(`Router: ${strategy} strategy`, `Selected ${routing.selectedAgents.length} agents`);
        } else {
          this.fail(`Router: ${strategy} strategy`, 'No agents selected');
        }
      }

      // Test routing recommendations
      const recommendations = router.getRoutingRecommendations(testTask);
      if (Object.keys(recommendations.recommendations).length > 0) {
        this.pass('Router: Get recommendations', `Generated recommendations for ${Object.keys(recommendations.recommendations).length} strategies`);
      } else {
        this.fail('Router: Get recommendations', 'No recommendations generated');
      }
    } catch (error) {
      this.fail('Router: General', error.message);
    }
  }

  /**
   * Test Agent Connectors
   */
  async testAgentConnectors() {
    console.log('\n🔌 Testing Agent Connectors...');

    try {
      const registry = new MultiAgentRegistry();
      const agents = registry.getAllAgents().slice(0, 3);

      const connectors = ConnectorFactory.createConnectors(agents);

      if (connectors.length === agents.length) {
        this.pass('Connectors: Create connectors', `Created ${connectors.length} connectors`);
      } else {
        this.fail('Connectors: Create connectors', `Expected ${agents.length} connectors, got ${connectors.length}`);
      }

      for (const connector of connectors) {
        if (connector.agent && connector.agent.id) {
          this.pass('Connectors: Connector properties', `Connector for ${connector.agent.id} has required properties`);
        } else {
          this.fail('Connectors: Connector properties', 'Connector missing required properties');
        }
      }
    } catch (error) {
      this.fail('Connectors: General', error.message);
    }
  }

  /**
   * Test Orchestration Controller
   */
  async testOrchestrationController() {
    console.log('\n🎯 Testing Orchestration Controller...');

    try {
      const controller = new OrchestrationController();

      // Test task execution
      const testTask = 'Create a simple React component';
      const result = await controller.executeTask(testTask, { strategy: 'best-match' });

      if (result.success) {
        this.pass('Orchestrator: Execute task', 'Task executed successfully');
      } else {
        this.fail('Orchestrator: Execute task', result.error || 'Unknown error');
      }

      // Test execution history
      const history = controller.getExecutionHistory();
      if (history.length > 0) {
        this.pass('Orchestrator: Execution history', `Recorded ${history.length} execution(s)`);
      } else {
        this.fail('Orchestrator: Execution history', 'No execution history recorded');
      }

      // Test statistics
      const stats = controller.getStatistics();
      if (stats.totalExecutions > 0) {
        this.pass('Orchestrator: Statistics', `Collected statistics for ${stats.totalExecutions} execution(s)`);
      } else {
        this.fail('Orchestrator: Statistics', 'No statistics available');
      }
    } catch (error) {
      this.fail('Orchestrator: General', error.message);
    }
  }

  /**
   * Test CodingMaster Integration
   */
  async testCodingMasterIntegration() {
    console.log('\n🤖 Testing CodingMaster Integration...');

    try {
      const multiAgent = new CodingMasterMultiAgent();

      // Test available agents
      const agents = multiAgent.getAvailableAgents();
      if (agents.length > 0) {
        this.pass('CodingMaster: Get available agents', `Found ${agents.length} agents`);
      } else {
        this.fail('CodingMaster: Get available agents', 'No agents available');
      }

      // Test task analysis
      const testTask = 'Create a React component';
      const analysis = multiAgent.analyzeTask(testTask);
      if (analysis.taskType) {
        this.pass('CodingMaster: Analyze task', `Identified task type: ${analysis.taskType}`);
      } else {
        this.fail('CodingMaster: Analyze task', 'Could not analyze task');
      }

      // Test routing recommendations
      const recommendations = multiAgent.getRoutingRecommendations(testTask);
      if (recommendations.recommendations) {
        this.pass('CodingMaster: Get routing recommendations', `Generated ${Object.keys(recommendations.recommendations).length} recommendations`);
      } else {
        this.fail('CodingMaster: Get routing recommendations', 'Could not generate recommendations');
      }

      // Test configuration
      const config = multiAgent.getConfiguration();
      if (config.maxConcurrentAgents > 0) {
        this.pass('CodingMaster: Get configuration', `Max concurrent agents: ${config.maxConcurrentAgents}`);
      } else {
        this.fail('CodingMaster: Get configuration', 'Could not get configuration');
      }
    } catch (error) {
      this.fail('CodingMaster: General', error.message);
    }
  }

  /**
   * Test Configuration System
   */
  async testConfigurationSystem() {
    console.log('\n⚙️  Testing Configuration System...');

    try {
      const config = new MultiAgentConfig();

      // Test load configuration
      const loadedConfig = config.config;
      if (loadedConfig && loadedConfig.platforms) {
        this.pass('Config: Load configuration', 'Configuration loaded successfully');
      } else {
        this.fail('Config: Load configuration', 'Could not load configuration');
      }

      // Test get enabled platforms
      const enabledPlatforms = config.getEnabledPlatforms();
      if (Array.isArray(enabledPlatforms)) {
        this.pass('Config: Get enabled platforms', `Found ${enabledPlatforms.length} enabled platform(s)`);
      } else {
        this.fail('Config: Get enabled platforms', 'Could not get enabled platforms');
      }

      // Test get orchestration settings
      const orchestrationSettings = config.getOrchestrationSettings();
      if (orchestrationSettings && orchestrationSettings.maxConcurrentAgents) {
        this.pass('Config: Get orchestration settings', `Max concurrent agents: ${orchestrationSettings.maxConcurrentAgents}`);
      } else {
        this.fail('Config: Get orchestration settings', 'Could not get orchestration settings');
      }

      // Test validate configuration
      const validation = config.validateConfig();
      if (validation.valid !== undefined) {
        this.pass('Config: Validate configuration', `Configuration validation: ${validation.valid ? 'Valid' : 'Invalid'}`);
      } else {
        this.fail('Config: Validate configuration', 'Could not validate configuration');
      }
    } catch (error) {
      this.fail('Config: General', error.message);
    }
  }

  /**
   * Pass test
   */
  pass(testName, message) {
    this.results.passed++;
    this.results.tests.push({
      name: testName,
      status: 'PASS',
      message: message
    });
    console.log(`   ✅ ${testName}: ${message}`);
  }

  /**
   * Fail test
   */
  fail(testName, message) {
    this.results.failed++;
    this.results.tests.push({
      name: testName,
      status: 'FAIL',
      message: message
    });
    console.log(`   ❌ ${testName}: ${message}`);
  }

  /**
   * Print results
   */
  printResults() {
    console.log('\n' + '═'.repeat(80));
    console.log('\n📊 TEST RESULTS\n');

    const total = this.results.passed + this.results.failed;
    const percentage = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;

    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${percentage}%\n`);

    if (this.results.failed === 0) {
      console.log('🎉 ALL TESTS PASSED!\n');
      console.log('Multi-Agent System is fully operational!');
    } else {
      console.log('⚠️  Some tests failed. Please review the errors above.');
    }

    console.log('\n' + '═'.repeat(80));
  }
}

// Run tests
if (require.main === module) {
  const testSuite = new MultiAgentTestSuite();
  testSuite.runAllTests().catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
  });
}

module.exports = MultiAgentTestSuite;

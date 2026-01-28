#!/usr/bin/env node

/**
 * CodingMaster Multi-Agent Integration
 * 
 * Integrates the multi-agent orchestration system with CodingMaster
 * Provides high-level interface for task delegation to multiple AI platforms
 */

const OrchestrationController = require('./orchestration-controller');
const MultiAgentRegistry = require('./multi-agent-registry');
const TaskAnalyzer = require('./task-analyzer');

class CodingMasterMultiAgent {
  constructor(options = {}) {
    this.orchestrator = new OrchestrationController(options);
    this.registry = new MultiAgentRegistry();
    this.analyzer = new TaskAnalyzer();
    this.options = options;
  }

  /**
   * Delegate task to multiple agents
   */
  async delegateTask(task, options = {}) {
    console.log('\n🎯 CodingMaster Multi-Agent Task Delegation\n');
    console.log('═'.repeat(80));

    // Merge options
    const mergedOptions = { ...this.options, ...options };

    // Execute with orchestrator
    const result = await this.orchestrator.executeTask(task, mergedOptions);

    return result;
  }

  /**
   * Get available agents
   */
  getAvailableAgents() {
    return this.registry.getAllAgents();
  }

  /**
   * Get agents by capability
   */
  getAgentsByCapability(capability) {
    return this.registry.getAgentsByCapability(capability);
  }

  /**
   * Get agents by platform
   */
  getAgentsByPlatform(platform) {
    return this.registry.getAgentsByPlatform(platform);
  }

  /**
   * Analyze task
   */
  analyzeTask(task) {
    return this.analyzer.analyzeTask(task);
  }

  /**
   * Get routing recommendations
   */
  getRoutingRecommendations(task) {
    return this.orchestrator.router.getRoutingRecommendations(task);
  }

  /**
   * Get execution history
   */
  getExecutionHistory() {
    return this.orchestrator.getExecutionHistory();
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return this.orchestrator.getStatistics();
  }

  /**
   * List all agents
   */
  listAgents() {
    return this.registry.listAgents();
  }

  /**
   * Get agent registry statistics
   */
  getRegistryStatistics() {
    return this.registry.getStatistics();
  }

  /**
   * Configure credentials
   */
  setCredentials(credentials) {
    this.orchestrator.credentials = credentials;
  }

  /**
   * Get configuration
   */
  getConfiguration() {
    return {
      maxConcurrentAgents: this.orchestrator.maxConcurrentAgents,
      timeout: this.orchestrator.timeout,
      credentials: Object.keys(this.orchestrator.credentials),
      registryStats: this.registry.getStatistics()
    };
  }

  /**
   * Display comprehensive status
   */
  displayStatus() {
    console.log('\n🤖 CodingMaster Multi-Agent System Status\n');
    console.log('═'.repeat(80));

    const registryStats = this.registry.getStatistics();
    console.log('\n📊 Agent Registry:');
    console.log(`   Total Agents: ${registryStats.totalAgents}`);
    console.log(`   Cloud Agents: ${registryStats.cloudAgents}`);
    console.log(`   Local Agents: ${registryStats.localAgents}`);
    console.log(`   Platforms: ${Object.keys(registryStats.byPlatform).join(', ')}`);

    const execStats = this.orchestrator.getStatistics();
    console.log('\n📈 Execution Statistics:');
    console.log(`   Total Executions: ${execStats.totalExecutions}`);
    console.log(`   Average Execution Time: ${execStats.averageExecutionTime}`);
    console.log(`   Success Rate: ${execStats.successRate}`);

    console.log('\n🔧 Configuration:');
    console.log(`   Max Concurrent Agents: ${this.orchestrator.maxConcurrentAgents}`);
    console.log(`   Timeout: ${this.orchestrator.timeout}ms`);

    console.log('\n' + '═'.repeat(80));
  }
}

module.exports = CodingMasterMultiAgent;

// CLI usage
if (require.main === module) {
  const multiAgent = new CodingMasterMultiAgent({
    maxConcurrentAgents: 5,
    timeout: 30000
  });

  // Display status
  multiAgent.displayStatus();

  // List agents
  console.log('\n📋 Available Agents:\n');
  multiAgent.listAgents();

  // Test task delegation
  const testTask = `
    Create a React component that displays a list of users with filtering and sorting capabilities.
    The component should fetch users from an API and support pagination.
  `;

  (async () => {
    console.log('\n🚀 Testing Task Delegation...\n');
    const result = await multiAgent.delegateTask(testTask, { strategy: 'hybrid' });
    
    console.log('\n✅ Task Delegation Complete');
    console.log(JSON.stringify(result.aggregatedResult, null, 2));
  })();
}

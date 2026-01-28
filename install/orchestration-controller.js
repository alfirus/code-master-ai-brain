#!/usr/bin/env node

/**
 * Multi-Agent Orchestration Controller
 * 
 * Coordinates execution across multiple agents
 * Manages concurrency, error handling, and result aggregation
 */

const MultiAgentRegistry = require('./multi-agent-registry');
const TaskAnalyzer = require('./task-analyzer');
const IntelligentRouter = require('./intelligent-router');
const { ConnectorFactory } = require('./agent-connectors');

class OrchestrationController {
  constructor(options = {}) {
    this.registry = new MultiAgentRegistry();
    this.analyzer = new TaskAnalyzer();
    this.router = new IntelligentRouter(options);
    this.credentials = options.credentials || {};
    this.maxConcurrentAgents = options.maxConcurrentAgents || 5;
    this.timeout = options.timeout || 30000;
    this.executionHistory = [];
  }

  /**
   * Execute a task with multiple agents
   */
  async executeTask(task, options = {}) {
    const executionId = this.generateExecutionId();
    const startTime = Date.now();

    console.log(`\n🚀 Starting task execution: ${executionId}`);
    console.log('═'.repeat(80));

    try {
      // Step 1: Analyze task
      const analysis = this.analyzer.analyzeTask(task);
      console.log(`\n📊 Task Analysis:`);
      console.log(`   Type: ${analysis.taskType}`);
      console.log(`   Complexity: ${analysis.complexity}`);
      console.log(`   Priority: ${analysis.priority}`);

      // Step 2: Route to agents
      const strategy = options.strategy || 'hybrid';
      const routing = this.router.routeTask(task, strategy);
      console.log(`\n🎯 Routing Strategy: ${strategy}`);
      console.log(`   Selected Agents: ${routing.selectedAgents.map(a => a.id).join(', ')}`);
      console.log(`   Reasoning: ${routing.reasoning}`);

      // Step 3: Execute with selected agents
      const results = await this.executeWithAgents(
        task,
        routing.selectedAgents,
        options
      );

      // Step 4: Aggregate results
      const aggregatedResult = this.aggregateResults(results, analysis);

      // Step 5: Record execution
      const executionTime = Date.now() - startTime;
      const execution = {
        executionId,
        task: task.substring(0, 100),
        analysis,
        routing,
        results,
        aggregatedResult,
        executionTime,
        timestamp: new Date().toISOString()
      };

      this.executionHistory.push(execution);

      console.log(`\n✅ Task execution completed in ${executionTime}ms`);
      console.log('═'.repeat(80));

      return {
        success: true,
        executionId,
        analysis,
        routing,
        results,
        aggregatedResult,
        executionTime
      };
    } catch (error) {
      console.error(`\n❌ Task execution failed: ${error.message}`);
      return {
        success: false,
        executionId,
        error: error.message,
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Execute task with multiple agents concurrently
   */
  async executeWithAgents(task, agents, options = {}) {
    const connectors = ConnectorFactory.createConnectors(agents, this.credentials);
    
    // Create execution promises
    const promises = connectors.map(connector =>
      this.executeWithTimeout(connector, task, options)
    );

    // Execute concurrently
    const results = await Promise.allSettled(promises);

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          success: false,
          agent: agents[index].id,
          error: result.reason.message
        };
      }
    });
  }

  /**
   * Execute with timeout
   */
  async executeWithTimeout(connector, task, options) {
    return Promise.race([
      connector.executeTask(task, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Execution timeout')), this.timeout)
      )
    ]);
  }

  /**
   * Aggregate results from multiple agents
   */
  aggregateResults(results, analysis) {
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    const aggregation = {
      totalAgents: results.length,
      successfulAgents: successful.length,
      failedAgents: failed.length,
      successRate: (successful.length / results.length * 100).toFixed(1) + '%',
      responses: successful.map(r => ({
        agent: r.agent,
        content: r.result?.content || r.result,
        executionTime: r.metadata?.executionTime || 0
      })),
      failures: failed.map(f => ({
        agent: f.agent,
        error: f.error
      })),
      synthesis: this.synthesizeResponses(successful, analysis)
    };

    return aggregation;
  }

  /**
   * Synthesize responses from multiple agents
   */
  synthesizeResponses(results, analysis) {
    const responses = results.map(r => r.result?.content || r.result);
    
    return {
      summary: `Received ${responses.length} responses from different agents`,
      responses: responses,
      consensus: this.findConsensus(responses),
      recommendations: this.generateRecommendations(results, analysis),
      nextSteps: this.suggestNextSteps(analysis)
    };
  }

  /**
   * Find consensus among responses
   */
  findConsensus(responses) {
    if (responses.length === 0) return null;
    if (responses.length === 1) return responses[0];

    return {
      type: 'multiple-perspectives',
      count: responses.length,
      note: 'Multiple agents provided different perspectives on the task'
    };
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(results, analysis) {
    const recommendations = [];

    if (results.length > 1) {
      recommendations.push('Compare responses from different agents for comprehensive understanding');
    }

    if (analysis.complexity === 'high') {
      recommendations.push('Consider implementing the solution iteratively based on agent feedback');
    }

    if (analysis.hasCode) {
      recommendations.push('Review code suggestions from multiple agents for best practices');
    }

    return recommendations;
  }

  /**
   * Suggest next steps
   */
  suggestNextSteps(analysis) {
    const steps = [];

    if (analysis.taskType === 'code-generation') {
      steps.push('Review generated code');
      steps.push('Add unit tests');
      steps.push('Perform code review');
    } else if (analysis.taskType === 'system-design') {
      steps.push('Create detailed architecture diagram');
      steps.push('Define API contracts');
      steps.push('Plan implementation phases');
    }

    return steps;
  }

  /**
   * Generate execution ID
   */
  generateExecutionId() {
    return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get execution history
   */
  getExecutionHistory() {
    return this.executionHistory;
  }

  /**
   * Get execution statistics
   */
  getStatistics() {
    const history = this.executionHistory;
    
    return {
      totalExecutions: history.length,
      averageExecutionTime: history.length > 0 
        ? (history.reduce((sum, e) => sum + e.executionTime, 0) / history.length).toFixed(0) + 'ms'
        : 'N/A',
      successRate: history.length > 0
        ? ((history.filter(e => e.results.some(r => r.success)).length / history.length) * 100).toFixed(1) + '%'
        : 'N/A',
      agentUsageStats: this.calculateAgentUsageStats(history)
    };
  }

  /**
   * Calculate agent usage statistics
   */
  calculateAgentUsageStats(history) {
    const stats = {};

    history.forEach(execution => {
      execution.routing.selectedAgents.forEach(agent => {
        if (!stats[agent.id]) {
          stats[agent.id] = { used: 0, successful: 0 };
        }
        stats[agent.id].used++;

        const result = execution.results.find(r => r.agent === agent.id);
        if (result && result.success) {
          stats[agent.id].successful++;
        }
      });
    });

    return stats;
  }

  /**
   * Clear execution history
   */
  clearHistory() {
    this.executionHistory = [];
  }
}

module.exports = OrchestrationController;

// CLI usage
if (require.main === module) {
  const controller = new OrchestrationController();
  
  const testTask = `
    Create a React component that displays a list of users with filtering and sorting capabilities.
    The component should fetch users from an API and support pagination.
  `;

  (async () => {
    console.log('\n🎯 Multi-Agent Orchestration Controller\n');
    
    const result = await controller.executeTask(testTask, { strategy: 'hybrid' });
    
    console.log('\n📊 Execution Result:');
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\n📈 Statistics:');
    console.log(JSON.stringify(controller.getStatistics(), null, 2));
  })();
}

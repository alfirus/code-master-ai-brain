#!/usr/bin/env node

/**
 * Intelligent Agent Router
 * 
 * Routes tasks to the best-suited agents based on:
 * - Task type and complexity
 * - Agent capabilities and strengths
 * - Performance metrics
 * - Availability
 * - Cost optimization
 */

const MultiAgentRegistry = require('./multi-agent-registry');
const TaskAnalyzer = require('./task-analyzer');

class IntelligentRouter {
  constructor(options = {}) {
    this.registry = new MultiAgentRegistry();
    this.analyzer = new TaskAnalyzer();
    this.routingStrategies = {
      'best-match': this.routeByBestMatch.bind(this),
      'parallel': this.routeForParallel.bind(this),
      'cost-optimized': this.routeByCostOptimized.bind(this),
      'speed-optimized': this.routeBySpeedOptimized.bind(this),
      'reliability-optimized': this.routeByReliabilityOptimized.bind(this),
      'hybrid': this.routeByHybrid.bind(this)
    };
    this.defaultStrategy = options.defaultStrategy || 'hybrid';
    this.maxAgentsPerTask = options.maxAgentsPerTask || 3;
  }

  /**
   * Route a task to appropriate agents
   */
  routeTask(task, strategy = null) {
    const analysisStrategy = strategy || this.defaultStrategy;
    const taskAnalysis = this.analyzer.analyzeTask(task);

    const routing = {
      task: task.substring(0, 100) + '...',
      analysis: taskAnalysis,
      strategy: analysisStrategy,
      selectedAgents: [],
      alternativeAgents: [],
      reasoning: ''
    };

    // Get routing based on strategy
    const routingFn = this.routingStrategies[analysisStrategy];
    if (routingFn) {
      const result = routingFn(taskAnalysis);
      routing.selectedAgents = result.selectedAgents;
      routing.alternativeAgents = result.alternativeAgents;
      routing.reasoning = result.reasoning;
    }

    return routing;
  }

  /**
   * Route by best match
   */
  routeByBestMatch(analysis) {
    const agents = this.registry.getBestAgentsForTask(
      analysis.taskType,
      this.maxAgentsPerTask
    );

    return {
      selectedAgents: agents,
      alternativeAgents: [],
      reasoning: `Selected ${agents.length} best agents for ${analysis.taskType} task based on reliability and speed`
    };
  }

  /**
   * Route for parallel execution
   */
  routeForParallel(analysis) {
    if (!analysis.parallelizable) {
      return this.routeByBestMatch(analysis);
    }

    // Get agents from different platforms for diversity
    const platforms = ['anthropic', 'openai', 'google', 'github-copilot'];
    const selectedAgents = [];

    for (const platform of platforms) {
      const platformAgents = this.registry.getAgentsByPlatform(platform);
      const capableAgents = platformAgents.filter(agent =>
        analysis.requiredCapabilities.some(cap => agent.capabilities.includes(cap))
      );

      if (capableAgents.length > 0) {
        selectedAgents.push(capableAgents[0]);
      }

      if (selectedAgents.length >= this.maxAgentsPerTask) break;
    }

    return {
      selectedAgents: selectedAgents.length > 0 ? selectedAgents : 
                      this.registry.getBestAgentsForTask(analysis.taskType, this.maxAgentsPerTask),
      alternativeAgents: [],
      reasoning: `Routed to ${selectedAgents.length} agents from different platforms for parallel execution and diverse perspectives`
    };
  }

  /**
   * Route by cost optimization
   */
  routeByCostOptimized(analysis) {
    const allAgents = this.registry.getAllAgents();
    
    // Filter by capability
    const capableAgents = allAgents.filter(agent =>
      analysis.requiredCapabilities.some(cap => agent.capabilities.includes(cap))
    );

    // Sort by cost (local first, then by cost per token)
    capableAgents.sort((a, b) => {
      if (a.isLocal && !b.isLocal) return -1;
      if (!a.isLocal && b.isLocal) return 1;
      return a.costPerMTok - b.costPerMTok;
    });

    const selectedAgents = capableAgents.slice(0, this.maxAgentsPerTask);
    const estimatedCost = this.calculateEstimatedCost(selectedAgents, analysis);

    return {
      selectedAgents: selectedAgents,
      alternativeAgents: capableAgents.slice(this.maxAgentsPerTask, this.maxAgentsPerTask + 2),
      reasoning: `Selected ${selectedAgents.length} most cost-effective agents. Estimated cost: $${estimatedCost.toFixed(4)}`
    };
  }

  /**
   * Route by speed optimization
   */
  routeBySpeedOptimized(analysis) {
    const allAgents = this.registry.getAllAgents();
    
    const capableAgents = allAgents.filter(agent =>
      analysis.requiredCapabilities.some(cap => agent.capabilities.includes(cap))
    );

    // Sort by speed
    capableAgents.sort((a, b) => {
      const speedScoreA = this.registry.getSpeedScore(a.speedRating);
      const speedScoreB = this.registry.getSpeedScore(b.speedRating);
      return speedScoreB - speedScoreA;
    });

    const selectedAgents = capableAgents.slice(0, this.maxAgentsPerTask);

    return {
      selectedAgents: selectedAgents,
      alternativeAgents: capableAgents.slice(this.maxAgentsPerTask, this.maxAgentsPerTask + 2),
      reasoning: `Selected ${selectedAgents.length} fastest agents for quick execution`
    };
  }

  /**
   * Route by reliability optimization
   */
  routeByReliabilityOptimized(analysis) {
    const allAgents = this.registry.getAllAgents();
    
    const capableAgents = allAgents.filter(agent =>
      analysis.requiredCapabilities.some(cap => agent.capabilities.includes(cap))
    );

    // Sort by reliability
    capableAgents.sort((a, b) => {
      const reliabilityScoreA = this.registry.getReliabilityScore(a.reliabilityRating);
      const reliabilityScoreB = this.registry.getReliabilityScore(b.reliabilityRating);
      return reliabilityScoreB - reliabilityScoreA;
    });

    const selectedAgents = capableAgents.slice(0, this.maxAgentsPerTask);

    return {
      selectedAgents: selectedAgents,
      alternativeAgents: capableAgents.slice(this.maxAgentsPerTask, this.maxAgentsPerTask + 2),
      reasoning: `Selected ${selectedAgents.length} most reliable agents for critical task`
    };
  }

  /**
   * Route by hybrid strategy (balanced approach)
   */
  routeByHybrid(analysis) {
    const allAgents = this.registry.getAllAgents();
    
    const capableAgents = allAgents.filter(agent =>
      analysis.requiredCapabilities.some(cap => agent.capabilities.includes(cap))
    );

    // Score agents based on multiple factors
    const scoredAgents = capableAgents.map(agent => ({
      agent: agent,
      score: this.calculateHybridScore(agent, analysis)
    }));

    // Sort by score
    scoredAgents.sort((a, b) => b.score - a.score);

    const selectedAgents = scoredAgents.slice(0, this.maxAgentsPerTask).map(s => s.agent);
    const alternativeAgents = scoredAgents.slice(this.maxAgentsPerTask, this.maxAgentsPerTask + 2).map(s => s.agent);

    return {
      selectedAgents: selectedAgents,
      alternativeAgents: alternativeAgents,
      reasoning: `Selected ${selectedAgents.length} agents using hybrid strategy balancing reliability, speed, and cost`
    };
  }

  /**
   * Calculate hybrid score
   */
  calculateHybridScore(agent, analysis) {
    const reliabilityScore = this.registry.getReliabilityScore(agent.reliabilityRating) * 0.4;
    const speedScore = this.registry.getSpeedScore(agent.speedRating) * 0.3;
    const costScore = (1 / (agent.costPerMTok + 0.001)) * 0.2;
    const localBonus = agent.isLocal ? 0.1 : 0;

    return reliabilityScore + speedScore + costScore + localBonus;
  }

  /**
   * Calculate estimated cost
   */
  calculateEstimatedCost(agents, analysis) {
    const tokenCount = analysis.estimatedTokens.total;
    const costPerToken = tokenCount / 1000000;

    return agents.reduce((total, agent) => {
      return total + (costPerToken * agent.costPerMTok);
    }, 0);
  }

  /**
   * Get routing recommendations
   */
  getRoutingRecommendations(task) {
    const analysis = this.analyzer.analyzeTask(task);
    const recommendations = {};

    for (const [strategy, _] of Object.entries(this.routingStrategies)) {
      const routing = this.routeTask(task, strategy);
      recommendations[strategy] = {
        agents: routing.selectedAgents.map(a => a.id),
        reasoning: routing.reasoning
      };
    }

    return {
      analysis: analysis,
      recommendations: recommendations
    };
  }
}

module.exports = IntelligentRouter;

// CLI usage
if (require.main === module) {
  const router = new IntelligentRouter();
  
  const testTask = `
    Create a React component that displays a list of users with filtering and sorting capabilities.
    The component should fetch users from an API and support pagination.
  `;

  console.log('\n🚀 Intelligent Router - Task Routing\n');
  console.log('═'.repeat(80));

  const routing = router.routeTask(testTask);
  console.log('\n📋 Routing Result:');
  console.log(JSON.stringify(routing, null, 2));

  console.log('\n📊 All Routing Recommendations:');
  const recommendations = router.getRoutingRecommendations(testTask);
  console.log(JSON.stringify(recommendations, null, 2));
}

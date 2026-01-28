#!/usr/bin/env node

/**
 * Learning-Based Routing System
 * 
 * Learns from execution history to improve agent selection over time.
 * Tracks:
 * - Agent performance metrics
 * - Task success rates
 * - Execution times
 * - Cost efficiency
 * - User satisfaction
 */

const fs = require('fs-extra');
const path = require('path');

class LearningBasedRouter {
  constructor(historyPath = null) {
    this.historyPath = historyPath || path.join(process.env.HOME, '.ai-brain', '.routing-history.json');
    this.history = this.loadHistory();
    this.performanceMetrics = this.calculateMetrics();
  }

  /**
   * Load execution history from file
   */
  loadHistory() {
    try {
      if (fs.existsSync(this.historyPath)) {
        return JSON.parse(fs.readFileSync(this.historyPath, 'utf-8'));
      }
    } catch (error) {
      console.warn(`Could not load history: ${error.message}`);
    }

    return {
      executions: [],
      agentStats: {},
      taskStats: {},
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Save execution history to file
   */
  saveHistory() {
    try {
      fs.ensureDirSync(path.dirname(this.historyPath));
      this.history.lastUpdated = new Date().toISOString();
      fs.writeFileSync(this.historyPath, JSON.stringify(this.history, null, 2));
      return true;
    } catch (error) {
      console.error(`Could not save history: ${error.message}`);
      return false;
    }
  }

  /**
   * Record execution result
   */
  recordExecution(agentId, taskType, result) {
    const execution = {
      timestamp: new Date().toISOString(),
      agentId: agentId,
      taskType: taskType,
      success: result.success || false,
      executionTime: result.executionTime || 0,
      tokensUsed: result.tokensUsed || 0,
      cost: result.cost || 0,
      quality: result.quality || 0.5, // 0-1 scale
      userRating: result.userRating || null // Optional user feedback
    };

    this.history.executions.push(execution);

    // Update agent stats
    if (!this.history.agentStats[agentId]) {
      this.history.agentStats[agentId] = {
        totalExecutions: 0,
        successCount: 0,
        failureCount: 0,
        avgExecutionTime: 0,
        avgTokensUsed: 0,
        avgCost: 0,
        avgQuality: 0,
        avgUserRating: null
      };
    }

    const stats = this.history.agentStats[agentId];
    stats.totalExecutions++;
    if (execution.success) {
      stats.successCount++;
    } else {
      stats.failureCount++;
    }

    // Update averages
    stats.avgExecutionTime = (stats.avgExecutionTime * (stats.totalExecutions - 1) + execution.executionTime) / stats.totalExecutions;
    stats.avgTokensUsed = (stats.avgTokensUsed * (stats.totalExecutions - 1) + execution.tokensUsed) / stats.totalExecutions;
    stats.avgCost = (stats.avgCost * (stats.totalExecutions - 1) + execution.cost) / stats.totalExecutions;
    stats.avgQuality = (stats.avgQuality * (stats.totalExecutions - 1) + execution.quality) / stats.totalExecutions;

    if (execution.userRating !== null) {
      const currentRating = stats.avgUserRating || 0;
      const ratingCount = stats.userRating ? 1 : 0;
      stats.avgUserRating = (currentRating * ratingCount + execution.userRating) / (ratingCount + 1);
    }

    // Update task stats
    if (!this.history.taskStats[taskType]) {
      this.history.taskStats[taskType] = {
        totalExecutions: 0,
        successCount: 0,
        bestAgent: null,
        bestAgentScore: 0
      };
    }

    const taskStats = this.history.taskStats[taskType];
    taskStats.totalExecutions++;
    if (execution.success) {
      taskStats.successCount++;
    }

    this.saveHistory();
    this.performanceMetrics = this.calculateMetrics();
  }

  /**
   * Calculate performance metrics
   */
  calculateMetrics() {
    const metrics = {
      agentScores: {},
      taskSuccessRates: {},
      agentReliability: {},
      agentEfficiency: {}
    };

    // Calculate agent scores
    for (const [agentId, stats] of Object.entries(this.history.agentStats)) {
      const successRate = stats.totalExecutions > 0 ? stats.successCount / stats.totalExecutions : 0;
      const reliability = successRate;
      const efficiency = 1 / (1 + stats.avgExecutionTime / 1000); // Normalize execution time
      const quality = stats.avgQuality;
      const userSatisfaction = stats.avgUserRating || 0.5;

      // Weighted score
      const score = (
        reliability * 0.3 +
        efficiency * 0.2 +
        quality * 0.3 +
        userSatisfaction * 0.2
      );

      metrics.agentScores[agentId] = score;
      metrics.agentReliability[agentId] = reliability;
      metrics.agentEfficiency[agentId] = efficiency;
    }

    // Calculate task success rates
    for (const [taskType, stats] of Object.entries(this.history.taskStats)) {
      const successRate = stats.totalExecutions > 0 ? stats.successCount / stats.totalExecutions : 0;
      metrics.taskSuccessRates[taskType] = successRate;
    }

    return metrics;
  }

  /**
   * Get best agents for task type
   */
  getBestAgentsForTask(taskType, topN = 3) {
    const relevantExecutions = this.history.executions.filter(e => e.taskType === taskType);
    
    if (relevantExecutions.length === 0) {
      return []; // No history for this task type
    }

    // Group by agent and calculate scores
    const agentScores = {};
    for (const execution of relevantExecutions) {
      if (!agentScores[execution.agentId]) {
        agentScores[execution.agentId] = {
          agentId: execution.agentId,
          executions: 0,
          successes: 0,
          avgQuality: 0,
          avgTime: 0,
          avgCost: 0
        };
      }

      const score = agentScores[execution.agentId];
      score.executions++;
      if (execution.success) score.successes++;
      score.avgQuality = (score.avgQuality * (score.executions - 1) + execution.quality) / score.executions;
      score.avgTime = (score.avgTime * (score.executions - 1) + execution.executionTime) / score.executions;
      score.avgCost = (score.avgCost * (score.executions - 1) + execution.cost) / score.executions;
    }

    // Calculate composite score
    const scoredAgents = Object.values(agentScores).map(agent => ({
      ...agent,
      successRate: agent.executions > 0 ? agent.successes / agent.executions : 0,
      compositeScore: (
        (agent.successes / agent.executions) * 0.4 +
        agent.avgQuality * 0.3 +
        (1 / (1 + agent.avgTime / 1000)) * 0.2 +
        (1 / (1 + agent.avgCost)) * 0.1
      )
    }));

    // Sort by composite score and return top N
    return scoredAgents
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .slice(0, topN);
  }

  /**
   * Predict best agent for new task
   */
  predictBestAgent(taskType, taskDescription = '') {
    const bestAgents = this.getBestAgentsForTask(taskType, 1);
    
    if (bestAgents.length > 0) {
      return {
        agentId: bestAgents[0].agentId,
        confidence: bestAgents[0].compositeScore,
        reason: `Based on ${bestAgents[0].executions} previous executions with ${Math.round(bestAgents[0].successRate * 100)}% success rate`
      };
    }

    return {
      agentId: null,
      confidence: 0,
      reason: 'No historical data for this task type'
    };
  }

  /**
   * Get agent performance summary
   */
  getAgentPerformance(agentId) {
    const stats = this.history.agentStats[agentId];
    if (!stats) {
      return null;
    }

    const successRate = stats.totalExecutions > 0 ? stats.successCount / stats.totalExecutions : 0;
    const score = this.performanceMetrics.agentScores[agentId] || 0;

    return {
      agentId: agentId,
      totalExecutions: stats.totalExecutions,
      successRate: Math.round(successRate * 100) + '%',
      failureRate: Math.round((1 - successRate) * 100) + '%',
      avgExecutionTime: Math.round(stats.avgExecutionTime) + 'ms',
      avgTokensUsed: Math.round(stats.avgTokensUsed),
      avgCost: '$' + stats.avgCost.toFixed(4),
      avgQuality: Math.round(stats.avgQuality * 100) + '%',
      avgUserRating: stats.avgUserRating ? Math.round(stats.avgUserRating * 10) / 10 : 'N/A',
      overallScore: Math.round(score * 100) + '%'
    };
  }

  /**
   * Get learning insights
   */
  getLearningInsights() {
    const insights = {
      totalExecutions: this.history.executions.length,
      totalAgents: Object.keys(this.history.agentStats).length,
      totalTaskTypes: Object.keys(this.history.taskStats).length,
      topPerformers: [],
      bottomPerformers: [],
      mostReliableForTaskType: {},
      recommendations: []
    };

    // Get top and bottom performers
    const agentScores = Object.entries(this.performanceMetrics.agentScores)
      .sort((a, b) => b[1] - a[1]);

    insights.topPerformers = agentScores.slice(0, 3).map(([agentId, score]) => ({
      agentId: agentId,
      score: Math.round(score * 100) + '%'
    }));

    insights.bottomPerformers = agentScores.slice(-3).map(([agentId, score]) => ({
      agentId: agentId,
      score: Math.round(score * 100) + '%'
    }));

    // Get most reliable agent for each task type
    for (const [taskType, stats] of Object.entries(this.history.taskStats)) {
      const bestAgents = this.getBestAgentsForTask(taskType, 1);
      if (bestAgents.length > 0) {
        insights.mostReliableForTaskType[taskType] = {
          agentId: bestAgents[0].agentId,
          successRate: Math.round(bestAgents[0].successRate * 100) + '%'
        };
      }
    }

    // Generate recommendations
    if (insights.totalExecutions > 10) {
      const avgSuccessRate = this.history.executions.filter(e => e.success).length / this.history.executions.length;
      
      if (avgSuccessRate < 0.7) {
        insights.recommendations.push('Consider adding more diverse agents to improve success rate');
      }

      const slowAgents = Object.entries(this.history.agentStats)
        .filter(([_, stats]) => stats.avgExecutionTime > 5000)
        .map(([agentId, _]) => agentId);

      if (slowAgents.length > 0) {
        insights.recommendations.push(`Agents ${slowAgents.join(', ')} are slow. Consider using faster alternatives.`);
      }
    }

    return insights;
  }

  /**
   * Display learning insights
   */
  displayInsights() {
    const insights = this.getLearningInsights();

    console.log('\n📊 Learning-Based Routing Insights\n');
    console.log('═'.repeat(80));

    console.log(`\n📈 Statistics:`);
    console.log(`   Total Executions: ${insights.totalExecutions}`);
    console.log(`   Total Agents: ${insights.totalAgents}`);
    console.log(`   Total Task Types: ${insights.totalTaskTypes}`);

    console.log(`\n🏆 Top Performers:`);
    insights.topPerformers.forEach((agent, index) => {
      console.log(`   ${index + 1}. ${agent.agentId} (${agent.score})`);
    });

    console.log(`\n📉 Bottom Performers:`);
    insights.bottomPerformers.forEach((agent, index) => {
      console.log(`   ${index + 1}. ${agent.agentId} (${agent.score})`);
    });

    if (Object.keys(insights.mostReliableForTaskType).length > 0) {
      console.log(`\n🎯 Most Reliable Agents by Task Type:`);
      for (const [taskType, agent] of Object.entries(insights.mostReliableForTaskType)) {
        console.log(`   ${taskType}: ${agent.agentId} (${agent.successRate})`);
      }
    }

    if (insights.recommendations.length > 0) {
      console.log(`\n💡 Recommendations:`);
      insights.recommendations.forEach(rec => {
        console.log(`   • ${rec}`);
      });
    }

    console.log('\n' + '═'.repeat(80));
  }

  /**
   * Display agent performance
   */
  displayAgentPerformance(agentId) {
    const performance = this.getAgentPerformance(agentId);

    if (!performance) {
      console.log(`\n❌ No data found for agent: ${agentId}\n`);
      return;
    }

    console.log(`\n📊 Agent Performance: ${agentId}\n`);
    console.log('═'.repeat(80));

    console.log(`Total Executions: ${performance.totalExecutions}`);
    console.log(`Success Rate: ${performance.successRate}`);
    console.log(`Failure Rate: ${performance.failureRate}`);
    console.log(`Avg Execution Time: ${performance.avgExecutionTime}`);
    console.log(`Avg Tokens Used: ${performance.avgTokensUsed}`);
    console.log(`Avg Cost: ${performance.avgCost}`);
    console.log(`Avg Quality: ${performance.avgQuality}`);
    console.log(`Avg User Rating: ${performance.avgUserRating}`);
    console.log(`Overall Score: ${performance.overallScore}`);

    console.log('\n' + '═'.repeat(80));
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.history = {
      executions: [],
      agentStats: {},
      taskStats: {},
      lastUpdated: new Date().toISOString()
    };
    this.saveHistory();
    this.performanceMetrics = this.calculateMetrics();
  }
}

module.exports = LearningBasedRouter;

// CLI usage
if (require.main === module) {
  const router = new LearningBasedRouter();

  console.log('\n🤖 Learning-Based Routing System\n');

  // Simulate some execution history
  const sampleExecutions = [
    { agentId: 'gpt-4-turbo', taskType: 'backend', success: true, executionTime: 2000, tokensUsed: 500, cost: 0.01, quality: 0.9, userRating: 5 },
    { agentId: 'gpt-4o', taskType: 'frontend', success: true, executionTime: 1500, tokensUsed: 400, cost: 0.005, quality: 0.85, userRating: 4 },
    { agentId: 'claude-3-opus', taskType: 'backend', success: true, executionTime: 2500, tokensUsed: 600, cost: 0.015, quality: 0.95, userRating: 5 },
    { agentId: 'gpt-3.5-turbo', taskType: 'frontend', success: false, executionTime: 1000, tokensUsed: 200, cost: 0.001, quality: 0.6, userRating: 2 }
  ];

  console.log('Recording sample executions...\n');
  sampleExecutions.forEach(exec => {
    router.recordExecution(exec.agentId, exec.taskType, exec);
  });

  // Display insights
  router.displayInsights();

  // Display individual agent performance
  console.log('\n');
  router.displayAgentPerformance('gpt-4-turbo');
  router.displayAgentPerformance('gpt-4o');
}

#!/usr/bin/env node

/**
 * Cost Optimization & Performance Benchmarking
 * 
 * Features:
 * - Cost tracking and analysis
 * - Performance benchmarking
 * - Agent efficiency scoring
 * - Cost optimization recommendations
 * - Budget management
 */

const fs = require('fs-extra');
const path = require('path');

class CostOptimizationEngine {
  constructor(dataDir = null) {
    this.dataDir = dataDir || path.join(process.env.HOME, '.ai-brain', '.cost-data');
    this.costData = this.loadCostData();
    this.benchmarks = this.loadBenchmarks();
    
    fs.ensureDirSync(this.dataDir);
  }

  /**
   * Load cost data from disk
   */
  loadCostData() {
    try {
      const dataPath = path.join(this.dataDir, 'cost-data.json');
      if (fs.existsSync(dataPath)) {
        return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      }
    } catch (error) {
      console.warn(`Could not load cost data: ${error.message}`);
    }

    return {
      executions: [],
      totalCost: 0,
      totalTokens: 0,
      byAgent: {},
      byPlatform: {},
      byTaskType: {},
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Save cost data to disk
   */
  saveCostData() {
    try {
      const dataPath = path.join(this.dataDir, 'cost-data.json');
      this.costData.lastUpdated = new Date().toISOString();
      fs.writeFileSync(dataPath, JSON.stringify(this.costData, null, 2));
      return true;
    } catch (error) {
      console.error(`Could not save cost data: ${error.message}`);
      return false;
    }
  }

  /**
   * Load benchmarks from disk
   */
  loadBenchmarks() {
    try {
      const benchPath = path.join(this.dataDir, 'benchmarks.json');
      if (fs.existsSync(benchPath)) {
        return JSON.parse(fs.readFileSync(benchPath, 'utf-8'));
      }
    } catch (error) {
      console.warn(`Could not load benchmarks: ${error.message}`);
    }

    return {
      agents: {},
      platforms: {},
      taskTypes: {}
    };
  }

  /**
   * Save benchmarks to disk
   */
  saveBenchmarks() {
    try {
      const benchPath = path.join(this.dataDir, 'benchmarks.json');
      fs.writeFileSync(benchPath, JSON.stringify(this.benchmarks, null, 2));
      return true;
    } catch (error) {
      console.error(`Could not save benchmarks: ${error.message}`);
      return false;
    }
  }

  /**
   * Record execution cost
   */
  recordExecution(agentId, platform, taskType, metrics) {
    const execution = {
      timestamp: new Date().toISOString(),
      agentId: agentId,
      platform: platform,
      taskType: taskType,
      tokensUsed: metrics.tokensUsed || 0,
      cost: metrics.cost || 0,
      executionTime: metrics.executionTime || 0,
      quality: metrics.quality || 0.5,
      success: metrics.success || false
    };

    this.costData.executions.push(execution);
    this.costData.totalCost += execution.cost;
    this.costData.totalTokens += execution.tokensUsed;

    // Update agent stats
    if (!this.costData.byAgent[agentId]) {
      this.costData.byAgent[agentId] = {
        executions: 0,
        totalCost: 0,
        totalTokens: 0,
        avgCost: 0,
        avgTokens: 0,
        avgTime: 0
      };
    }

    const agentStats = this.costData.byAgent[agentId];
    agentStats.executions++;
    agentStats.totalCost += execution.cost;
    agentStats.totalTokens += execution.tokensUsed;
    agentStats.avgCost = agentStats.totalCost / agentStats.executions;
    agentStats.avgTokens = agentStats.totalTokens / agentStats.executions;
    agentStats.avgTime = (agentStats.avgTime * (agentStats.executions - 1) + execution.executionTime) / agentStats.executions;

    // Update platform stats
    if (!this.costData.byPlatform[platform]) {
      this.costData.byPlatform[platform] = {
        executions: 0,
        totalCost: 0,
        avgCost: 0
      };
    }

    const platformStats = this.costData.byPlatform[platform];
    platformStats.executions++;
    platformStats.totalCost += execution.cost;
    platformStats.avgCost = platformStats.totalCost / platformStats.executions;

    // Update task type stats
    if (!this.costData.byTaskType[taskType]) {
      this.costData.byTaskType[taskType] = {
        executions: 0,
        totalCost: 0,
        avgCost: 0
      };
    }

    const taskStats = this.costData.byTaskType[taskType];
    taskStats.executions++;
    taskStats.totalCost += execution.cost;
    taskStats.avgCost = taskStats.totalCost / taskStats.executions;

    this.saveCostData();
  }

  /**
   * Calculate cost efficiency score
   */
  calculateEfficiencyScore(agentId) {
    const agentStats = this.costData.byAgent[agentId];
    if (!agentStats) {
      return 0;
    }

    // Lower cost = higher score
    const costScore = Math.max(0, 1 - (agentStats.avgCost / 0.1)); // Normalize to $0.1
    
    // Faster execution = higher score
    const timeScore = Math.max(0, 1 - (agentStats.avgTime / 5000)); // Normalize to 5s

    // Composite score
    return (costScore * 0.6 + timeScore * 0.4) * 100;
  }

  /**
   * Get cost optimization recommendations
   */
  getOptimizationRecommendations() {
    const recommendations = [];

    // Find most expensive agents
    const agentsByAvgCost = Object.entries(this.costData.byAgent)
      .sort((a, b) => b[1].avgCost - a[1].avgCost)
      .slice(0, 3);

    if (agentsByAvgCost.length > 0) {
      const mostExpensive = agentsByAvgCost[0];
      recommendations.push({
        type: 'cost-reduction',
        priority: 'high',
        message: `Agent "${mostExpensive[0]}" has high average cost ($${mostExpensive[1].avgCost.toFixed(4)}). Consider using cheaper alternatives.`,
        savings: mostExpensive[1].totalCost * 0.3 // Potential 30% savings
      });
    }

    // Find slowest agents
    const agentsBySpeed = Object.entries(this.costData.byAgent)
      .sort((a, b) => b[1].avgTime - a[1].avgTime)
      .slice(0, 3);

    if (agentsBySpeed.length > 0) {
      const slowest = agentsBySpeed[0];
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: `Agent "${slowest[0]}" is slow (${slowest[1].avgTime.toFixed(0)}ms avg). Consider using faster alternatives.`,
        impact: 'Faster responses'
      });
    }

    // Find most cost-effective agents
    const efficiencyScores = Object.entries(this.costData.byAgent)
      .map(([agentId, stats]) => ({
        agentId,
        score: this.calculateEfficiencyScore(agentId)
      }))
      .sort((a, b) => b.score - a.score);

    if (efficiencyScores.length > 0) {
      const best = efficiencyScores[0];
      recommendations.push({
        type: 'best-practice',
        priority: 'medium',
        message: `Agent "${best.agentId}" is most cost-efficient (score: ${best.score.toFixed(0)}). Use it for similar tasks.`,
        impact: 'Optimize costs'
      });
    }

    return recommendations;
  }

  /**
   * Get budget analysis
   */
  getBudgetAnalysis(budgetLimit = null) {
    const analysis = {
      totalCost: this.costData.totalCost,
      totalExecutions: this.costData.executions.length,
      avgCostPerExecution: this.costData.executions.length > 0 ? this.costData.totalCost / this.costData.executions.length : 0,
      costByPlatform: this.costData.byPlatform,
      costByAgent: Object.entries(this.costData.byAgent).map(([agentId, stats]) => ({
        agentId,
        totalCost: stats.totalCost,
        executions: stats.executions,
        avgCost: stats.avgCost
      }))
    };

    if (budgetLimit) {
      analysis.budgetLimit = budgetLimit;
      analysis.remaining = budgetLimit - this.costData.totalCost;
      analysis.percentUsed = (this.costData.totalCost / budgetLimit * 100).toFixed(2);
      analysis.onTrack = this.costData.totalCost <= budgetLimit;
    }

    return analysis;
  }

  /**
   * Performance benchmark
   */
  performanceBenchmark(agents) {
    const benchmark = {
      timestamp: new Date().toISOString(),
      agents: {}
    };

    for (const agent of agents) {
      const agentStats = this.costData.byAgent[agent.id];
      
      if (agentStats) {
        benchmark.agents[agent.id] = {
          executions: agentStats.executions,
          avgCost: agentStats.avgCost,
          avgTime: agentStats.avgTime,
          avgTokens: agentStats.avgTokens,
          efficiencyScore: this.calculateEfficiencyScore(agent.id),
          costPerToken: agentStats.totalTokens > 0 ? agentStats.totalCost / agentStats.totalTokens : 0
        };
      }
    }

    this.benchmarks.agents[new Date().toISOString()] = benchmark;
    this.saveBenchmarks();

    return benchmark;
  }

  /**
   * Get cost trends
   */
  getCostTrends(days = 7) {
    const now = Date.now();
    const timeWindow = days * 24 * 60 * 60 * 1000;
    const startTime = now - timeWindow;

    const trends = {
      daily: {},
      total: 0,
      executions: 0
    };

    for (const execution of this.costData.executions) {
      const execTime = new Date(execution.timestamp).getTime();
      
      if (execTime >= startTime) {
        const date = new Date(execution.timestamp).toISOString().split('T')[0];
        
        if (!trends.daily[date]) {
          trends.daily[date] = {
            cost: 0,
            executions: 0,
            tokens: 0
          };
        }

        trends.daily[date].cost += execution.cost;
        trends.daily[date].executions++;
        trends.daily[date].tokens += execution.tokensUsed;
        trends.total += execution.cost;
        trends.executions++;
      }
    }

    return trends;
  }

  /**
   * Display cost analysis
   */
  displayCostAnalysis(budgetLimit = null) {
    const analysis = this.getBudgetAnalysis(budgetLimit);

    console.log('\n💰 Cost Analysis\n');
    console.log('═'.repeat(80));

    console.log(`Total Cost: $${analysis.totalCost.toFixed(4)}`);
    console.log(`Total Executions: ${analysis.totalExecutions}`);
    console.log(`Avg Cost per Execution: $${analysis.avgCostPerExecution.toFixed(4)}`);

    if (budgetLimit) {
      console.log(`\nBudget Limit: $${budgetLimit.toFixed(2)}`);
      console.log(`Remaining: $${analysis.remaining.toFixed(2)}`);
      console.log(`Used: ${analysis.percentUsed}%`);
      console.log(`Status: ${analysis.onTrack ? '✅ On Track' : '❌ Over Budget'}`);
    }

    console.log('\nCost by Platform:');
    for (const [platform, stats] of Object.entries(analysis.costByPlatform)) {
      console.log(`  ${platform}: $${stats.totalCost.toFixed(4)} (${stats.executions} executions)`);
    }

    console.log('\n' + '═'.repeat(80));
  }

  /**
   * Display recommendations
   */
  displayRecommendations() {
    const recommendations = this.getOptimizationRecommendations();

    console.log('\n💡 Optimization Recommendations\n');
    console.log('═'.repeat(80));

    if (recommendations.length === 0) {
      console.log('No recommendations at this time.');
    } else {
      recommendations.forEach((rec, index) => {
        console.log(`\n${index + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`);
        if (rec.savings) {
          console.log(`   Potential Savings: $${rec.savings.toFixed(4)}`);
        }
        if (rec.impact) {
          console.log(`   Impact: ${rec.impact}`);
        }
      });
    }

    console.log('\n' + '═'.repeat(80));
  }
}

module.exports = CostOptimizationEngine;

// CLI usage
if (require.main === module) {
  const engine = new CostOptimizationEngine();

  console.log('\n💰 Cost Optimization & Performance Benchmarking\n');

  // Record sample executions
  console.log('Recording sample executions...\n');
  
  const sampleExecutions = [
    { agentId: 'gpt-4-turbo', platform: 'openai', taskType: 'backend', metrics: { tokensUsed: 500, cost: 0.01, executionTime: 2000, quality: 0.9, success: true } },
    { agentId: 'gpt-4o', platform: 'openai', taskType: 'frontend', metrics: { tokensUsed: 400, cost: 0.005, executionTime: 1500, quality: 0.85, success: true } },
    { agentId: 'claude-3-opus', platform: 'anthropic', taskType: 'backend', metrics: { tokensUsed: 600, cost: 0.015, executionTime: 2500, quality: 0.95, success: true } },
    { agentId: 'gpt-3.5-turbo', platform: 'openai', taskType: 'frontend', metrics: { tokensUsed: 200, cost: 0.001, executionTime: 1000, quality: 0.6, success: true } }
  ];

  sampleExecutions.forEach(exec => {
    engine.recordExecution(exec.agentId, exec.platform, exec.taskType, exec.metrics);
    console.log(`✅ Recorded: ${exec.agentId} - ${exec.taskType}`);
  });

  // Display analysis
  engine.displayCostAnalysis(0.05);
  engine.displayRecommendations();

  console.log('\n✨ Cost Optimization Engine Ready!\n');
}

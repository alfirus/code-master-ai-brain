/**
 * Learning Mode Coordinator for Code Master
 * Accelerates learning through 90% delegation to specialized agents
 */

const { AIBrainAgent } = require('./agent-integration');
const { determineOptimalAgent } = require('./agent-decision');
const fs = require('fs');
const path = require('path');

class LearningModeCoordinator {
  constructor() {
    this.brain = null;
    this.learningMode = {
      active: false,
      period: { start: '2026-01-02', end: '2026-01-02' },
      delegationRate: 0.9, // 90% delegation
      learningPriority: 'maximum',
      primaryRole: 'coordinator-learner'
    };
    
    this.learningMetrics = {
      tasksProcessed: 0,
      solutionsLearned: 0,
      patternsExtracted: 0,
      agentPerformance: new Map(),
      satisfactionRate: 0,
      startTime: null,
      endTime: null
    };
    
    this.agentPerformance = new Map();
    this.initializeAgentPerformance();
  }

  initializeAgentPerformance() {
    this.agentPerformance.set('@claude-ai', {
      tasksCompleted: 0,
      averageSatisfaction: 0,
      strengths: ['complex-reasoning', 'detailed-analysis', 'documentation'],
      bestFor: ['architecture', 'code-review', 'complex-problems']
    });
    
    this.agentPerformance.set('@github-copilot-coder', {
      tasksCompleted: 0,
      averageSatisfaction: 0,
      strengths: ['code-generation', 'boilerplate', 'implementation'],
      bestFor: ['implementation', 'boilerplate', 'function-writing']
    });
    
    this.agentPerformance.set('@gemini-analyzer', {
      tasksCompleted: 0,
      averageSatisfaction: 0,
      strengths: ['data-analysis', 'pattern-recognition', 'optimization'],
      bestFor: ['analysis', 'performance-tuning', 'pattern-detection']
    });
    
    this.agentPerformance.set('@big-pickle-reasoner', {
      tasksCompleted: 0,
      averageSatisfaction: 0,
      strengths: ['complex-reasoning', 'strategic-thinking', 'multi-step'],
      bestFor: ['complex-reasoning', 'strategy', 'architecture-decisions']
    });
  }

  async initialize() {
    this.brain = new AIBrainAgent();
    await this.brain.initialize();
    
    // Check if we should be in learning mode
    const today = new Date();
    const learningDate = new Date('2026-01-02');
    
    if (today.toDateString() === learningDate.toDateString()) {
      await this.activateLearningMode();
    }
    
    console.log('🚀 Learning Mode Coordinator initialized');
  }

  async activateLearningMode() {
    this.learningMode.active = true;
    this.learningMetrics.startTime = new Date();
    
    console.log('🧠 LEARNING MODE ACTIVATED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📅 Period: ${this.learningMode.period.start} - ${this.learningMode.period.end}`);
    console.log(`🎯 Delegation Rate: ${this.learningMode.delegationRate * 100}%`);
    console.log(`🧠 Learning Priority: ${this.learningMode.learningPriority}`);
    console.log(`👥 My Role: ${this.learningMode.primaryRole}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  async processTask(task, requestedAgent = null) {
    await this.initialize();
    
    this.learningMetrics.tasksProcessed++;
    
    // Check if we should delegate (90% chance in learning mode)
    const shouldDelegate = this.learningMode.active && 
      (Math.random() < this.learningMode.delegationRate || requestedAgent);
    
    console.log(`📝 Task ${this.learningMetrics.tasksProcessed}: "${task}"`);
    console.log(`🎯 Decision: ${shouldDelegate ? 'Delegate' : 'Handle with Brain'}`);
    
    if (shouldDelegate) {
      return await this.delegateWithLearning(task, requestedAgent);
    } else {
      return await this.handleWithBrain(task);
    }
  }

  async delegateWithLearning(task, requestedAgent = null) {
    // Select optimal agent
    const agent = requestedAgent || determineOptimalAgent(task);
    
    console.log(`🤖 Delegating to: ${agent}`);
    
    // Simulate delegation (in real implementation, this would call the actual agent)
    const solution = await this.simulateAgentDelegation(task, agent);
    
    // Assess solution quality
    const quality = await this.assessSolutionQuality(solution);
    
    // Update agent performance
    this.updateAgentPerformance(agent, quality);
    
    // Learn from successful solution
    if (quality.satisfaction >= 4) {
      await this.learnFromSolution(task, solution, quality, agent);
    }
    
    // Log learning progress
    this.logLearningProgress(task, agent, quality);
    
    return {
      method: 'delegated-learning',
      agent,
      solution,
      quality,
      learning: this.learningMetrics
    };
  }

  async handleWithBrain(task) {
    console.log('🧠 Handling with brain-enhanced Code Master');
    
    const context = this.enhanceContextForLearning(task);
    const suggestions = await this.brain.suggestSkills(context);
    
    if (suggestions.length > 0) {
      const skill = await this.brain.getSkill(suggestions[0].name);
      const appliedSkill = await this.brain.applySkill(suggestions[0].name, context);
      
      return {
        method: 'brain-enhanced',
        skill: suggestions[0].name,
        solution: appliedSkill.processedContent,
        confidence: 0.8 + (suggestions[0].relevance * 0.05)
      };
    }
    
    return {
      method: 'code-master-default',
      task,
      confidence: 0.6
    };
  }

  async simulateAgentDelegation(task, agent) {
    // Simulate agent response (in real implementation, this calls actual agent APIs)
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200)); // Simulate processing time
    
    const responses = {
      '@claude-ai': {
        solution: `Claude AI detailed solution for: ${task}`,
        reasoning: 'Complex analysis with step-by-step breakdown',
        confidence: 0.9,
        timeToSolve: 5 + Math.random() * 10
      },
      '@github-copilot-coder': {
        solution: `GitHub Copilot implementation for: ${task}`,
        reasoning: 'Code generation with best practices',
        confidence: 0.85,
        timeToSolve: 2 + Math.random() * 5
      },
      '@gemini-analyzer': {
        solution: `Gemini analysis for: ${task}`,
        reasoning: 'Data-driven analysis and optimization',
        confidence: 0.88,
        timeToSolve: 3 + Math.random() * 7
      },
      '@big-pickle-reasoner': {
        solution: `Big Pickle reasoning for: ${task}`,
        reasoning: 'Strategic multi-step problem solving',
        confidence: 0.92,
        timeToSolve: 8 + Math.random() * 12
      }
    };
    
    return responses[agent] || responses['@claude-ai'];
  }

  async assessSolutionQuality(solution) {
    // Simulate quality assessment (in real implementation, this gets user feedback)
    const satisfaction = 3 + Math.floor(Math.random() * 3); // 3-5 rating
    
    return {
      satisfaction,
      quality: satisfaction >= 4 ? 'high' : 'medium',
      confidence: solution.confidence,
      timeToSolve: solution.timeToSolve,
      aspects: {
        accuracy: satisfaction >= 4,
        completeness: satisfaction >= 4,
        clarity: satisfaction >= 3,
        practicality: satisfaction >= 4
      }
    };
  }

  async learnFromSolution(task, solution, quality, agent) {
    if (quality.satisfaction < 4) return; // Only learn from high-quality solutions
    
    // Create new skill from solution
    const skillName = `learned-${agent}-${task.substring(0, 15).replace(/\s+/g, '-')}-${Date.now()}`;
    const skillContent = this.formatSkillContent(task, solution, quality, agent);
    
    try {
      await this.brain.brain.addSkill(skillName, skillContent);
      
      this.learningMetrics.solutionsLearned++;
      this.learningMetrics.patternsExtracted++;
      
      console.log(`🧠 New Skill Learned: ${skillName}`);
      console.log(`📚 Total Skills Learned: ${this.learningMetrics.solutionsLearned}`);
      
      // Save learning log
      await this.saveLearningLog(task, agent, solution, quality, skillName);
      
    } catch (error) {
      console.error('❌ Failed to learn from solution:', error.message);
    }
  }

  formatSkillContent(task, solution, quality, agent) {
    return `# Learned Skill from ${agent}

## Original Task
${task}

## Agent Solution
${solution.solution}

## Agent Reasoning
${solution.reasoning}

## Quality Assessment
- Satisfaction: ${quality.satisfaction}/5
- Confidence: ${quality.confidence}
- Time to Solve: ${Math.round(solution.timeToSolve)}s
- Quality Level: ${quality.quality}

## Extracted Patterns
- Problem Type: ${this.classifyProblemType(task)}
- Solution Approach: ${this.extractSolutionApproach(solution)}
- Success Factors: ${this.identifySuccessFactors(solution, quality)}

## Learning Meta
- Generated: ${new Date().toISOString()}
- Agent: ${agent}
- Mode: Learning Mode (90% delegation)
- Learning Coordinator: Code Master

---
*This skill was auto-generated during accelerated learning phase*
`;
  }

  classifyProblemType(task) {
    const taskLower = task.toLowerCase();
    
    if (taskLower.includes('architecture') || taskLower.includes('design')) return 'architecture';
    if (taskLower.includes('implement') || taskLower.includes('code')) return 'implementation';
    if (taskLower.includes('analyze') || taskLower.includes('optimize')) return 'analysis';
    if (taskLower.includes('debug') || taskLower.includes('fix')) return 'debugging';
    if (taskLower.includes('review') || taskLower.includes('quality')) return 'review';
    
    return 'general';
  }

  extractSolutionApproach(solution) {
    if (solution.reasoning.includes('step-by-step')) return 'methodical';
    if (solution.reasoning.includes('code generation')) return 'generation';
    if (solution.reasoning.includes('data-driven')) return 'analytical';
    if (solution.reasoning.includes('strategic')) return 'strategic';
    
    return 'unknown';
  }

  identifySuccessFactors(solution, quality) {
    const factors = [];
    
    if (quality.confidence > 0.85) factors.push('high-confidence');
    if (solution.timeToSolve < 5) factors.push('fast-resolution');
    if (quality.satisfaction >= 4) factors.push('high-satisfaction');
    
    return factors.join(', ') || 'standard';
  }

  updateAgentPerformance(agent, quality) {
    const perf = this.agentPerformance.get(agent);
    if (perf) {
      perf.tasksCompleted++;
      perf.averageSatisfaction = ((perf.averageSatisfaction * (perf.tasksCompleted - 1)) + quality.satisfaction) / perf.tasksCompleted;
    }
  }

  logLearningProgress(task, agent, quality) {
    const progress = `
📚 LEARNING PROGRESS UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Task: "${task}"
🤖 Agent: ${agent}
⭐ Satisfaction: ${quality.satisfaction}/5
📊 Total Tasks: ${this.learningMetrics.tasksProcessed}
🧠 Skills Learned: ${this.learningMetrics.solutionsLearned}
🎯 Learning Rate: ${(this.learningMetrics.solutionsLearned / this.learningMetrics.tasksProcessed * 100).toFixed(1)}%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
    
    console.log(progress);
  }

  async saveLearningLog(task, agent, solution, quality, skillName) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      task,
      agent,
      solution: solution.solution,
      quality,
      skillName,
      learningMode: true
    };
    
    const logPath = path.join(process.env.AI_BRAIN_PATH || '~/.ai-brain', 'learning-logs', '2026-01');
    
    // Ensure directory exists
    if (!fs.existsSync(logPath)) {
      fs.mkdirSync(logPath, { recursive: true });
    }
    
    const logFile = path.join(logPath, `learning-${new Date().toISOString().split('T')[0]}.json`);
    let logs = [];
    
    if (fs.existsSync(logFile)) {
      logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    }
    
    logs.push(logEntry);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  }

  enhanceContextForLearning(task) {
    return {
      task,
      learningMode: this.learningMode.active,
      delegationRate: this.learningMode.delegationRate,
      agentPerformance: Object.fromEntries(this.agentPerformance),
      learningMetrics: this.learningMetrics
    };
  }

  getLearningStatus() {
    return {
      mode: this.learningMode.active ? 'learning' : 'normal',
      metrics: this.learningMetrics,
      agentPerformance: Object.fromEntries(this.agentPerformance),
      period: this.learningMode.period
    };
  }

  async switchToNormalMode() {
    this.learningMode.active = false;
    this.learningMetrics.endTime = new Date();
    
    console.log('✅ SWITCHING TO NORMAL MODE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🧠 Skills Learned During Learning: ${this.learningMetrics.solutionsLearned}`);
    console.log(`📊 Tasks Processed: ${this.learningMetrics.tasksProcessed}`);
    console.log(`📈 Learning Rate: ${(this.learningMetrics.solutionsLearned / this.learningMetrics.tasksProcessed * 100).toFixed(1)}%`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Save learning summary
    await this.saveLearningSummary();
    
    return this.getLearningStatus();
  }

  async saveLearningSummary() {
    const summary = {
      period: this.learningMode.period,
      startTime: this.learningMetrics.startTime,
      endTime: this.learningMetrics.endTime,
      totalTasks: this.learningMetrics.tasksProcessed,
      skillsLearned: this.learningMetrics.solutionsLearned,
      patternsExtracted: this.learningMetrics.patternsExtracted,
      agentPerformance: Object.fromEntries(this.agentPerformance),
      learningEffectiveness: (this.learningMetrics.solutionsLearned / this.learningMetrics.tasksProcessed * 100).toFixed(1) + '%'
    };
    
    const summaryPath = path.join(process.env.AI_BRAIN_PATH || '~/.ai-brain', 'learning-summary-2026-01-02.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    console.log(`📄 Learning summary saved to: ${summaryPath}`);
  }
}

module.exports = { LearningModeCoordinator };
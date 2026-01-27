/**
 * Code Master AI Brain Integration
 * How Code Master uses .ai-brain as default brain with learning mode
 */

const { AIBrainAgent } = require('./install/agent-integration');

// Simple agent decision function
function determineOptimalAgent(task) {
  const taskLower = task.toLowerCase();
  
  // Claude AI for complex reasoning and detailed analysis
  if (taskLower.includes('complex') || 
      taskLower.includes('architecture') ||
      taskLower.includes('detailed') ||
      taskLower.includes('explain') ||
      taskLower.includes('review') ||
      taskLower.includes('strategic') ||
      taskLower.includes('debugging')) {
    return '@claude-ai';
  }
  
  // GitHub Copilot for code implementation
  if (taskLower.includes('write') || 
      taskLower.includes('implement') ||
      taskLower.includes('boilerplate')) {
    return '@github-copilot-coder';
  }
  
  // Gemini for data analysis and optimization
  if (taskLower.includes('analyze') || 
      taskLower.includes('optimize') ||
      taskLower.includes('pattern') ||
      taskLower.includes('performance')) {
    return '@gemini-analyzer';
  }
  
  // Explore for codebase search
  if (taskLower.includes('search') || 
      taskLower.includes('explore')) {
    return '@explore';
  }
  
  // General for research and broad questions
  if (taskLower.includes('research') || 
      taskLower.includes('general')) {
    return '@general';
  }
  
  return 'Code Master Core';
}

class CodeMasterBrain {
  constructor() {
    this.brain = null;
    this.initialized = false;
    this.learningMode = false;
  }

  async initialize() {
    if (!this.initialized) {
      console.log('🧠 Initializing Code Master with AI Brain...');
      this.brain = new AIBrainAgent({
        brainPath: process.env.AI_BRAIN_PATH || null,
        autoLoad: true,
        contextAware: true
      });
      this.initialized = await this.brain.initialize();
      
      if (this.initialized) {
        console.log('✅ Code Master AI Brain integration ready');
        // Setup global access
        if (typeof global !== 'undefined') {
          global.codeMasterBrain = this;
        }
      }
    }
    return this.initialized;
  }

  // Core solving method with learning mode support
  async solve(problem, context = {}) {
    await this.initialize();
    
    console.log(`🎯 Code Master solving: "${problem}"`);
    
    // Check if we're in learning mode and delegate accordingly
    if (this.learningMode) {
      return await this.delegateWithLearningMode(problem);
    }
    
    // Extract context from problem
    const enhancedContext = this.enhanceContext(problem, context);
    
    // Get brain suggestions
    const suggestions = await this.brain.suggestSkills(enhancedContext);
    
    if (suggestions.length > 0) {
      console.log(`💡 Brain suggests: ${suggestions[0].name}`);
      const solution = await this.applyBrainSolution(problem, suggestions[0]);
      return solution;
    }
    
    // Fallback to default Code Master logic
    return this.defaultSolve(problem, enhancedContext);
  }

  // Learning mode delegation
  async delegateWithLearningMode(problem) {
    // 90% chance to delegate in learning mode
    const shouldDelegate = Math.random() < 0.9;
    
    if (shouldDelegate) {
      const agent = determineOptimalAgent(problem);
      console.log(`🔄 Learning Mode: Delegating to ${agent}: "${problem}"`);
      
      // Simulate delegation and learning
      const solution = await this.simulateAgentDelegation(problem, agent);
      
      // Learn from the solution
      await this.learnFromAgentSolution(problem, solution, agent);
      
      return {
        method: 'learning-mode-delegation',
        agent,
        solution,
        confidence: 0.85 + (Math.random() * 0.1),
        sources: [`Learning mode delegation to ${agent}`]
      };
    }
    
    // 10% chance to handle with brain
    console.log('🧠 Learning Mode: Using brain enhancement');
    return await this.handleWithBrain(problem);
  }

  async simulateAgentDelegation(problem, agent) {
    // Simulate agent response
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    const responses = {
      '@claude-ai': {
        solution: `Claude AI detailed solution for: ${problem}`,
        reasoning: 'Complex analysis with step-by-step breakdown',
        confidence: 0.9,
        timeToSolve: 5 + Math.random() * 10
      },
      '@github-copilot-coder': {
        solution: `GitHub Copilot implementation for: ${problem}`,
        reasoning: 'Code generation with best practices',
        confidence: 0.85,
        timeToSolve: 2 + Math.random() * 5
      },
      '@gemini-analyzer': {
        solution: `Gemini analysis for: ${problem}`,
        reasoning: 'Data-driven analysis and optimization',
        confidence: 0.88,
        timeToSolve: 3 + Math.random() * 7
      }
    };
    
    return responses[agent] || responses['@claude-ai'];
  }

  async learnFromAgentSolution(problem, solution, agent) {
    // Always learn from agent solutions in learning mode
    const skillName = `learned-${agent}-${problem.substring(0, 15).replace(/\s+/g, '-')}-${Date.now()}`;
    const skillContent = `# Learned Skill from ${agent}

## Problem
${problem}

## Agent Solution
${solution.solution}

## Agent Reasoning
${solution.reasoning}

## Learning Context
- Agent: ${agent}
- Confidence: ${solution.confidence}
- Mode: Learning Mode (90% delegation)
- Generated: ${new Date().toISOString()}

---

*This skill was auto-generated during accelerated learning phase*
`;

    try {
      await this.brain.addSkill(skillName, skillContent);
      console.log(`🧠 Learned new skill: ${skillName}`);
    } catch (error) {
      console.error('❌ Failed to learn from agent solution:', error.message);
    }
  }

  async handleWithBrain(problem) {
    const context = this.enhanceContext(problem, {});
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
      task: problem,
      confidence: 0.6
    };
  }

  // Enhanced delegation with brain awareness
  async delegate(task, subagent = null) {
    await this.initialize();
    
    // If no subagent specified, determine optimal agent
    if (!subagent) {
      subagent = determineOptimalAgent(task);
    }
    
    console.log(`🔄 Code Master delegating to ${subagent}: "${task}"`);
    
    // Check if brain has relevant knowledge for this delegation
    const context = this.enhanceContext(task, { subagent });
    const suggestions = await this.brain.suggestSkills(context);
    
    // Enhanced delegation with agent-specific context
    let agentContext = {};
    switch (subagent) {
      case '@claude-ai':
        agentContext = {
          type: 'conversational-ai',
          strengths: ['complex-reasoning', 'creative-problem-solving', 'detailed-explanations'],
          specialties: ['analysis', 'writing', 'problem-solving', 'code-review'],
          communication_style: 'detailed-methodical',
          best_for: ['complex-problems', 'architectural-decisions', 'code-analysis', 'documentation']
        };
        break;
      case '@gemini-analyzer':
        agentContext = {
          type: 'analytical-ai',
          strengths: ['data-analysis', 'pattern-recognition', 'performance-optimization'],
          specialties: ['analysis', 'optimization', 'pattern-matching'],
          communication_style: 'analytical-precise',
          best_for: ['code-analysis', 'performance-tuning', 'pattern-detection']
        };
        break;
      case '@github-copilot-coder':
        agentContext = {
          type: 'code-generation-ai',
          strengths: ['code-generation', 'boilerplate', 'implementation'],
          specialties: ['implementation', 'boilerplate', 'code-writing'],
          communication_style: 'code-focused',
          best_for: ['code-implementation', 'boilerplate', 'function-writing']
        };
        break;
      case '@big-pickle-reasoner':
        agentContext = {
          type: 'reasoning-ai',
          strengths: ['complex-reasoning', 'multi-step-problem-solving', 'strategic-thinking'],
          specialties: ['reasoning', 'strategy', 'complex-analysis'],
          communication_style: 'logical-structured',
          best_for: ['complex-reasoning', 'architecture-decisions', 'strategy']
        };
        break;
      default:
        agentContext = { type: 'general-ai' };
    }
    
    if (suggestions.length > 0) {
      console.log(`🧠 Brain enhanced delegation: using ${suggestions[0].name}`);
      
      // Provide brain context to subagent
      const skill = await this.brain.getSkill(suggestions[0].name);
      return {
        task,
        subagent,
        agentContext,
        brainContext: {
          skill: suggestions[0].name,
          relevance: suggestions[0].relevance,
          content: skill.content
        }
      };
    }
    
    return { task, subagent, agentContext };
  }

  // Learning from interactions
  async learn(problem, solution, feedback) {
    await this.initialize();
    
    if (feedback.rating >= 4) {
      // Create new skill from successful solutions
      const skillName = this.generateSkillName(problem);
      const skillContent = this.formatSkillContent(problem, solution);
      
      console.log(`📚 Code Master learning: creating skill ${skillName}`);
      await this.brain.brain.addSkill(skillName, skillContent);
      
      return {
        learned: true,
        skillName,
        message: 'Successfully learned from this interaction'
      };
    }
    
    return { learned: false, message: 'Solution not strong enough to learn from' };
  }

  // Toggle learning mode
  toggleLearningMode(enable) {
    this.learningMode = enable;
    const mode = enable ? 'ON' : 'OFF';
    console.log(`🧠 Learning Mode ${mode}`);
    
    if (enable) {
      console.log('🚀 Ready to delegate 90% to specialized agents');
      console.log('🤖 Focus: Learning and brain enhancement');
      console.log('🧠 Goal: Accelerated knowledge acquisition');
    } else {
      console.log('🧠 Returning to normal operation');
      console.log('🎯 Goal: Enhanced problem-solving with learned knowledge');
      console.log('🤖 Delegation: Strategic usage when needed');
    }
    
    return {
      learningMode: this.learningMode,
      status: `Learning mode ${mode}`
    };
  }

  generateSkillName(problem) {
    const words = problem.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .slice(0, 3);
    
    return `code-master-${words.join('-')}-${Date.now()}`;
  }

  formatSkillContent(problem, solution) {
    return `# Code Master Learned Skill: ${problem}

## Problem
${problem}

## Solution
${JSON.stringify(solution, null, 2)}

## Generated by Code Master AI Brain
Date: ${new Date().toISOString()}
Source: Code Master Learning System
`;
  }

  enhanceContext(problem, userContext) {
    const context = { ...userContext };
    
    // Auto-detect technology from problem
    const techKeywords = {
      'react': 'react',
      'react-native': 'react-native', 
      'next': 'nextjs',
      'vue': 'vue',
      'angular': 'angular',
      'node': 'nodejs',
      'python': 'python',
      'typescript': 'typescript',
      'javascript': 'javascript'
    };
    
    Object.keys(techKeywords).forEach(keyword => {
      if (problem.toLowerCase().includes(keyword)) {
        context.technology = techKeywords[keyword];
      }
    });
    
    // Auto-detect task type
    const taskKeywords = {
      'deploy': 'deployment',
      'optimize': 'optimization',
      'performance': 'performance',
      'debug': 'debugging',
      'test': 'testing',
      'build': 'build',
      'implement': 'implementation'
    };
    
    Object.keys(taskKeywords).forEach(keyword => {
      if (problem.toLowerCase().includes(keyword)) {
        context.task = taskKeywords[keyword];
      }
    });
    
    return context;
  }

  generateCodeSolution(skillContent, problem) {
    // Extract relevant code patterns from skill content
    const codeBlocks = skillContent.match(/```[\s\S]*?```/g) || [];
    const relevantSections = this.findRelevantSections(skillContent, problem);
    
    return {
      code: this.selectBestCodeBlock(codeBlocks, problem),
      explanation: this.extractExplanation(skillContent, problem),
      references: relevantSections,
      approach: 'brain-powered-code-generation'
    };
  }

  findRelevantSections(content, problem) {
    const keywords = problem.toLowerCase().split(' ').filter(word => word.length > 3);
    const sections = [];
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`.{0,100}${keyword}.{0,100}`, 'gi');
      const matches = content.match(regex) || [];
      sections.push(...matches.slice(0, 2));
    });
    
    return [...new Set(sections)];
  }

  selectBestCodeBlock(codeBlocks, problem) {
    if (codeBlocks.length === 0) return null;
    
    // Simple heuristic: return the longest code block
    return codeBlocks.reduce((longest, current) => 
      current.length > longest.length ? current : longest
    );
  }

  extractExplanation(content, problem) {
    const keywords = problem.toLowerCase().split(' ').slice(0, 3).join('|');
    const regex = new RegExp(`.{0,200}(${keywords}).{0,200}`, 'i');
    const match = content.match(regex);
    
    return match ? match[0] : 'Solution generated using AI Brain knowledge';
  }

  defaultSolve(problem, context) {
    return {
      method: 'code-master-default',
      solution: {
        approach: 'traditional-problem-solving',
        note: 'Using default Code Master logic without brain enhancement'
      },
      confidence: 0.6,
      sources: ['Code Master core knowledge']
    };
  }

  applyBrainSolution(problem, suggestion) {
    // Apply skill with context
    const context = this.enhanceContext(problem, {});
    return this.brain.applySkill(suggestion.name, context);
  }

  // Get brain status for Code Master
  async getStatus() {
    if (!this.initialized) {
      return { status: 'not_initialized' };
    }

    const context = await this.brain.getContext();
    
    return {
      status: 'active',
      skillsAvailable: context.availableSkills.length,
      brainSize: context.skillsCount,
      lastUpdated: context.lastUpdated,
      learningMode: this.learningMode,
      integration: 'code-master-enhanced'
    };
  }
}

// Initialize Code Master with AI Brain
const codeMasterBrain = new CodeMasterBrain();

// Auto-initialize when loaded
codeMasterBrain.initialize().catch(console.error);

// Setup learning mode toggles for CLI usage
process.on('message', (msg) => {
  if (msg === 'learn-mode-on') {
    codeMasterBrain.toggleLearningMode(true);
  } else if (msg === 'learn-mode-off') {
    codeMasterBrain.toggleLearningMode(false);
  }
});

module.exports = { CodeMasterBrain, codeMasterBrain };

// Global availability for Code Master
if (typeof global !== 'undefined') {
  global.CodeMasterBrain = CodeMasterBrain;
  global.codeMasterBrain = codeMasterBrain;
}
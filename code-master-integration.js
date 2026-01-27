/**
 * Code Master AI Brain Integration
 * How Code Master uses .ai-brain as default brain
 */

const { AIBrainAgent } = require('./install/agent-integration');

class CodeMasterBrain {
  constructor() {
    this.brain = null;
    this.initialized = false;
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
        // Setup global access for Code Master
        if (typeof global !== 'undefined') {
          global.codeMasterBrain = this;
        }
      }
    }
    return this.initialized;
  }

  // Core Code Master functions enhanced with AI Brain
  async solve(problem, context = {}) {
    await this.initialize();
    
    console.log(`🎯 Code Master solving: "${problem}"`);
    
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
      'build': 'build',
      'test': 'testing'
    };
    
    Object.keys(taskKeywords).forEach(keyword => {
      if (problem.toLowerCase().includes(keyword)) {
        context.task = taskKeywords[keyword];
      }
    });
    
    return context;
  }

  async applyBrainSolution(problem, suggestion) {
    const skill = await this.brain.getSkill(suggestion.name);
    const context = this.enhanceContext(problem, {});
    
    // Apply skill with context
    const appliedSkill = await this.brain.applySkill(suggestion.name, context);
    
    return {
      method: 'brain-enhanced',
      skill: suggestion.name,
      relevance: suggestion.relevance,
      solution: this.generateCodeSolution(appliedSkill.processedContent, problem),
      confidence: 0.8 + (suggestion.relevance * 0.05),
      sources: [`AI Brain skill: ${suggestion.name}`]
    };
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

  // Enhanced delegation with brain awareness
  async delegate(task, subagent) {
    await this.initialize();
    
    console.log(`🔄 Code Master delegating to ${subagent}: "${task}"`);
    
    // Check if brain has relevant knowledge for this delegation
    const context = this.enhanceContext(task, { subagent });
    const suggestions = await this.brain.suggestSkills(context);
    
    if (suggestions.length > 0) {
      console.log(`🧠 Brain enhanced delegation: using ${suggestions[0].name}`);
      
      // Provide brain context to subagent
      const skill = await this.brain.getSkill(suggestions[0].name);
      return {
        task,
        subagent,
        brainContext: {
          skill: suggestions[0].name,
          relevance: suggestions[0].relevance,
          content: skill.content
        }
      };
    }
    
    return { task, subagent };
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
      integration: 'code-master-enhanced'
    };
  }
}

// Initialize Code Master with AI Brain
const codeMasterBrain = new CodeMasterBrain();

// Auto-initialize when loaded
codeMasterBrain.initialize().catch(console.error);

module.exports = { CodeMasterBrain, codeMasterBrain };

// Global availability for Code Master
if (typeof global !== 'undefined') {
  global.CodeMasterBrain = CodeMasterBrain;
  global.codeMasterBrain = codeMasterBrain;
}
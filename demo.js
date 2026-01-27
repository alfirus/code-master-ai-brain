#!/usr/bin/env node

/**
 * AI Brain Demo - Shows AI Brain in action for AI agents
 */

const { AIBrainAgent } = require('./install/agent-integration');

class AIBrainDemo {
  constructor() {
    this.agent = new AIBrainAgent();
  }

  async run() {
    console.log('🧠 AI Brain Demo - How AI agents use the brain\n');
    
    try {
      // 1. Initialize the brain
      console.log('🚀 Initializing AI Brain for agent...');
      await this.agent.initialize();
      console.log('✅ Brain ready!\n');
      
      // 2. Show available skills
      await this.showAvailableSkills();
      
      // 3. Demonstrate skill search
      await this.demonstrateSearch();
      
      // 4. Show context-aware suggestions
      await this.demonstrateContextSuggestions();
      
      // 5. Apply skill with context
      await this.demonstrateSkillApplication();
      
      // 6. Show agent integration
      await this.demonstrateAgentIntegration();
      
    } catch (error) {
      console.error('❌ Demo failed:', error.message);
    }
  }

  async showAvailableSkills() {
    console.log('📚 Available Skills in the Brain:');
    const skills = await this.agent.listSkills();
    
    for (const skillName of skills) {
      const skill = await this.agent.getSkill(skillName);
      console.log(`  📖 ${skillName} (${this.formatBytes(skill.content.length)})`);
    }
    console.log();
  }

  async demonstrateSearch() {
    console.log('🔍 Skill Search Demonstration:');
    
    const searches = ['react', 'performance', 'deployment'];
    
    for (const query of searches) {
      const results = await this.agent.searchSkills(query);
      console.log(`  Search "${query}": Found ${results.length} skills`);
      results.forEach(result => {
        console.log(`    - ${result.name} (relevance: ${result.relevance})`);
      });
    }
    console.log();
  }

  async demonstrateContextSuggestions() {
    console.log('🎯 Context-Aware Suggestions:');
    
    const contexts = [
      { technology: 'react', problem: 'performance' },
      { technology: 'react-native', task: 'deployment' },
      { platform: 'vercel', goal: 'optimization' }
    ];
    
    for (const context of contexts) {
      console.log(`  Context: ${JSON.stringify(context)}`);
      const suggestions = await this.agent.suggestSkills(context);
      
      if (suggestions.length > 0) {
        suggestions.slice(0, 2).forEach(suggestion => {
          console.log(`    💡 Suggestion: ${suggestion.name} (relevance: ${suggestion.relevance})`);
        });
      } else {
        console.log('    ❓ No specific suggestions');
      }
    }
    console.log();
  }

  async demonstrateSkillApplication() {
    console.log('⚡ Skill Application with Context:');
    
    const skillName = 'react-native-quick-reference';
    const context = {
      project: 'MyApp',
      platform: 'iOS',
      environment: 'production'
    };
    
    console.log(`  Applying skill: ${skillName}`);
    console.log(`  Context: ${JSON.stringify(context)}`);
    
    const result = await this.agent.applySkill(skillName, context);
    console.log(`  ✅ Skill applied successfully`);
    console.log(`  📄 Content length: ${this.formatBytes(result.content.length)} chars`);
    console.log(`  🔧 Processed content includes: ${Object.keys(context).join(', ')}`);
    console.log();
  }

  async demonstrateAgentIntegration() {
    console.log('🤖 Agent Integration Example:');
    
    // Simulate an AI agent solving a problem
    class SmartAgent {
      constructor(brain) {
        this.brain = brain;
      }
      
      async solveProblem(problem) {
        console.log(`  🎯 Agent solving: "${problem}"`);
        
        // Extract context from problem
        const context = this.extractContext(problem);
        console.log(`  📋 Extracted context: ${JSON.stringify(context)}`);
        
        // Get relevant skills
        const suggestions = await this.brain.suggestSkills(context);
        
        if (suggestions.length > 0) {
          const bestSkill = suggestions[0];
          console.log(`  💡 Using skill: ${bestSkill.name}`);
          
          const skill = await this.brain.getSkill(bestSkill.name);
          const solution = this.generateSolution(skill, problem);
          
          console.log(`  ✅ Solution generated using ${bestSkill.name}`);
          return solution;
        } else {
          console.log(`  ❓ No specific skills found, using general approach`);
          return this.generalSolution(problem);
        }
      }
      
      extractContext(problem) {
        const context = {};
        const words = problem.toLowerCase().split(' ');
        
        if (words.includes('react')) context.technology = 'react';
        if (words.includes('react-native')) context.technology = 'react-native';
        if (words.includes('deploy')) context.task = 'deployment';
        if (words.includes('optimize')) context.goal = 'optimization';
        if (words.includes('performance')) context.problem = 'performance';
        
        return context;
      }
      
      generateSolution(skill, problem) {
        return {
          skill: skill.name,
          approach: 'Applied brain-based solution',
          confidence: 0.85,
          steps: [
            'Analyzed problem with AI Brain',
            `Applied knowledge from ${skill.name}`,
            'Generated context-aware solution'
          ]
        };
      }
      
      generalSolution(problem) {
        return {
          skill: 'general',
          approach: 'Applied general AI knowledge',
          confidence: 0.60,
          steps: ['Used general problem-solving approach']
        };
      }
    }
    
    // Create and test the smart agent
    const agent = new SmartAgent(this.agent);
    
    const problems = [
      'How do I optimize React Native performance?',
      'Deploy React app to production',
      'Improve mobile app startup time'
    ];
    
    for (const problem of problems) {
      const solution = await agent.solveProblem(problem);
      console.log(`  📊 Result: ${solution.approach} (confidence: ${solution.confidence})`);
      console.log();
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

// Run demo if called directly
if (require.main === module) {
  const demo = new AIBrainDemo();
  demo.run();
}

module.exports = { AIBrainDemo };
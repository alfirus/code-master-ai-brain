/**
 * AI Brain Agent Integration
 * Ready-to-use integration for AI agents
 */

const { AIBrainLoader } = require('./ai-brain-loader');

class AIBrainAgent {
  constructor(options = {}) {
    this.brain = new AIBrainLoader(options.brainPath);
    this.initialized = false;
    this.options = options;
  }

  async initialize() {
    this.initialized = await this.brain.initialize();
    return this.initialized;
  }

  async getSkill(skillName) {
    if (!this.initialized) await this.initialize();
    return this.brain.getSkill(skillName);
  }

  async searchSkills(query) {
    if (!this.initialized) await this.initialize();
    return this.brain.searchSkills(query);
  }

  async listSkills() {
    if (!this.initialized) await this.initialize();
    return this.brain.listSkills();
  }

  async getContext() {
    if (!this.initialized) await this.initialize();
    return this.brain.getContext();
  }

  // AI-specific helper methods
  async applySkill(skillName, context = {}) {
    const skill = await this.getSkill(skillName);
    return this.processSkillWithContext(skill, context);
  }

  processSkillWithContext(skill, context) {
    // Process skill content with given context
    let content = skill.content;
    
    // Replace context variables
    Object.keys(context).forEach(key => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(placeholder, context[key]);
    });
    
    return {
      ...skill,
      processedContent: content,
      context
    };
  }

  // Auto-suggest skills based on context
  async suggestSkills(context) {
    const skills = await this.listSkills();
    const suggestions = [];
    
    for (const skillName of skills) {
      const skill = await this.getSkill(skillName);
      const relevance = this.calculateRelevance(skill.content, context);
      if (relevance > 0) {
        suggestions.push({ name: skillName, relevance });
      }
    }
    
    return suggestions.sort((a, b) => b.relevance - a.relevance);
  }

  calculateRelevance(content, context) {
    let relevance = 0;
    const contentLower = content.toLowerCase();
    
    Object.keys(context).forEach(key => {
      const value = context[key].toLowerCase();
      if (contentLower.includes(value)) {
        relevance += 1;
      }
    });
    
    return relevance;
  }
}

// Easy export for common AI frameworks
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AIBrainAgent };
}

// Global availability
if (typeof global !== 'undefined') {
  global.AIBrainAgent = AIBrainAgent;
}
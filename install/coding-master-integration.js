#!/usr/bin/env node

/**
 * CodingMaster AI Brain Integration Module
 * 
 * This module integrates the AI Brain knowledge system with CodingMaster,
 * providing context-aware assistance, skill-based solutions, and personalized
 * development workflows.
 */

const fs = require('fs-extra');
const path = require('path');

class CodingMasterBrain {
  constructor(options = {}) {
    this.brainPath = options.brainPath || path.join(process.env.HOME, '.ai-brain');
    this.skillsPath = path.join(this.brainPath, 'skills');
    this.globalKnowledgePath = path.join(this.brainPath, 'global-knowledge');
    this.personalPath = path.join(this.brainPath, 'personal');
    this.contextualPath = path.join(this.brainPath, 'contextual');
    this.skills = {};
    this.globalKnowledge = {};
    this.personalPreferences = {};
    this.debug = options.debug || false;
  }

  /**
   * Initialize the AI Brain integration
   */
  async initialize() {
    try {
      this.log('🧠 Initializing CodingMaster AI Brain Integration...');
      
      // Load all skills
      await this.loadSkills();
      
      // Load global knowledge
      await this.loadGlobalKnowledge();
      
      // Load personal preferences
      await this.loadPersonalPreferences();
      
      this.log('✅ AI Brain initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize AI Brain:', error.message);
      return false;
    }
  }

  /**
   * Load all available skills
   */
  async loadSkills() {
    try {
      const files = await fs.readdir(this.skillsPath);
      const mdFiles = files.filter(f => f.endsWith('.md'));
      
      for (const file of mdFiles) {
        const skillName = file.replace('.md', '');
        const skillPath = path.join(this.skillsPath, file);
        const content = await fs.readFile(skillPath, 'utf-8');
        
        this.skills[skillName] = {
          name: skillName,
          file: file,
          content: content,
          size: (await fs.stat(skillPath)).size,
          loaded: true
        };
      }
      
      this.log(`📚 Loaded ${Object.keys(this.skills).length} skills`);
    } catch (error) {
      this.log(`⚠️  Could not load skills: ${error.message}`);
    }
  }

  /**
   * Load global knowledge files
   */
  async loadGlobalKnowledge() {
    try {
      const files = await fs.readdir(this.globalKnowledgePath);
      const mdFiles = files.filter(f => f.endsWith('.md'));
      
      for (const file of mdFiles) {
        const docName = file.replace('.md', '');
        const docPath = path.join(this.globalKnowledgePath, file);
        const content = await fs.readFile(docPath, 'utf-8');
        
        this.globalKnowledge[docName] = {
          name: docName,
          file: file,
          content: content,
          loaded: true
        };
      }
      
      this.log(`🌍 Loaded ${Object.keys(this.globalKnowledge).length} global knowledge documents`);
    } catch (error) {
      this.log(`⚠️  Could not load global knowledge: ${error.message}`);
    }
  }

  /**
   * Load personal preferences
   */
  async loadPersonalPreferences() {
    try {
      const files = await fs.readdir(this.personalPath);
      const mdFiles = files.filter(f => f.endsWith('.md'));
      
      for (const file of mdFiles) {
        const prefName = file.replace('.md', '');
        const prefPath = path.join(this.personalPath, file);
        const content = await fs.readFile(prefPath, 'utf-8');
        
        this.personalPreferences[prefName] = {
          name: prefName,
          file: file,
          content: content,
          loaded: true
        };
      }
      
      this.log(`👤 Loaded ${Object.keys(this.personalPreferences).length} personal preference documents`);
    } catch (error) {
      this.log(`⚠️  Could not load personal preferences: ${error.message}`);
    }
  }

  /**
   * Get a specific skill by name
   */
  getSkill(skillName) {
    return this.skills[skillName] || null;
  }

  /**
   * Search skills by content
   */
  searchSkills(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    for (const [name, skill] of Object.entries(this.skills)) {
      if (skill.content.toLowerCase().includes(lowerQuery) || 
          name.toLowerCase().includes(lowerQuery)) {
        results.push({
          name: name,
          relevance: this.calculateRelevance(skill.content, lowerQuery),
          skill: skill
        });
      }
    }
    
    return results.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Get task execution workflow
   */
  getTaskExecutionWorkflow() {
    return this.globalKnowledge['task-execution-workflow'] || null;
  }

  /**
   * Get coding standards
   */
  getCodingStandards() {
    return this.globalKnowledge['coding-standards'] || null;
  }

  /**
   * Get tech stack preferences
   */
  getTechStackPreferences() {
    return this.globalKnowledge['tech-stack-preferences'] || null;
  }

  /**
   * Get learning style preferences
   */
  getLearningStyle() {
    return this.personalPreferences['learning-style'] || null;
  }

  /**
   * Get all available skills
   */
  listSkills() {
    return Object.keys(this.skills).map(name => ({
      name: name,
      size: this.skills[name].size,
      loaded: true
    }));
  }

  /**
   * Get all global knowledge documents
   */
  listGlobalKnowledge() {
    return Object.keys(this.globalKnowledge);
  }

  /**
   * Get all personal preferences
   */
  listPersonalPreferences() {
    return Object.keys(this.personalPreferences);
  }

  /**
   * Apply a skill to solve a problem
   */
  async applySkilltoProblem(skillName, problem, context = {}) {
    const skill = this.getSkill(skillName);
    if (!skill) {
      return {
        success: false,
        error: `Skill "${skillName}" not found`
      };
    }

    return {
      success: true,
      skill: skillName,
      problem: problem,
      context: context,
      solution: skill.content,
      relevantSections: this.extractRelevantSections(skill.content, problem)
    };
  }

  /**
   * Get context-aware suggestions
   */
  suggestSkills(context) {
    const suggestions = [];
    
    for (const [name, skill] of Object.entries(this.skills)) {
      let score = 0;
      
      if (context.technology && skill.content.toLowerCase().includes(context.technology.toLowerCase())) {
        score += 3;
      }
      
      if (context.problem && skill.content.toLowerCase().includes(context.problem.toLowerCase())) {
        score += 2;
      }
      
      if (context.keywords) {
        for (const keyword of context.keywords) {
          if (skill.content.toLowerCase().includes(keyword.toLowerCase())) {
            score += 1;
          }
        }
      }
      
      if (score > 0) {
        suggestions.push({
          skill: name,
          score: score,
          content: skill.content
        });
      }
    }
    
    return suggestions.sort((a, b) => b.score - a.score);
  }

  /**
   * Extract relevant sections from skill content
   */
  extractRelevantSections(content, query) {
    const lines = content.split('\n');
    const relevant = [];
    const lowerQuery = query.toLowerCase();
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(lowerQuery)) {
        // Include context around the match
        const start = Math.max(0, i - 2);
        const end = Math.min(lines.length, i + 3);
        relevant.push(lines.slice(start, end).join('\n'));
      }
    }
    
    return relevant;
  }

  /**
   * Calculate relevance score
   */
  calculateRelevance(content, query) {
    const lowerContent = content.toLowerCase();
    const matches = (lowerContent.match(new RegExp(query, 'g')) || []).length;
    return matches;
  }

  /**
   * Get brain status
   */
  getStatus() {
    return {
      initialized: true,
      brainPath: this.brainPath,
      skills: {
        count: Object.keys(this.skills).length,
        list: this.listSkills()
      },
      globalKnowledge: {
        count: Object.keys(this.globalKnowledge).length,
        list: this.listGlobalKnowledge()
      },
      personalPreferences: {
        count: Object.keys(this.personalPreferences).length,
        list: this.listPersonalPreferences()
      }
    };
  }

  /**
   * Export brain data
   */
  exportData(format = 'json') {
    const data = {
      timestamp: new Date().toISOString(),
      skills: this.skills,
      globalKnowledge: this.globalKnowledge,
      personalPreferences: this.personalPreferences
    };

    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else if (format === 'markdown') {
      return this.exportAsMarkdown(data);
    }

    return data;
  }

  /**
   * Export as markdown
   */
  exportAsMarkdown(data) {
    let md = '# AI Brain Export\n\n';
    md += `**Exported**: ${data.timestamp}\n\n`;
    
    md += '## Skills\n\n';
    for (const [name, skill] of Object.entries(data.skills)) {
      md += `### ${name}\n${skill.content}\n\n`;
    }
    
    md += '## Global Knowledge\n\n';
    for (const [name, doc] of Object.entries(data.globalKnowledge)) {
      md += `### ${name}\n${doc.content}\n\n`;
    }
    
    return md;
  }

  /**
   * Log messages (respects debug flag)
   */
  log(message) {
    if (this.debug) {
      console.log(message);
    }
  }
}

/**
 * Create and export singleton instance
 */
let instance = null;

async function getCodingMasterBrain(options = {}) {
  if (!instance) {
    instance = new CodingMasterBrain(options);
    await instance.initialize();
  }
  return instance;
}

module.exports = {
  CodingMasterBrain,
  getCodingMasterBrain
};

// CLI usage
if (require.main === module) {
  (async () => {
    const brain = new CodingMasterBrain({ debug: true });
    await brain.initialize();
    
    console.log('\n📊 AI Brain Status:');
    console.log(JSON.stringify(brain.getStatus(), null, 2));
  })();
}

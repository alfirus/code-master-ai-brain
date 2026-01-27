#!/usr/bin/env node

/**
 * AI Brain Skill Loader
 * Makes .ai-brain skills available to AI agents
 */

const fs = require('fs');
const path = require('path');

class AIBrainLoader {
  constructor(brainPath = null) {
    this.brainPath = brainPath || path.join(process.env.HOME || '', '.ai-brain');
    this.skillsPath = path.join(this.brainPath, 'skills');
    this.loadedSkills = new Map();
  }

  /**
   * Initialize the AI Brain for agent use
   */
  async initialize() {
    try {
      // Verify brain directory exists
      if (!fs.existsSync(this.brainPath)) {
        throw new Error(`AI Brain not found at ${this.brainPath}`);
      }

      // Load all available skills
      await this.loadSkills();
      
      // Setup global access
      this.setupGlobalAccess();
      
      console.log('✅ AI Brain initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize AI Brain:', error.message);
      return false;
    }
  }

  /**
   * Load all skills from the skills directory
   */
  async loadSkills() {
    if (!fs.existsSync(this.skillsPath)) {
      console.log('📁 No skills directory found, creating...');
      fs.mkdirSync(this.skillsPath, { recursive: true });
      return;
    }

    const skillFiles = fs.readdirSync(this.skillsPath)
      .filter(file => file.endsWith('.md'));

    for (const file of skillFiles) {
      try {
        const skillName = path.basename(file, '.md').replace(/[^a-zA-Z0-9-_]/g, '');
        const skillPath = path.join(this.skillsPath, file);
        const content = fs.readFileSync(skillPath, 'utf8');
        
        this.loadedSkills.set(skillName, {
          name: skillName,
          content: content,
          path: skillPath,
          lastModified: fs.statSync(skillPath).mtime
        });
      } catch (error) {
        console.warn(`⚠️  Failed to load skill ${file}:`, error.message);
      }
    }

    console.log(`🧠 Loaded ${this.loadedSkills.size} skills`);
  }

  /**
   * Setup global access for AI agents
   */
  setupGlobalAccess() {
    if (typeof global !== 'undefined') {
      global.aiBrain = {
        getSkill: this.getSkill.bind(this),
        listSkills: this.listSkills.bind(this),
        searchSkills: this.searchSkills.bind(this),
        addSkill: this.addSkill.bind(this),
        brain: this
      };
    }
  }

  /**
   * Get a specific skill by name
   */
  getSkill(skillName) {
    const skill = this.loadedSkills.get(skillName);
    if (!skill) {
      throw new Error(`Skill '${skillName}' not found`);
    }
    return skill;
  }

  /**
   * List all available skills
   */
  listSkills() {
    return Array.from(this.loadedSkills.keys());
  }

  /**
   * Search skills by content
   */
  searchSkills(query) {
    const results = [];
    const queryLower = query.toLowerCase();

    for (const [name, skill] of this.loadedSkills) {
      if (name.toLowerCase().includes(queryLower) || 
          skill.content.toLowerCase().includes(queryLower)) {
        results.push({
          name,
          relevance: this.calculateRelevance(skill.content, query),
          ...skill
        });
      }
    }

    return results.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Calculate relevance score for search
   */
  calculateRelevance(content, query) {
    const contentLower = content.toLowerCase();
    const queryLower = query.toLowerCase();
    
    let score = 0;
    if (contentLower.includes(queryLower)) {
      score += contentLower.split(queryLower).length - 1;
    }
    
    return score;
  }

  /**
   * Add a new skill to the brain
   */
  async addSkill(name, content) {
    const skillPath = path.join(this.skillsPath, `${name}.md`);
    
    try {
      fs.writeFileSync(skillPath, content, 'utf8');
      
      // Reload skills
      await this.loadSkills();
      
      console.log(`✅ Added skill: ${name}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to add skill ${name}:`, error.message);
      return false;
    }
  }

  /**
   * Get brain configuration and context
   */
  getContext() {
    const readmePath = path.join(this.brainPath, 'README.md');
    let readme = '';
    
    if (fs.existsSync(readmePath)) {
      readme = fs.readFileSync(readmePath, 'utf8');
    }

    return {
      brainPath: this.brainPath,
      skillsCount: this.loadedSkills.size,
      lastUpdated: new Date().toISOString(),
      readme,
      availableSkills: this.listSkills()
    };
  }
}

// CLI interface
if (require.main === module) {
  const loader = new AIBrainLoader();
  
  loader.initialize().then(success => {
    if (success) {
      console.log('\n🚀 AI Brain is ready for AI agents!');
      console.log('\nAvailable skills:');
      loader.listSkills().forEach(skill => console.log(`  - ${skill}`));
    }
  });
}

module.exports = { AIBrainLoader };
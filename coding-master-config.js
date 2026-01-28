#!/usr/bin/env node

/**
 * CodingMaster Configuration with AI Brain Integration
 * 
 * This configuration file integrates the AI Brain knowledge system
 * with CodingMaster, enabling context-aware assistance and personalized
 * development workflows.
 */

const path = require('path');
const { CodingMasterBrain } = require('./install/coding-master-integration');

class CodingMasterConfig {
  constructor() {
    this.brain = null;
    this.config = {
      // Core settings
      name: 'CodingMaster',
      version: '1.0.0',
      
      // AI Brain integration
      aiBrain: {
        enabled: true,
        path: path.join(process.env.HOME, '.ai-brain'),
        autoLoad: true,
        contextAware: true
      },
      
      // Workflow settings
      workflow: {
        // Mandatory task execution workflow
        taskExecution: {
          planFirst: true,
          displayOptions: true,
          waitForApproval: true,
          createTodos: true,
          executeSequentially: true,
          completionSummary: true
        },
        
        // Cleanup rules
        cleanup: {
          removeTemporaryFiles: true,
          tempDirectory: path.join(process.env.HOME, '.ai-brain/temp'),
          preserveSourceCode: true,
          preserveConfigs: true
        }
      },
      
      // Agent delegation settings
      agents: {
        enabled: true,
        defaultAgents: {
          codeCompletion: 'github-copilot',
          codeRefactoring: 'github-copilot',
          codeGeneration: 'github-copilot',
          dataAnalysis: 'gemini',
          research: 'gemini',
          systemDesign: 'claude',
          complexReasoning: 'claude',
          codeReview: 'claude'
        }
      },
      
      // Development preferences
      development: {
        // From global knowledge
        codingStandards: null,
        techStackPreferences: null,
        commonPatterns: null,
        lessonsLearned: null
      },
      
      // Personal preferences
      personal: {
        // From personal knowledge
        learningStyle: null,
        timeManagement: null,
        goals: null,
        communicationPreferences: null
      }
    };
  }

  /**
   * Initialize configuration with AI Brain
   */
  async initialize() {
    try {
      console.log('🧠 Initializing CodingMaster with AI Brain...');
      
      // Initialize AI Brain
      this.brain = new CodingMasterBrain({ debug: false });
      await this.brain.initialize();
      
      // Load global knowledge into config
      const codingStandards = this.brain.getCodingStandards();
      if (codingStandards) {
        this.config.development.codingStandards = codingStandards.content;
      }
      
      const techStack = this.brain.getTechStackPreferences();
      if (techStack) {
        this.config.development.techStackPreferences = techStack.content;
      }
      
      // Load personal preferences into config
      const learningStyle = this.brain.getLearningStyle();
      if (learningStyle) {
        this.config.personal.learningStyle = learningStyle.content;
      }
      
      console.log('✅ CodingMaster initialized with AI Brain');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize CodingMaster:', error.message);
      return false;
    }
  }

  /**
   * Get the task execution workflow
   */
  getTaskExecutionWorkflow() {
    return this.brain.getTaskExecutionWorkflow();
  }

  /**
   * Get available skills for a problem
   */
  suggestSkillsForProblem(problem, context = {}) {
    return this.brain.suggestSkills({
      problem: problem,
      ...context
    });
  }

  /**
   * Search for relevant skills
   */
  searchSkills(query) {
    return this.brain.searchSkills(query);
  }

  /**
   * Get a specific skill
   */
  getSkill(skillName) {
    return this.brain.getSkill(skillName);
  }

  /**
   * Get brain status
   */
  getBrainStatus() {
    return this.brain.getStatus();
  }

  /**
   * Get full configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Get development preferences
   */
  getDevelopmentPreferences() {
    return this.config.development;
  }

  /**
   * Get personal preferences
   */
  getPersonalPreferences() {
    return this.config.personal;
  }

  /**
   * Get workflow configuration
   */
  getWorkflowConfig() {
    return this.config.workflow;
  }

  /**
   * Get agent configuration
   */
  getAgentConfig() {
    return this.config.agents;
  }

  /**
   * Export configuration
   */
  exportConfig(format = 'json') {
    if (format === 'json') {
      return JSON.stringify(this.config, null, 2);
    } else if (format === 'markdown') {
      return this.exportAsMarkdown();
    }
    return this.config;
  }

  /**
   * Export as markdown
   */
  exportAsMarkdown() {
    let md = '# CodingMaster Configuration\n\n';
    md += `**Version**: ${this.config.version}\n`;
    md += `**AI Brain Enabled**: ${this.config.aiBrain.enabled}\n\n`;
    
    md += '## Workflow Settings\n\n';
    md += '### Task Execution\n';
    for (const [key, value] of Object.entries(this.config.workflow.taskExecution)) {
      md += `- **${key}**: ${value}\n`;
    }
    
    md += '\n## Development Preferences\n\n';
    if (this.config.development.codingStandards) {
      md += '### Coding Standards\n';
      md += this.config.development.codingStandards + '\n\n';
    }
    
    return md;
  }
}

/**
 * Create and export singleton instance
 */
let configInstance = null;

async function getCodingMasterConfig() {
  if (!configInstance) {
    configInstance = new CodingMasterConfig();
    await configInstance.initialize();
  }
  return configInstance;
}

module.exports = {
  CodingMasterConfig,
  getCodingMasterConfig
};

// CLI usage
if (require.main === module) {
  (async () => {
    const config = new CodingMasterConfig();
    await config.initialize();
    
    console.log('\n📋 CodingMaster Configuration:');
    console.log(JSON.stringify(config.getConfig(), null, 2));
    
    console.log('\n🧠 AI Brain Status:');
    console.log(JSON.stringify(config.getBrainStatus(), null, 2));
  })();
}

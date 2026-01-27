#!/usr/bin/env node

/**
 * AI Brain CLI - Command line interface for AI Brain
 */

const { AIBrainLoader } = require('./ai-brain-loader');
const path = require('path');

class AIBrainCLI {
  constructor() {
    this.loader = new AIBrainLoader();
  }

  async run() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'init':
        await this.init();
        break;
      case 'load':
        await this.load();
        break;
      case 'list':
        await this.list();
        break;
      case 'get':
        await this.get(args[1]);
        break;
      case 'search':
        await this.search(args.slice(1).join(' '));
        break;
      case 'add':
        await this.add(args[1], args[2]);
        break;
      case 'status':
        await this.status();
        break;
      case 'export':
        await this.export(args[1]);
        break;
      default:
        this.help();
    }
  }

  async init() {
    console.log('🚀 Initializing AI Brain...');
    const success = await this.loader.initialize();
    if (success) {
      console.log('✅ AI Brain is ready for AI agents!');
    }
  }

  async load() {
    console.log('📦 Loading AI Brain skills...');
    await this.loader.loadSkills();
    console.log(`✅ Loaded ${this.loader.listSkills().length} skills`);
  }

  async list() {
    await this.loader.initialize();
    const skills = this.loader.listSkills();
    if (skills.length === 0) {
      console.log('No skills found');
      return;
    }
    
    console.log('🧠 Available skills:');
    skills.forEach(skill => console.log(`  - ${skill}`));
  }

  async get(skillName) {
    if (!skillName) {
      console.error('❌ Please specify a skill name');
      return;
    }

    try {
      await this.loader.initialize();
      const skill = this.loader.getSkill(skillName);
      console.log(`📖 Skill: ${skill.name}`);
      console.log('─'.repeat(50));
      console.log(skill.content);
    } catch (error) {
      console.error('❌', error.message);
    }
  }

  async search(query) {
    if (!query) {
      console.error('❌ Please provide a search query');
      return;
    }

    const results = this.loader.searchSkills(query);
    if (results.length === 0) {
      console.log('No matching skills found');
      return;
    }

    console.log(`🔍 Found ${results.length} skills matching "${query}":`);
    results.forEach((skill, index) => {
      console.log(`  ${index + 1}. ${skill.name} (relevance: ${skill.relevance})`);
    });
  }

  async add(name, contentFile) {
    if (!name) {
      console.error('❌ Please specify a skill name');
      return;
    }

    let content = '';
    if (contentFile) {
      try {
        const fs = require('fs');
        content = fs.readFileSync(contentFile, 'utf8');
      } catch (error) {
        console.error(`❌ Failed to read content file: ${error.message}`);
        return;
      }
    } else {
      console.log('📝 Enter skill content (Ctrl+D to finish):');
      content = await this.readFromStdin();
    }

    const success = await this.loader.addSkill(name, content);
    if (success) {
      console.log(`✅ Skill "${name}" added successfully`);
    }
  }

  async status() {
    await this.loader.initialize();
    const context = this.loader.getContext();
    console.log('🧠 AI Brain Status');
    console.log('─'.repeat(30));
    console.log(`Path: ${context.brainPath}`);
    console.log(`Skills: ${context.skillsCount}`);
    console.log(`Last Updated: ${context.lastUpdated}`);
    console.log('\nAvailable Skills:');
    context.availableSkills.forEach(skill => console.log(`  - ${skill}`));
  }

  async export(format = 'json') {
    const context = this.loader.getContext();
    
    switch (format.toLowerCase()) {
      case 'json':
        console.log(JSON.stringify(context, null, 2));
        break;
      case 'markdown':
        this.exportAsMarkdown(context);
        break;
      default:
        console.error('❌ Unsupported export format. Use: json, markdown');
    }
  }

  exportAsMarkdown(context) {
    console.log('# AI Brain Export\n');
    console.log(`**Path:** ${context.brainPath}`);
    console.log(`**Skills:** ${context.skillsCount}`);
    console.log(`**Last Updated:** ${context.lastUpdated}\n`);
    
    console.log('## Available Skills\n');
    context.availableSkills.forEach(skill => {
      console.log(`- ${skill}`);
    });
    
    if (context.readme) {
      console.log('\n## README\n');
      console.log(context.readme);
    }
  }

  help() {
    console.log(`
🧠 AI Brain CLI - Global knowledge system for AI agents

Usage:
  ai-brain <command> [options]

Commands:
  init                 Initialize AI Brain for AI agents
  load                 Reload all skills
  list                 List available skills
  get <skill>          Get specific skill content
  search <query>       Search skills by content
  add <name> [file]    Add new skill (from file or stdin)
  status               Show brain status
  export [format]      Export brain data (json, markdown)
  help                 Show this help

Examples:
  ai-brain init
  ai-brain list
  ai-brain get react-native
  ai-brain search "deployment"
  ai-brain add my-skill ./skill.md
  ai-brain export json

Integration with AI agents:
  const { AIBrainLoader } = require('ai-brain');
  const brain = new AIBrainLoader();
  await brain.initialize();
  
  const skill = brain.getSkill('react-native');
  const results = brain.searchSkills('performance');
`);
  }

  readFromStdin() {
    return new Promise((resolve) => {
      let content = '';
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', chunk => content += chunk);
      process.stdin.on('end', () => resolve(content));
    });
  }
}

// Run CLI if called directly
if (require.main === module) {
  const cli = new AIBrainCLI();
  cli.run().catch(console.error);
}

module.exports = { AIBrainCLI };
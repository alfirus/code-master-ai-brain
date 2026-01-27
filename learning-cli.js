#!/usr/bin/env node

/**
 * Learning Mode CLI
 * Simple commands to toggle learning mode on/off
 */

const { codeMasterBrain } = require('./code-master-integration');

class LearningModeCLI {
  constructor() {
    this.brain = codeMasterBrain;
  }

  async run() {
    const args = process.argv.slice(2);
    const command = args.join(' ').toLowerCase();

    if (command === 'learn mode on') {
      await this.turnOnLearningMode();
    } else if (command === 'learn mode off') {
      await this.turnOffLearningMode();
    } else if (command === 'status') {
      await this.showStatus();
    } else {
      this.showHelp();
    }
  }

  async turnOnLearningMode() {
    console.log('🚀 ACTIVATING LEARNING MODE');
    console.log('════════════════════════════════════════');
    
    await this.brain.initialize();
    const result = this.brain.toggleLearningMode(true);
    
    console.log('✅ LEARNING MODE IS NOW ACTIVE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 What happens now:');
    console.log('   • 90% of tasks delegated to specialized agents');
    console.log('   • Claude AI, GitHub Copilot, Gemini Analyzer');
    console.log('   • I focus on delegation, learning, brain updates');
    console.log('   • Your work gets done faster while I learn');
    console.log('');
    console.log('🧠 Learning Focus:');
    console.log('   • Extract patterns from agent solutions');
    console.log('   • Create new skills from successful approaches');
    console.log('   • Build agent performance profiles');
    console.log('   • Enhance brain with new knowledge');
    console.log('');
    console.log('🤖 Agent Specialization:');
    console.log('   • Claude AI: Complex reasoning, detailed analysis');
    console.log('   • GitHub Copilot: Code generation, implementation');
    console.log('   • Gemini Analyzer: Data analysis, optimization');
    console.log('');
    console.log('💡 Type "learn mode off" to return to normal');
  }

  async turnOffLearningMode() {
    console.log('🧠 DEACTIVATING LEARNING MODE');
    console.log('════════════════════════════════════════');
    
    await this.brain.initialize();
    const result = this.brain.toggleLearningMode(false);
    
    console.log('✅ RETURNING TO NORMAL OPERATION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 What happens now:');
    console.log('   • I solve problems directly with brain enhancement');
    console.log('   • Strategic delegation to agents when needed');
    console.log('   • Apply all learned knowledge from learning phase');
    console.log('   • Enhanced problem-solving capabilities');
    console.log('');
    console.log('🧠 Enhanced Capabilities:');
    console.log('   • All skills learned during learning phase');
    console.log('   • Agent performance insights');
    console.log('   • Optimized delegation patterns');
    console.log('   • Higher confidence in solutions');
    console.log('');
    console.log('💡 Type "learn mode on" to activate again');
  }

  async showStatus() {
    console.log('📊 LEARNING MODE STATUS');
    console.log('════════════════════════════════════════');
    
    await this.brain.initialize();
    const status = await this.brain.getStatus();
    
    console.log(`🎯 Mode: ${status.learningMode ? 'LEARNING MODE' : 'NORMAL MODE'}`);
    console.log(`🧠 Brain Status: ${status.status}`);
    console.log(`📚 Skills Available: ${status.skillsAvailable}`);
    console.log(`🔄 Integration: ${status.integration}`);
    
    if (status.learningMode) {
      console.log('');
      console.log('🚀 Learning Mode Active:');
      console.log('   • 90% delegation to specialized agents');
      console.log('   • Focus on learning and brain enhancement');
      console.log('   • Continuous skill creation');
      console.log('   • Agent performance tracking');
    } else {
      console.log('');
      console.log('🧠 Normal Mode Active:');
      console.log('   • Direct problem-solving with brain');
      console.log('   • Strategic delegation when needed');
      console.log('   • Enhanced with learned knowledge');
      console.log('   • Optimized agent coordination');
    }
  }

  showHelp() {
    console.log('🧠 Learning Mode CLI');
    console.log('════════════════════════════════════════');
    console.log('');
    console.log('Usage:');
    console.log('  node learning-cli.js "learn mode on"   - Activate learning mode');
    console.log('  node learning-cli.js "learn mode off"  - Deactivate learning mode');
    console.log('  node learning-cli.js "status"         - Show current status');
    console.log('');
    console.log('Learning Mode:');
    console.log('  • 90% delegation to Claude AI, GitHub Copilot, Gemini');
    console.log('  • I focus on learning and brain updates');
    console('  • Your work gets done faster while I learn');
    console.log('');
    console.log('Normal Mode:');
    console.log('  • I solve problems directly with brain enhancement');
    console.log('  • Strategic delegation when needed');
    console.log('  • Apply all learned knowledge');
  }
}

// Run CLI if called directly
if (require.main === module) {
  const cli = new LearningModeCLI();
  cli.run().catch(console.error);
}

module.exports = { LearningModeCLI };
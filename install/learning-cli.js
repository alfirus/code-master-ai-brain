#!/usr/bin/env node

/**
 * AI Brain Learning Mode CLI
 * Activate and manage learning mode for accelerated learning
 */

const { LearningModeCoordinator } = require('./install/learning-mode-coordinator');
const { codeMasterBrain } = require('./code-master-integration');
const fs = require('fs');
const path = require('path');

class LearningModeCLI {
  constructor() {
    this.coordinator = new LearningModeCoordinator();
    this.targetDate = '2026-01-02';
  }

  async run() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case 'activate':
        await this.activateLearningMode();
        break;
      case 'status':
        await this.showLearningStatus();
        break;
      case 'test':
        await this.testLearningMode();
        break;
      case 'schedule':
        await this.scheduleLearningMode();
        break;
      case 'preview':
        await this.previewLearningMode();
        break;
      default:
        this.showHelp();
    }
  }

  async activateLearningMode() {
    console.log('🚀 ACTIVATING LEARNING MODE');
    console.log('══════════════════════════════════════════');
    
    // Check if we should activate today
    const today = new Date().toISOString().split('T')[0];
    
    if (today === this.targetDate) {
      console.log('✅ LEARNING MODE ACTIVATED FOR TODAY!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━══════════════');
      
      await this.coordinator.initialize();
      await this.coordinator.activateLearningMode();
      
      // Display learning objectives
      this.displayLearningObjectives();
      
      // Show current status
      await this.showCurrentStatus();
      
    } else {
      console.log(`📅 Learning mode scheduled for: ${this.targetDate}`);
      console.log(`📅 Today: ${today}`);
      console.log('💡 Use --preview to see what will happen on learning day');
    }
  }

  async showLearningStatus() {
    console.log('📊 LEARNING MODE STATUS');
    console.log('════════════════════════════════════════');
    
    await this.coordinator.initialize();
    const status = await this.coordinator.getLearningStatus();
    
    console.log(`🎯 Mode: ${status.mode.toUpperCase()}`);
    console.log(`📅 Period: ${status.period?.start || 'N/A'} - ${status.period?.end || 'N/A'}`);
    
    if (status.metrics) {
      console.log(`📝 Tasks Processed: ${status.metrics.tasksProcessed || 0}`);
      console.log(`🧠 Skills Learned: ${status.metrics.solutionsLearned || 0}`);
      console.log(`📈 Learning Rate: ${status.metrics.satisfactionRate ? (status.metrics.solutionsLearned / status.metrics.tasksProcessed * 100).toFixed(1) + '%' : 'N/A'}`);
    }
    
    if (status.agentPerformance) {
      console.log('\n🤖 Agent Performance:');
      Object.entries(status.agentPerformance).forEach(([agent, perf]) => {
        if (perf.tasksCompleted > 0) {
          console.log(`  ${agent}: ${perf.averageSatisfaction.toFixed(1)}/5 (${perf.tasksCompleted} tasks)`);
        }
      });
    }
  }

  async testLearningMode() {
    console.log('🧪 TESTING LEARNING MODE');
    console.log('════════════════════════════════════════');
    
    await this.coordinator.initialize();
    
    // Simulate task processing in learning mode
    const testTasks = [
      'Design a scalable system architecture',
      'Implement a React component with TypeScript',
      'Analyze performance bottlenecks',
      'Review code for quality issues',
      'Create API documentation'
    ];
    
    console.log('🎯 TESTING DELEGATION WITH 90% RATE:');
    console.log('');
    
    for (let i = 0; i < testTasks.length; i++) {
      const task = testTasks[i];
      console.log(`📝 Task ${i + 1}: "${task}"`);
      
      const result = await this.coordinator.processTask(task);
      
      if (result.method === 'delegated-learning') {
        console.log(`  🤖 Delegated to: ${result.agent}`);
        console.log(`  ⭐ Quality: ${result.quality?.satisfaction || 'N/A'}/5`);
        console.log(`  🧠 Learning: ${result.learning?.solutionsLearned > 0 ? '✅' : '⏳'}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay
    }
    
    console.log('\n✅ LEARNING MODE TEST COMPLETE');
    console.log('📊 Ready for actual learning activation!');
  }

  async scheduleLearningMode() {
    console.log('📅 SCHEDULING LEARNING MODE');
    console.log('════════════════════════════════════════');
    
    console.log(`🎯 Target Date: ${this.targetDate}`);
    console.log(`📅 Today: ${new Date().toISOString().split('T')[0]}`);
    
    const daysUntil = this.calculateDaysUntil();
    
    if (daysUntil > 0) {
      console.log(`⏳ ${daysUntil} days until learning mode`);
      console.log('💡 Learning mode will activate automatically on target date');
    } else if (daysUntil === 0) {
      console.log('🚀 Learning mode is scheduled for TODAY!');
      console.log('💡 Run --activate to start learning');
    } else {
      console.log('📅 Learning mode date has passed');
      console.log('💡 You can activate learning mode manually with --activate');
    }
    
    this.displayNextLearningDate();
  }

  async previewLearningMode() {
    console.log('👁 LEARNING MODE PREVIEW');
    console.log('════════════════════════════════════════');
    
    console.log('🎯 What Will Happen on Learning Day:');
    console.log('');
    
    console.log('1. 🤖 90% DELEGATION TO SPECIALIZED AGENTS');
    console.log('   • Claude AI: Complex reasoning and detailed analysis');
    console.log('   • GitHub Copilot: Code generation and implementation');
    console.log('   • Gemini Analyzer: Data analysis and optimization');
    console.log('   • Big Pickle: Strategic reasoning and planning');
    
    console.log('2. 🧠 ACCELERATED LEARNING');
    console.log('   • Real-time skill creation from successful solutions');
    console.log('   • Pattern extraction from agent approaches');
    console.log('   • Agent performance profiling');
    console.log('   • Brain enhancement with new knowledge');
    
    console.log('3. 📊 PERFORMANCE TRACKING');
    console.log('   • Task completion metrics');
    console.log('   • Agent satisfaction ratings');
    console.log('   • Learning effectiveness measurement');
    console.log('   • Real-time progress monitoring');
    
    console.log('4. 🎯 EXPECTED OUTCOMES');
    console.log('   • 50+ new skills learned');
    console.log('   • 3x faster task completion');
    console.log('   • 95%+ satisfaction on delegated solutions');
    console.log('   • Enhanced agent coordination');
    
    console.log('5. 🔄 POST-LEARNING BENEFITS');
    console.log('   • Intelligent delegation patterns');
    console.log('   • Expanded brain capabilities');
    console.log('   • Optimized agent selection');
    console.log('   • Higher confidence in solutions');
    
    this.displayLearningObjectives();
  }

  displayLearningObjectives() {
    console.log('\n🎯 LEARNING OBJECTIVES:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━════════════');
    console.log('1. 📚 Learn 50+ new skills from agent solutions');
    console.log('2. 🤖 Master agent delegation patterns');
    console.log('3. 🧠 Extract 100+ reusable solution patterns');
    console.log('4. 📊 Build comprehensive agent performance profiles');
    console.log('5. ⚡ Achieve 3x task completion speed');
    console.log('6. 🎉 Maintain 95%+ solution satisfaction');
    console.log('7. 🔄 Create intelligent delegation algorithms');
  }

  calculateDaysUntil() {
    const today = new Date();
    const targetDate = new Date(this.targetDate);
    const diffTime = targetDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  displayNextLearningDate() {
    console.log('\n📅 UPCOMING LEARNING SESSIONS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━════════════');
    console.log(`🎯 Next Learning Day: ${this.targetDate}`);
    
    const daysUntil = this.calculateDaysUntil();
    if (daysUntil > 0) {
      console.log(`⏳ Activates in: ${daysUntil} days`);
    }
  }

  async showCurrentStatus() {
    const status = await this.coordinator.getLearningStatus();
    
    console.log('\n📊 CURRENT STATUS:');
    console.log(`   Mode: ${status.mode.toUpperCase()}`);
    console.log(`   Brain Skills: ${(await this.coordinator.brain.listSkills()).length}`);
    
    if (status.mode === 'learning') {
      console.log('   🚀 Learning Mode Active');
      console.log('   📈 Progress: Real-time learning in progress');
    } else {
      console.log('   🧠 Normal Mode Active');
      console.log('   🎯 Strategic delegation when needed');
    }
  }

  showHelp() {
    console.log('🧠 AI Brain Learning Mode CLI');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('Usage: ai-brain learning <command>');
    console.log('');
    console.log('Commands:');
    console.log('  activate     - Activate learning mode (if today is target date)');
    console.log('  status       - Show current learning mode status');
    console.log('  test         - Test learning mode with sample tasks');
    console.log('  schedule     - Show learning mode schedule');
    console.log('  preview      - Preview what will happen in learning mode');
    console.log('');
    console.log('Examples:');
    console.log('  ai-brain learning activate');
    console.log('  ai-brain learning status');
    console.log('  ai-brain learning test');
    console.log('  ai-brain learning preview');
  }
}

// Run CLI if called directly
if (require.main === module) {
  const cli = new LearningModeCLI();
  cli.run().catch(console.error);
}

module.exports = { LearningModeCLI };
#!/usr/bin/env node

/**
 * CodingMaster AI Brain Integration Test Suite
 * 
 * Tests all aspects of the AI Brain integration with CodingMaster
 */

const { CodingMasterBrain } = require('./install/coding-master-integration');
const { CodingMasterConfig } = require('./coding-master-config');

class IntegrationTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async runAllTests() {
    console.log('🧪 CodingMaster AI Brain Integration Test Suite\n');
    console.log('═'.repeat(60) + '\n');

    // Test 1: Brain Initialization
    await this.testBrainInitialization();

    // Test 2: Skill Loading
    await this.testSkillLoading();

    // Test 3: Global Knowledge Loading
    await this.testGlobalKnowledgeLoading();

    // Test 4: Personal Preferences Loading
    await this.testPersonalPreferencesLoading();

    // Test 5: Skill Search
    await this.testSkillSearch();

    // Test 6: Skill Suggestions
    await this.testSkillSuggestions();

    // Test 7: Task Execution Workflow
    await this.testTaskExecutionWorkflow();

    // Test 8: Config Integration
    await this.testConfigIntegration();

    // Test 9: Coding Standards
    await this.testCodingStandards();

    // Test 10: Tech Stack Preferences
    await this.testTechStackPreferences();

    // Print Results
    this.printResults();
  }

  async testBrainInitialization() {
    try {
      const brain = new CodingMasterBrain({ debug: false });
      const result = await brain.initialize();
      
      if (result) {
        this.pass('Brain Initialization', 'AI Brain initialized successfully');
      } else {
        this.fail('Brain Initialization', 'Failed to initialize AI Brain');
      }
    } catch (error) {
      this.fail('Brain Initialization', error.message);
    }
  }

  async testSkillLoading() {
    try {
      const brain = new CodingMasterBrain({ debug: false });
      await brain.initialize();
      
      const skills = brain.listSkills();
      if (skills.length >= 4) {
        this.pass('Skill Loading', `Loaded ${skills.length} skills successfully`);
      } else {
        this.fail('Skill Loading', `Expected 4+ skills, got ${skills.length}`);
      }
    } catch (error) {
      this.fail('Skill Loading', error.message);
    }
  }

  async testGlobalKnowledgeLoading() {
    try {
      const brain = new CodingMasterBrain({ debug: false });
      await brain.initialize();
      
      const knowledge = brain.listGlobalKnowledge();
      if (knowledge.length > 0) {
        this.pass('Global Knowledge Loading', `Loaded ${knowledge.length} global knowledge documents`);
      } else {
        this.fail('Global Knowledge Loading', 'No global knowledge documents found');
      }
    } catch (error) {
      this.fail('Global Knowledge Loading', error.message);
    }
  }

  async testPersonalPreferencesLoading() {
    try {
      const brain = new CodingMasterBrain({ debug: false });
      await brain.initialize();
      
      const prefs = brain.listPersonalPreferences();
      if (prefs.length > 0) {
        this.pass('Personal Preferences Loading', `Loaded ${prefs.length} personal preference documents`);
      } else {
        this.fail('Personal Preferences Loading', 'No personal preference documents found');
      }
    } catch (error) {
      this.fail('Personal Preferences Loading', error.message);
    }
  }

  async testSkillSearch() {
    try {
      const brain = new CodingMasterBrain({ debug: false });
      await brain.initialize();
      
      const results = brain.searchSkills('react');
      if (results.length > 0) {
        this.pass('Skill Search', `Found ${results.length} skills matching "react"`);
      } else {
        this.fail('Skill Search', 'No skills found for "react" query');
      }
    } catch (error) {
      this.fail('Skill Search', error.message);
    }
  }

  async testSkillSuggestions() {
    try {
      const brain = new CodingMasterBrain({ debug: false });
      await brain.initialize();
      
      const suggestions = brain.suggestSkills({
        technology: 'react-native',
        problem: 'performance',
        keywords: ['optimization', 'mobile']
      });
      
      if (suggestions.length > 0) {
        this.pass('Skill Suggestions', `Generated ${suggestions.length} skill suggestions`);
      } else {
        this.fail('Skill Suggestions', 'No skill suggestions generated');
      }
    } catch (error) {
      this.fail('Skill Suggestions', error.message);
    }
  }

  async testTaskExecutionWorkflow() {
    try {
      const brain = new CodingMasterBrain({ debug: false });
      await brain.initialize();
      
      const workflow = brain.getTaskExecutionWorkflow();
      if (workflow && workflow.content && workflow.content.includes('MANDATORY')) {
        this.pass('Task Execution Workflow', 'Task execution workflow loaded successfully');
      } else {
        this.fail('Task Execution Workflow', 'Task execution workflow not found or invalid');
      }
    } catch (error) {
      this.fail('Task Execution Workflow', error.message);
    }
  }

  async testConfigIntegration() {
    try {
      const config = new CodingMasterConfig();
      const result = await config.initialize();
      
      if (result) {
        this.pass('Config Integration', 'CodingMaster config initialized successfully');
      } else {
        this.fail('Config Integration', 'Failed to initialize CodingMaster config');
      }
    } catch (error) {
      this.fail('Config Integration', error.message);
    }
  }

  async testCodingStandards() {
    try {
      const config = new CodingMasterConfig();
      await config.initialize();
      
      const standards = config.getDevelopmentPreferences().codingStandards;
      if (standards && standards.includes('TypeScript')) {
        this.pass('Coding Standards', 'Coding standards loaded with TypeScript preference');
      } else {
        this.fail('Coding Standards', 'Coding standards not properly loaded');
      }
    } catch (error) {
      this.fail('Coding Standards', error.message);
    }
  }

  async testTechStackPreferences() {
    try {
      const config = new CodingMasterConfig();
      await config.initialize();
      
      const techStack = config.getDevelopmentPreferences().techStackPreferences;
      if (techStack && techStack.includes('React')) {
        this.pass('Tech Stack Preferences', 'Tech stack preferences loaded with React');
      } else {
        this.fail('Tech Stack Preferences', 'Tech stack preferences not properly loaded');
      }
    } catch (error) {
      this.fail('Tech Stack Preferences', error.message);
    }
  }

  pass(testName, message) {
    this.results.passed++;
    this.results.tests.push({
      name: testName,
      status: 'PASS',
      message: message
    });
    console.log(`✅ ${testName}`);
    console.log(`   ${message}\n`);
  }

  fail(testName, message) {
    this.results.failed++;
    this.results.tests.push({
      name: testName,
      status: 'FAIL',
      message: message
    });
    console.log(`❌ ${testName}`);
    console.log(`   ${message}\n`);
  }

  printResults() {
    console.log('═'.repeat(60));
    console.log('\n📊 TEST RESULTS\n');
    
    const total = this.results.passed + this.results.failed;
    const percentage = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;
    
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${percentage}%\n`);
    
    if (this.results.failed === 0) {
      console.log('🎉 ALL TESTS PASSED!\n');
      console.log('CodingMaster AI Brain Integration is working perfectly!');
      console.log('\n✨ You can now use AI Brain with CodingMaster:');
      console.log('   - Global knowledge base with coding standards');
      console.log('   - 4 specialized skills for development tasks');
      console.log('   - Mandatory task execution workflow');
      console.log('   - Personal preferences for learning and communication');
      console.log('   - Intelligent agent coordination');
    } else {
      console.log('⚠️  Some tests failed. Please review the errors above.');
    }
    
    console.log('\n' + '═'.repeat(60));
  }
}

// Run tests
if (require.main === module) {
  const tester = new IntegrationTester();
  tester.runAllTests().catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
  });
}

module.exports = IntegrationTester;

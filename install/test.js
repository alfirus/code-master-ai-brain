#!/usr/bin/env node

/**
 * AI Brain Test Suite
 * Validates AI Brain installation and functionality
 */

const { AIBrainLoader } = require('./ai-brain-loader');
const fs = require('fs');
const path = require('path');

class AIBrainTest {
  constructor() {
    this.loader = new AIBrainLoader();
    this.testResults = [];
  }

  async runTests() {
    console.log('🧪 Running AI Brain Test Suite');
    console.log('═'.repeat(50));

    try {
      // Core functionality tests
      await this.testBrainInitialization();
      await this.testSkillLoading();
      await this.testSkillRetrieval();
      await this.testSkillSearch();
      await this.testSkillAddition();
      
      // Integration tests
      await this.testAgentIntegration();
      await this.testCLIIntegration();
      
      // Performance tests
      await this.testPerformance();
      
      this.displayResults();
      
    } catch (error) {
      console.error('\n❌ Test suite failed:', error.message);
      process.exit(1);
    }
  }

  async testBrainInitialization() {
    const test = 'Brain Initialization';
    try {
      const success = await this.loader.initialize();
      this.assert(success, test, 'Brain should initialize successfully');
      this.assert(this.loader.loadedSkills !== undefined, test, 'Loader should have skills property');
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  async testSkillLoading() {
    const test = 'Skill Loading';
    try {
      await this.loader.loadSkills();
      const skillCount = this.loader.listSkills().length;
      this.assert(skillCount >= 0, test, 'Should load skills without errors');
      console.log(`    Loaded ${skillCount} skills`);
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  async testSkillRetrieval() {
    const test = 'Skill Retrieval';
    try {
      const skills = this.loader.listSkills();
      
      if (skills.length > 0) {
        const skillName = skills[0];
        const skill = this.loader.getSkill(skillName);
        
        this.assert(skill.name === skillName, test, 'Retrieved skill should match requested name');
        this.assert(skill.content, test, 'Skill should have content');
        this.assert(skill.path, test, 'Skill should have path');
      } else {
        this.skip(test, 'No skills available to test retrieval');
      }
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  async testSkillSearch() {
    const test = 'Skill Search';
    try {
      const results1 = this.loader.searchSkills('react');
      this.assert(Array.isArray(results1), test, 'Search should return array');
      
      const results2 = this.loader.searchSkills('nonexistent');
      this.assert(Array.isArray(results2), test, 'Empty search should return array');
      
      console.log(`    Search 'react': ${results1.length} results`);
      console.log(`    Search 'nonexistent': ${results2.length} results`);
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  async testSkillAddition() {
    const test = 'Skill Addition';
    try {
      const testSkillName = `test-skill-${Date.now()}`;
      const testContent = '# Test Skill\n\nThis is a test skill for validation.';
      
      const success = await this.loader.addSkill(testSkillName, testContent);
      this.assert(success, test, 'Should successfully add new skill');
      
      // Verify it was added
      const skill = this.loader.getSkill(testSkillName);
      this.assert(skill.content === testContent, test, 'Added skill content should match');
      
      // Clean up
      const skillPath = path.join(this.loader.skillsPath, `${testSkillName}.md`);
      fs.unlinkSync(skillPath);
      
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  async testAgentIntegration() {
    const test = 'Agent Integration';
    try {
      const { AIBrainAgent } = require('./agent-integration');
      const agent = new AIBrainAgent();
      
      await agent.initialize();
      this.assert(agent.initialized, test, 'Agent should initialize successfully');
      
      const context = await agent.getContext();
      this.assert(context.brainPath, test, 'Agent context should have brain path');
      this.assert(context.skillsCount !== undefined, test, 'Agent context should have skills count');
      
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  async testCLIIntegration() {
    const test = 'CLI Integration';
    try {
      const { execSync } = require('child_process');
      
      // Test CLI status command
      const statusOutput = execSync('node install/status.js', { 
        encoding: 'utf8', 
        stdio: 'pipe',
        cwd: this.loader.brainPath 
      });
      
      this.assert(statusOutput.includes('AI Brain Status'), test, 'CLI status should run successfully');
      
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  async testPerformance() {
    const test = 'Performance Tests';
    try {
      // Test loading performance
      const startLoad = Date.now();
      await this.loader.loadSkills();
      const loadTime = Date.now() - startLoad;
      
      this.assert(loadTime < 5000, test, `Loading should be fast (${loadTime}ms > 5000ms)`);
      
      // Test search performance
      const startSearch = Date.now();
      this.loader.searchSkills('test');
      const searchTime = Date.now() - startSearch;
      
      this.assert(searchTime < 1000, test, `Search should be fast (${searchTime}ms > 1000ms)`);
      
      console.log(`    Load time: ${loadTime}ms`);
      console.log(`    Search time: ${searchTime}ms`);
      
    } catch (error) {
      this.fail(test, error.message);
    }
  }

  assert(condition, test, message) {
    if (condition) {
      this.pass(test, message);
    } else {
      this.fail(test, message);
    }
  }

  pass(test, message) {
    this.testResults.push({ test, status: 'PASS', message });
    console.log(`  ✅ ${test}: ${message}`);
  }

  fail(test, message) {
    this.testResults.push({ test, status: 'FAIL', message });
    console.log(`  ❌ ${test}: ${message}`);
  }

  skip(test, message) {
    this.testResults.push({ test, status: 'SKIP', message });
    console.log(`  ⏭️  ${test}: ${message}`);
  }

  displayResults() {
    console.log('\n' + '═'.repeat(50));
    console.log('📊 Test Results Summary');
    console.log('═'.repeat(50));

    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const skipped = this.testResults.filter(r => r.status === 'SKIP').length;
    const total = this.testResults.length;

    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏭️  Skipped: ${skipped}`);

    if (failed === 0) {
      console.log('\n🎉 All tests passed! AI Brain is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the issues above.');
      process.exit(1);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const test = new AIBrainTest();
  test.runTests();
}

module.exports = { AIBrainTest };
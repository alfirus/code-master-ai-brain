#!/usr/bin/env node

/**
 * Quick Brain Status Check
 * 
 * This script checks if CodingMaster is equipped with AI Brain
 * and displays the current status
 */

const fs = require('fs');
const path = require('path');

const brainPath = path.join(process.env.HOME, '.ai-brain');
const statusFile = path.join(brainPath, '.brain-status.json');
const activeFile = path.join(brainPath, '.brain-active');

function checkBrainStatus() {
  console.log('\n🧠 CodingMaster AI Brain Status Check\n');
  console.log('═'.repeat(60));

  // Check if brain directory exists
  if (!fs.existsSync(brainPath)) {
    console.log('\n❌ AI Brain NOT installed');
    console.log(`   Expected location: ${brainPath}`);
    return false;
  }

  console.log('\n✅ AI Brain directory found');
  console.log(`   Location: ${brainPath}`);

  // Check if status files exist
  if (!fs.existsSync(statusFile)) {
    console.log('⚠️  Status file not found');
  } else {
    console.log('✅ Status file found');
  }

  if (!fs.existsSync(activeFile)) {
    console.log('⚠️  Active marker not found');
  } else {
    console.log('✅ Active marker found');
  }

  // Try to read status
  try {
    const status = JSON.parse(fs.readFileSync(statusFile, 'utf-8'));
    
    console.log('\n📊 Brain Status Details:');
    console.log(`   Status: ${status.status}`);
    console.log(`   Version: ${status.version}`);
    console.log(`   Repository: ${status.brain_repository}`);
    console.log(`   Installation Date: ${status.installation_date}`);
    
    console.log('\n🎯 Capabilities:');
    console.log(`   Skills Loaded: ${status.capabilities.skills_loaded}`);
    console.log(`   Global Knowledge: ${status.capabilities.global_knowledge_documents}`);
    console.log(`   Personal Preferences: ${status.capabilities.personal_preferences}`);
    console.log(`   Skill Search: ${status.capabilities.skill_search ? '✅' : '❌'}`);
    console.log(`   Context-Aware Suggestions: ${status.capabilities.context_aware_suggestions ? '✅' : '❌'}`);
    console.log(`   Adaptive Learning: ${status.capabilities.adaptive_learning ? '✅' : '❌'}`);
    console.log(`   Mandatory Workflow: ${status.capabilities.mandatory_workflow ? '✅' : '❌'}`);
    
    console.log('\n🧪 Test Results:');
    console.log(`   Total Tests: ${status.test_results.total_tests}`);
    console.log(`   Passed: ${status.test_results.passed}`);
    console.log(`   Failed: ${status.test_results.failed}`);
    console.log(`   Success Rate: ${status.test_results.success_rate}`);
    
    console.log('\n📚 Available Skills:');
    status.skills.forEach(skill => {
      console.log(`   • ${skill}`);
    });
    
    console.log('\n🌍 Global Knowledge:');
    status.global_knowledge.forEach(doc => {
      console.log(`   • ${doc}`);
    });
    
    console.log('\n👤 Personal Preferences:');
    status.personal_preferences.forEach(pref => {
      console.log(`   • ${pref}`);
    });
    
    console.log('\n' + '═'.repeat(60));
    
    if (status.brain_active && status.integration_complete) {
      console.log('\n✅ YES - CodingMaster IS equipped with AI Brain!');
      console.log('\n🚀 Ready to use with:');
      console.log('   • Global knowledge base');
      console.log('   • Specialized skills');
      console.log('   • Personal preferences');
      console.log('   • Mandatory task execution workflow');
      console.log('   • Intelligent agent coordination');
      return true;
    } else {
      console.log('\n⚠️  AI Brain is installed but not fully active');
      return false;
    }
  } catch (error) {
    console.log(`\n⚠️  Could not read status: ${error.message}`);
    return false;
  }
}

// Run check
const isEquipped = checkBrainStatus();
console.log('\n');
process.exit(isEquipped ? 0 : 1);

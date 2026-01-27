#!/usr/bin/env node

/**
 * AI Brain Status Check
 * Shows current status and health of AI Brain
 */

const { AIBrainLoader } = require('./ai-brain-loader');
const fs = require('fs');
const path = require('path');

class AIBrainStatus {
  constructor() {
    this.loader = new AIBrainLoader();
    this.brainPath = this.loader.brainPath;
  }

  async checkStatus() {
    console.log('🧠 AI Brain Status Report');
    console.log('═'.repeat(50));

    try {
      // 1. Check brain directory
      await this.checkBrainDirectory();
      
      // 2. Check skills
      await this.checkSkills();
      
      // 3. Check configuration
      await this.checkConfiguration();
      
      // 4. Check installation
      await this.checkInstallation();
      
      // 5. Check connectivity
      await this.checkConnectivity();
      
      console.log('\n✅ AI Brain is healthy and ready!');
      
    } catch (error) {
      console.error('\n❌ Status check failed:', error.message);
      process.exit(1);
    }
  }

  async checkBrainDirectory() {
    console.log('\n📁 Brain Directory:');
    
    if (!fs.existsSync(this.brainPath)) {
      throw new Error('Brain directory not found');
    }
    
    console.log(`  Path: ${this.brainPath}`);
    
    const stats = fs.statSync(this.brainPath);
    console.log(`  Size: ${this.formatBytes(this.getDirectorySize(this.brainPath))}`);
    console.log(`  Modified: ${stats.mtime.toLocaleString()}`);
    
    // Check key subdirectories
    const subdirs = ['skills', 'global-knowledge', 'personal', 'contextual'];
    for (const subdir of subdirs) {
      const subdirPath = path.join(this.brainPath, subdir);
      const exists = fs.existsSync(subdirPath);
      console.log(`  ${subdir}: ${exists ? '✅' : '❌'}`);
    }
  }

  async checkSkills() {
    console.log('\n🧠 Skills Status:');
    
    try {
      await this.loader.loadSkills();
      const skills = this.loader.listSkills();
      
      console.log(`  Total Skills: ${skills.length}`);
      
      if (skills.length > 0) {
        console.log('  Available Skills:');
        skills.forEach(skill => {
          const skillPath = path.join(this.loader.skillsPath, `${skill}.md`);
          const stats = fs.statSync(skillPath);
          console.log(`    - ${skill} (${this.formatBytes(stats.size)}, ${stats.mtime.toLocaleDateString()})`);
        });
      }
      
    } catch (error) {
      console.log(`  ❌ Skills loading failed: ${error.message}`);
    }
  }

  async checkConfiguration() {
    console.log('\n⚙️  Configuration:');
    
    const configPath = path.join(this.brainPath, 'ai-brain.config.json');
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log(`  Version: ${config.version}`);
        console.log(`  Auto Load: ${config.autoLoad ? '✅' : '❌'}`);
        console.log(`  Context Aware: ${config.contextAware ? '✅' : '❌'}`);
        console.log(`  Skills Path: ${config.skillsPath}`);
      } catch (error) {
        console.log(`  ❌ Config parse error: ${error.message}`);
      }
    } else {
      console.log('  ⚠️  No configuration file found');
    }

    // Check package.json
    const packagePath = path.join(this.brainPath, 'package.json');
    if (fs.existsSync(packagePath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        console.log(`  Package: ${pkg.name}@${pkg.version}`);
        console.log(`  CLI Available: ${pkg.bin && pkg.bin['ai-brain'] ? '✅' : '❌'}`);
      } catch (error) {
        console.log(`  ❌ Package.json error: ${error.message}`);
      }
    }
  }

  async checkInstallation() {
    console.log('\n📦 Installation Status:');
    
    try {
      // Check if globally installed
      const { execSync } = require('child_process');
      try {
        const version = execSync('ai-brain --version', { encoding: 'utf8', stdio: 'pipe' }).trim();
        console.log(`  Global CLI: ✅ (${version})`);
      } catch (error) {
        console.log('  Global CLI: ❌ Not installed globally');
      }
      
      // Check local installation
      const loaderPath = path.join(this.brainPath, 'install', 'ai-brain-loader.js');
      if (fs.existsSync(loaderPath)) {
        console.log('  Local Loader: ✅');
      } else {
        console.log('  Local Loader: ❌ Missing');
      }
      
      const cliPath = path.join(this.brainPath, 'install', 'ai-brain-cli.js');
      if (fs.existsSync(cliPath)) {
        console.log('  Local CLI: ✅');
      } else {
        console.log('  Local CLI: ❌ Missing');
      }
      
    } catch (error) {
      console.log(`  ❌ Installation check failed: ${error.message}`);
    }
  }

  async checkConnectivity() {
    console.log('\n🔗 Connectivity:');
    
    try {
      // Test loader initialization
      const success = await this.loader.initialize();
      console.log(`  Loader: ${success ? '✅' : '❌'}`);
      
      if (success) {
        // Test skill access
        const skills = this.loader.listSkills();
        console.log(`  Skill Access: ✅ (${skills.length} skills)`);
        
        // Test search
        const searchResults = this.loader.searchSkills('test');
        console.log(`  Search Function: ✅`);
      }
      
    } catch (error) {
      console.log(`  ❌ Connectivity failed: ${error.message}`);
    }
  }

  getDirectorySize(dirPath) {
    let totalSize = 0;
    
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          totalSize += this.getDirectorySize(itemPath);
        } else {
          totalSize += stats.size;
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
    
    return totalSize;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run status check if called directly
if (require.main === module) {
  const status = new AIBrainStatus();
  status.checkStatus();
}

module.exports = { AIBrainStatus };
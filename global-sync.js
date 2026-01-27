#!/usr/bin/env node
/**
 * AI Brain Global Sync System
 * Automatically syncs brain updates to GitHub repository
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AIBrainGlobalSync {
  constructor() {
    this.brainPath = process.env.AI_BRAIN_PATH || path.join(process.env.HOME, '.ai-brain');
    this.repoUrl = 'https://github.com/alfirus/code-master-ai-brain';
    this.checkInterval = 5 * 60 * 1000; // 5 minutes
    this.isRunning = false;
  }

  async initialize() {
    console.log('🧠 Initializing AI Brain Global Sync...');
    
    // Verify git repository
    if (!this.isGitRepo()) {
      throw new Error('AI Brain directory is not a git repository');
    }

    // Set up git remote if needed
    await this.ensureRemoteSetup();
    
    // Set up environment variables globally
    await this.setupGlobalEnvironment();
    
    console.log('✅ AI Brain Global Sync initialized');
    return true;
  }

  isGitRepo() {
    try {
      execSync('git status', { cwd: this.brainPath, stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  async ensureRemoteSetup() {
    try {
      const remotes = execSync('git remote -v', { 
        cwd: this.brainPath, 
        encoding: 'utf8' 
      });
      
      if (!remotes.includes('origin')) {
        console.log('🔗 Setting up git remote...');
        execSync(`git remote add origin ${this.repoUrl}`, { 
          cwd: this.brainPath 
        });
      }
    } catch (error) {
      console.error('⚠️  Remote setup error:', error.message);
    }
  }

  async setupGlobalEnvironment() {
    // Create global environment setup script
    const envScript = `#!/bin/bash
# AI Brain Global Environment Setup
export AI_BRAIN_PATH="${this.brainPath}"
export AI_BRAIN_ENABLED=true
export PATH="$PATH:${this.brainPath}"

# Auto-sync function
ai-brain-sync() {
  cd "${this.brainPath}"
  git add . 2>/dev/null
  if [ -n "$(git status --porcelain)" ]; then
    git commit -m "Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null
    git push origin main 2>/dev/null
    echo "🧠 AI Brain synced to repository"
  fi
}

# Auto-update function  
ai-brain-update() {
  cd "${this.brainPath}"
  git pull origin main 2>/dev/null
  echo "🧠 AI Brain updated from repository"
}
`;

    const envPath = path.join(this.brainPath, 'global-env.sh');
    fs.writeFileSync(envPath, envScript);
    execSync(`chmod +x "${envPath}"`);

    console.log(`✅ Global environment setup created: ${envPath}`);
    console.log('💡 To activate globally, add this to your shell profile:');
    console.log(`source "${envPath}"`);
  }

  async checkForUpdates() {
    try {
      // Check for remote updates
      execSync('git fetch', { cwd: this.brainPath, stdio: 'ignore' });
      
      const status = execSync('git status --porcelain -b', { 
        cwd: this.brainPath, 
        encoding: 'utf8' 
      });

      // Check if behind remote
      if (status.includes('behind')) {
        console.log('📥 Updates available from repository...');
        await this.pullUpdates();
      }

      // Check for local changes
      if (status.trim().split('\n').length > 1) {
        console.log('📤 Local changes detected...');
        await this.pushUpdates();
      }

    } catch (error) {
      console.error('⚠️  Update check failed:', error.message);
    }
  }

  async pullUpdates() {
    try {
      execSync('git pull origin main', { cwd: this.brainPath });
      console.log('✅ AI Brain updated from repository');
      
      // Reload brain after updates
      await this.reloadBrain();
    } catch (error) {
      console.error('❌ Pull failed:', error.message);
    }
  }

  async pushUpdates() {
    try {
      const timestamp = new Date().toISOString();
      
      execSync('git add .', { cwd: this.brainPath });
      
      const commitMessage = `Auto-sync: Brain updates ${timestamp}`;
      execSync(`git commit -m "${commitMessage}"`, { cwd: this.brainPath });
      
      execSync('git push origin main', { cwd: this.brainPath });
      
      console.log('✅ AI Brain changes pushed to repository');
    } catch (error) {
      if (!error.message.includes('nothing to commit')) {
        console.error('❌ Push failed:', error.message);
      }
    }
  }

  async reloadBrain() {
    try {
      // Reload brain modules if they exist
      if (global.codeMasterBrain) {
        await global.codeMasterBrain.initialize();
        console.log('🔄 Code Master brain reloaded');
      }
    } catch (error) {
      console.error('⚠️  Brain reload failed:', error.message);
    }
  }

  startAutoSync() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔄 Starting automatic brain sync...');
    
    // Initial check
    this.checkForUpdates();
    
    // Set up periodic sync
    this.syncInterval = setInterval(() => {
      this.checkForUpdates();
    }, this.checkInterval);

    // Handle process termination
    process.on('SIGINT', () => {
      this.stopAutoSync();
      process.exit(0);
    });
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.isRunning = false;
      console.log('⏹️  Auto-sync stopped');
    }
  }

  async getStatus() {
    const status = {
      brainPath: this.brainPath,
      gitStatus: 'unknown',
      autoSyncRunning: this.isRunning,
      lastCheck: new Date().toISOString()
    };

    try {
      const gitStatus = execSync('git status --porcelain', { 
        cwd: this.brainPath, 
        encoding: 'utf8' 
      });
      
      status.gitStatus = gitStatus.trim() ? 'modified' : 'clean';
    } catch {
      status.gitStatus = 'error';
    }

    return status;
  }
}

// CLI interface
if (require.main === module) {
  const sync = new AIBrainGlobalSync();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'init':
      sync.initialize().catch(console.error);
      break;
      
    case 'start':
      sync.initialize().then(() => {
        sync.startAutoSync();
      }).catch(console.error);
      break;
      
    case 'stop':
      sync.stopAutoSync();
      break;
      
    case 'sync':
      sync.checkForUpdates().catch(console.error);
      break;
      
    case 'status':
      sync.getStatus().then(status => {
        console.log('🧠 AI Brain Global Sync Status:');
        console.log(JSON.stringify(status, null, 2));
      });
      break;
      
    default:
      console.log(`
🧠 AI Brain Global Sync

Usage:
  node global-sync.js <command>

Commands:
  init     Initialize global sync system
  start    Start automatic sync daemon
  stop     Stop automatic sync
  sync     Manual sync check
  status   Show sync status

Examples:
  node global-sync.js init
  node global-sync.js start
  node global-sync.js sync
      `);
  }
}

module.exports = { AIBrainGlobalSync };
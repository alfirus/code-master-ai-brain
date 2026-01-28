#!/usr/bin/env node

/**
 * Advanced Task Delegation API
 * 
 * Provides caching, result persistence, and advanced task management
 * Features:
 * - Request caching (avoid duplicate API calls)
 * - Result persistence (save results to disk)
 * - Task queuing and scheduling
 * - Batch processing
 * - Result retrieval and history
 */

const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

class AdvancedTaskDelegationAPI {
  constructor(cacheDir = null, persistenceDir = null) {
    this.cacheDir = cacheDir || path.join(process.env.HOME, '.ai-brain', '.task-cache');
    this.persistenceDir = persistenceDir || path.join(process.env.HOME, '.ai-brain', '.task-results');
    this.taskQueue = [];
    this.activeTasksMap = new Map();
    this.cacheIndex = this.loadCacheIndex();
    this.resultIndex = this.loadResultIndex();
    
    // Ensure directories exist
    fs.ensureDirSync(this.cacheDir);
    fs.ensureDirSync(this.persistenceDir);
  }

  /**
   * Generate cache key from task parameters
   */
  generateCacheKey(task, options = {}) {
    const cacheData = {
      task: task,
      agent: options.preferredAgents || options.preferredPlatforms || 'default',
      strategy: options.strategy || 'hybrid'
    };
    
    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(cacheData))
      .digest('hex');
    
    return hash;
  }

  /**
   * Load cache index from disk
   */
  loadCacheIndex() {
    try {
      const indexPath = path.join(this.cacheDir, 'index.json');
      if (fs.existsSync(indexPath)) {
        return JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
      }
    } catch (error) {
      console.warn(`Could not load cache index: ${error.message}`);
    }
    
    return {
      entries: {},
      totalSize: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Save cache index to disk
   */
  saveCacheIndex() {
    try {
      const indexPath = path.join(this.cacheDir, 'index.json');
      this.cacheIndex.lastUpdated = new Date().toISOString();
      fs.writeFileSync(indexPath, JSON.stringify(this.cacheIndex, null, 2));
      return true;
    } catch (error) {
      console.error(`Could not save cache index: ${error.message}`);
      return false;
    }
  }

  /**
   * Load result index from disk
   */
  loadResultIndex() {
    try {
      const indexPath = path.join(this.persistenceDir, 'index.json');
      if (fs.existsSync(indexPath)) {
        return JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
      }
    } catch (error) {
      console.warn(`Could not load result index: ${error.message}`);
    }
    
    return {
      results: {},
      totalResults: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Save result index to disk
   */
  saveResultIndex() {
    try {
      const indexPath = path.join(this.persistenceDir, 'index.json');
      this.resultIndex.lastUpdated = new Date().toISOString();
      fs.writeFileSync(indexPath, JSON.stringify(this.resultIndex, null, 2));
      return true;
    } catch (error) {
      console.error(`Could not save result index: ${error.message}`);
      return false;
    }
  }

  /**
   * Check if result is cached
   */
  isCached(task, options = {}) {
    const cacheKey = this.generateCacheKey(task, options);
    return this.cacheIndex.entries.hasOwnProperty(cacheKey);
  }

  /**
   * Get cached result
   */
  getCachedResult(task, options = {}) {
    const cacheKey = this.generateCacheKey(task, options);
    
    if (!this.cacheIndex.entries.hasOwnProperty(cacheKey)) {
      return null;
    }

    try {
      const cacheEntry = this.cacheIndex.entries[cacheKey];
      const cachePath = path.join(this.cacheDir, cacheEntry.filename);
      
      if (fs.existsSync(cachePath)) {
        const cachedData = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
        
        // Check if cache is still valid (24 hours)
        const cacheAge = Date.now() - new Date(cacheEntry.timestamp).getTime();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (cacheAge < maxAge) {
          return {
            ...cachedData,
            fromCache: true,
            cacheAge: Math.round(cacheAge / 1000) + 's'
          };
        } else {
          // Cache expired, delete it
          fs.removeSync(cachePath);
          delete this.cacheIndex.entries[cacheKey];
          this.saveCacheIndex();
          return null;
        }
      }
    } catch (error) {
      console.warn(`Could not retrieve cached result: ${error.message}`);
    }

    return null;
  }

  /**
   * Cache result
   */
  cacheResult(task, options = {}, result) {
    try {
      const cacheKey = this.generateCacheKey(task, options);
      const filename = `${cacheKey}.json`;
      const cachePath = path.join(this.cacheDir, filename);

      fs.writeFileSync(cachePath, JSON.stringify(result, null, 2));

      this.cacheIndex.entries[cacheKey] = {
        filename: filename,
        timestamp: new Date().toISOString(),
        taskPreview: task.substring(0, 100),
        size: fs.statSync(cachePath).size
      };

      this.cacheIndex.totalSize += this.cacheIndex.entries[cacheKey].size;
      this.saveCacheIndex();

      return true;
    } catch (error) {
      console.error(`Could not cache result: ${error.message}`);
      return false;
    }
  }

  /**
   * Save result to persistence
   */
  saveResult(taskId, result) {
    try {
      const resultPath = path.join(this.persistenceDir, `${taskId}.json`);
      
      fs.writeFileSync(resultPath, JSON.stringify({
        taskId: taskId,
        result: result,
        timestamp: new Date().toISOString()
      }, null, 2));

      this.resultIndex.results[taskId] = {
        filename: `${taskId}.json`,
        timestamp: new Date().toISOString(),
        size: fs.statSync(resultPath).size
      };

      this.resultIndex.totalResults++;
      this.saveResultIndex();

      return true;
    } catch (error) {
      console.error(`Could not save result: ${error.message}`);
      return false;
    }
  }

  /**
   * Retrieve saved result
   */
  getResult(taskId) {
    try {
      if (!this.resultIndex.results.hasOwnProperty(taskId)) {
        return null;
      }

      const resultEntry = this.resultIndex.results[taskId];
      const resultPath = path.join(this.persistenceDir, resultEntry.filename);

      if (fs.existsSync(resultPath)) {
        const data = JSON.parse(fs.readFileSync(resultPath, 'utf-8'));
        return data.result;
      }
    } catch (error) {
      console.warn(`Could not retrieve result: ${error.message}`);
    }

    return null;
  }

  /**
   * Queue task for processing
   */
  queueTask(task, options = {}) {
    const taskId = crypto.randomUUID();
    
    const queuedTask = {
      id: taskId,
      task: task,
      options: options,
      status: 'queued',
      createdAt: new Date().toISOString(),
      priority: options.priority || 'normal'
    };

    this.taskQueue.push(queuedTask);
    
    // Sort by priority
    this.taskQueue.sort((a, b) => {
      const priorityMap = { high: 0, normal: 1, low: 2 };
      return priorityMap[a.priority] - priorityMap[b.priority];
    });

    return taskId;
  }

  /**
   * Get task status
   */
  getTaskStatus(taskId) {
    if (this.activeTasksMap.has(taskId)) {
      return this.activeTasksMap.get(taskId);
    }

    const queuedTask = this.taskQueue.find(t => t.id === taskId);
    if (queuedTask) {
      return {
        id: taskId,
        status: queuedTask.status,
        position: this.taskQueue.indexOf(queuedTask) + 1,
        totalQueued: this.taskQueue.length
      };
    }

    return null;
  }

  /**
   * Process next task in queue
   */
  async processNextTask(executor) {
    if (this.taskQueue.length === 0) {
      return null;
    }

    const task = this.taskQueue.shift();
    task.status = 'processing';
    task.startedAt = new Date().toISOString();

    this.activeTasksMap.set(task.id, task);

    try {
      // Check cache first
      const cachedResult = this.getCachedResult(task.task, task.options);
      if (cachedResult) {
        task.status = 'completed';
        task.result = cachedResult;
        task.completedAt = new Date().toISOString();
        this.activeTasksMap.delete(task.id);
        return task;
      }

      // Execute task
      const result = await executor(task.task, task.options);

      // Cache result
      this.cacheResult(task.task, task.options, result);

      // Save result
      this.saveResult(task.id, result);

      task.status = 'completed';
      task.result = result;
      task.completedAt = new Date().toISOString();

      this.activeTasksMap.delete(task.id);

      return task;
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
      task.completedAt = new Date().toISOString();

      this.activeTasksMap.delete(task.id);

      return task;
    }
  }

  /**
   * Process all queued tasks
   */
  async processAllTasks(executor) {
    const results = [];

    while (this.taskQueue.length > 0) {
      const result = await this.processNextTask(executor);
      results.push(result);
    }

    return results;
  }

  /**
   * Batch delegate tasks
   */
  async batchDelegate(tasks, options = {}) {
    const results = [];

    for (const task of tasks) {
      const taskId = this.queueTask(task, options);
      results.push({ taskId, task });
    }

    return results;
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      totalCached: Object.keys(this.cacheIndex.entries).length,
      totalSize: this.cacheIndex.totalSize,
      sizeInMB: (this.cacheIndex.totalSize / (1024 * 1024)).toFixed(2),
      entries: Object.values(this.cacheIndex.entries).map(e => ({
        task: e.taskPreview,
        size: e.size,
        cached: e.timestamp
      }))
    };
  }

  /**
   * Get persistence statistics
   */
  getPersistenceStats() {
    return {
      totalResults: this.resultIndex.totalResults,
      results: Object.entries(this.resultIndex.results).map(([id, entry]) => ({
        taskId: id,
        size: entry.size,
        timestamp: entry.timestamp
      }))
    };
  }

  /**
   * Clear cache
   */
  clearCache(olderThanHours = null) {
    try {
      const now = Date.now();
      let clearedCount = 0;

      for (const [cacheKey, entry] of Object.entries(this.cacheIndex.entries)) {
        const cachePath = path.join(this.cacheDir, entry.filename);
        const age = now - new Date(entry.timestamp).getTime();
        const ageHours = age / (60 * 60 * 1000);

        if (!olderThanHours || ageHours > olderThanHours) {
          if (fs.existsSync(cachePath)) {
            fs.removeSync(cachePath);
            delete this.cacheIndex.entries[cacheKey];
            clearedCount++;
          }
        }
      }

      this.saveCacheIndex();
      return clearedCount;
    } catch (error) {
      console.error(`Could not clear cache: ${error.message}`);
      return 0;
    }
  }

  /**
   * Display cache statistics
   */
  displayCacheStats() {
    const stats = this.getCacheStats();

    console.log('\n📊 Cache Statistics\n');
    console.log('═'.repeat(80));
    console.log(`Total Cached: ${stats.totalCached}`);
    console.log(`Total Size: ${stats.sizeInMB} MB`);

    if (stats.entries.length > 0) {
      console.log('\nCached Tasks:');
      stats.entries.forEach((entry, index) => {
        console.log(`  ${index + 1}. ${entry.task}`);
        console.log(`     Size: ${entry.size} bytes | Cached: ${entry.cached}`);
      });
    }

    console.log('\n' + '═'.repeat(80));
  }

  /**
   * Display persistence statistics
   */
  displayPersistenceStats() {
    const stats = this.getPersistenceStats();

    console.log('\n💾 Persistence Statistics\n');
    console.log('═'.repeat(80));
    console.log(`Total Results: ${stats.totalResults}`);

    if (stats.results.length > 0) {
      console.log('\nSaved Results:');
      stats.results.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.taskId}`);
        console.log(`     Size: ${result.size} bytes | Saved: ${result.timestamp}`);
      });
    }

    console.log('\n' + '═'.repeat(80));
  }
}

module.exports = AdvancedTaskDelegationAPI;

// CLI usage
if (require.main === module) {
  const api = new AdvancedTaskDelegationAPI();

  console.log('\n🚀 Advanced Task Delegation API\n');

  // Queue some sample tasks
  console.log('Queueing sample tasks...\n');
  const taskIds = [];
  
  const sampleTasks = [
    'Write a hello world function',
    'Create a REST API endpoint',
    'Build a React component'
  ];

  sampleTasks.forEach(task => {
    const taskId = api.queueTask(task, { priority: 'normal' });
    taskIds.push(taskId);
    console.log(`✅ Queued: ${task} (ID: ${taskId})`);
  });

  // Display statistics
  api.displayCacheStats();
  api.displayPersistenceStats();

  console.log('\n✨ Advanced Task Delegation API Ready!\n');
}

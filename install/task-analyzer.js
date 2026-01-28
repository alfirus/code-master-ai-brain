#!/usr/bin/env node

/**
 * Task Analysis Engine
 * 
 * Analyzes incoming tasks to determine:
 * - Task type and category
 * - Complexity level
 * - Required capabilities
 * - Estimated execution time
 * - Recommended agents
 */

class TaskAnalyzer {
  constructor() {
    this.taskCategories = {
      'code-generation': {
        keywords: ['generate', 'create', 'write', 'implement', 'build', 'code'],
        capabilities: ['code-generation'],
        complexity: 'medium'
      },
      'code-review': {
        keywords: ['review', 'analyze', 'check', 'audit', 'examine', 'quality'],
        capabilities: ['code-review'],
        complexity: 'medium'
      },
      'refactoring': {
        keywords: ['refactor', 'improve', 'optimize', 'clean', 'restructure'],
        capabilities: ['refactoring'],
        complexity: 'medium-high'
      },
      'system-design': {
        keywords: ['design', 'architecture', 'structure', 'plan', 'blueprint'],
        capabilities: ['system-design', 'architecture'],
        complexity: 'high'
      },
      'documentation': {
        keywords: ['document', 'explain', 'describe', 'guide', 'tutorial'],
        capabilities: ['documentation'],
        complexity: 'low-medium'
      },
      'testing': {
        keywords: ['test', 'unit test', 'integration test', 'e2e', 'coverage'],
        capabilities: ['testing'],
        complexity: 'medium'
      },
      'analysis': {
        keywords: ['analyze', 'analyze', 'examine', 'investigate', 'research'],
        capabilities: ['analysis'],
        complexity: 'medium'
      },
      'data-analysis': {
        keywords: ['data', 'statistics', 'metrics', 'analytics', 'insights'],
        capabilities: ['data-analysis'],
        complexity: 'medium-high'
      },
      'research': {
        keywords: ['research', 'investigate', 'explore', 'study', 'learn'],
        capabilities: ['research'],
        complexity: 'medium'
      },
      'complex-reasoning': {
        keywords: ['complex', 'solve', 'problem', 'algorithm', 'logic'],
        capabilities: ['complex-reasoning'],
        complexity: 'high'
      },
      'general-tasks': {
        keywords: ['help', 'assist', 'support', 'general', 'misc'],
        capabilities: ['general-tasks'],
        complexity: 'low'
      }
    };
  }

  /**
   * Analyze a task
   */
  analyzeTask(task) {
    const analysis = {
      originalTask: task,
      taskType: this.detectTaskType(task),
      complexity: this.estimateComplexity(task),
      requiredCapabilities: this.extractCapabilities(task),
      keywords: this.extractKeywords(task),
      estimatedTokens: this.estimateTokens(task),
      priority: this.determinePriority(task),
      parallelizable: this.isParallelizable(task),
      recommendedAgents: [],
      metadata: {
        length: task.length,
        wordCount: task.split(/\s+/).length,
        hasCode: this.hasCode(task),
        hasMultipleParts: this.hasMultipleParts(task)
      }
    };

    return analysis;
  }

  /**
   * Detect task type
   */
  detectTaskType(task) {
    const lowerTask = task.toLowerCase();
    let bestMatch = 'general-tasks';
    let bestScore = 0;

    for (const [type, config] of Object.entries(this.taskCategories)) {
      const score = config.keywords.reduce((acc, keyword) => {
        return acc + (lowerTask.includes(keyword) ? 1 : 0);
      }, 0);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = type;
      }
    }

    return bestMatch;
  }

  /**
   * Estimate complexity
   */
  estimateComplexity(task) {
    const lowerTask = task.toLowerCase();
    let complexity = 'low';

    // Check for complexity indicators
    const highComplexityKeywords = [
      'complex', 'advanced', 'sophisticated', 'intricate',
      'architecture', 'design pattern', 'algorithm', 'optimization'
    ];
    const mediumComplexityKeywords = [
      'refactor', 'improve', 'enhance', 'integrate', 'multiple'
    ];

    if (highComplexityKeywords.some(kw => lowerTask.includes(kw))) {
      complexity = 'high';
    } else if (mediumComplexityKeywords.some(kw => lowerTask.includes(kw))) {
      complexity = 'medium';
    }

    // Adjust based on task length
    const wordCount = task.split(/\s+/).length;
    if (wordCount > 500) complexity = 'high';
    else if (wordCount > 200) complexity = 'medium';

    return complexity;
  }

  /**
   * Extract required capabilities
   */
  extractCapabilities(task) {
    const taskType = this.detectTaskType(task);
    const config = this.taskCategories[taskType];
    return config ? config.capabilities : ['general-tasks'];
  }

  /**
   * Extract keywords from task
   */
  extractKeywords(task) {
    const words = task.toLowerCase().split(/\s+/);
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been'
    ]);

    return words
      .filter(word => word.length > 3 && !stopWords.has(word))
      .slice(0, 10);
  }

  /**
   * Estimate tokens needed
   */
  estimateTokens(task) {
    // Rough estimation: 1 token ≈ 4 characters
    const estimatedTokens = Math.ceil(task.length / 4);
    return {
      input: estimatedTokens,
      output: Math.ceil(estimatedTokens * 1.5), // Assume output is 1.5x input
      total: Math.ceil(estimatedTokens * 2.5)
    };
  }

  /**
   * Determine priority
   */
  determinePriority(task) {
    const lowerTask = task.toLowerCase();
    const urgentKeywords = ['urgent', 'asap', 'critical', 'emergency', 'immediately'];
    const highKeywords = ['important', 'high', 'priority', 'soon'];

    if (urgentKeywords.some(kw => lowerTask.includes(kw))) {
      return 'critical';
    } else if (highKeywords.some(kw => lowerTask.includes(kw))) {
      return 'high';
    } else if (lowerTask.includes('low') || lowerTask.includes('when possible')) {
      return 'low';
    }

    return 'normal';
  }

  /**
   * Check if task is parallelizable
   */
  isParallelizable(task) {
    const lowerTask = task.toLowerCase();
    const parallelKeywords = [
      'multiple', 'several', 'different', 'various', 'both', 'and',
      'compare', 'analyze', 'review', 'check'
    ];

    return parallelKeywords.some(kw => lowerTask.includes(kw));
  }

  /**
   * Check if task has code
   */
  hasCode(task) {
    return /```|<code>|function|class|const|let|var|import|export/.test(task);
  }

  /**
   * Check if task has multiple parts
   */
  hasMultipleParts(task) {
    const parts = task.split(/\n\n+/);
    return parts.length > 2 || task.includes('1.') || task.includes('a)');
  }

  /**
   * Get task summary
   */
  getSummary(analysis) {
    return {
      type: analysis.taskType,
      complexity: analysis.complexity,
      priority: analysis.priority,
      capabilities: analysis.requiredCapabilities,
      parallelizable: analysis.parallelizable,
      estimatedTokens: analysis.estimatedTokens.total,
      keywords: analysis.keywords
    };
  }
}

module.exports = TaskAnalyzer;

// CLI usage
if (require.main === module) {
  const analyzer = new TaskAnalyzer();
  
  const testTask = `
    Create a React component that displays a list of users with filtering and sorting capabilities.
    The component should:
    1. Fetch users from an API
    2. Display them in a table
    3. Allow filtering by name and email
    4. Support sorting by different columns
    5. Include pagination
    6. Add loading and error states
  `;

  const analysis = analyzer.analyzeTask(testTask);
  console.log('\n📊 Task Analysis Results:\n');
  console.log(JSON.stringify(analysis, null, 2));
}

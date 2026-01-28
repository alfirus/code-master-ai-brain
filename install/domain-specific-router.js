#!/usr/bin/env node

/**
 * Domain-Specific Routing Strategies
 * 
 * Provides specialized routing for different types of development tasks:
 * - Frontend Development (React, Vue, Angular, CSS, UX)
 * - Backend Development (Node.js, Python, APIs, databases)
 * - Data Science (ML, data analysis, statistics)
 * - DevOps (Infrastructure, deployment, monitoring)
 */

class DomainSpecificRouter {
  constructor(multiAgentRegistry, intelligentRouter) {
    this.registry = multiAgentRegistry;
    this.router = intelligentRouter;
    this.domainProfiles = this.initializeDomainProfiles();
  }

  /**
   * Initialize domain profiles with specialized agent selections
   */
  initializeDomainProfiles() {
    return {
      frontend: {
        name: 'Frontend Development',
        keywords: ['react', 'vue', 'angular', 'css', 'html', 'javascript', 'typescript', 'ui', 'ux', 'design', 'component', 'styling'],
        requiredCapabilities: ['code-generation', 'refactoring', 'performance-optimization'],
        preferredAgents: ['gpt-4o', 'claude-3-sonnet', 'copilot-gpt4'],
        agentWeights: {
          'gpt-4o': 0.4,           // Good for React/component design
          'claude-3-sonnet': 0.3,   // Good for code quality
          'copilot-gpt4': 0.3       // Good for code generation
        },
        routingStrategy: 'best-match',
        description: 'Optimized for frontend development tasks'
      },

      backend: {
        name: 'Backend Development',
        keywords: ['node', 'python', 'api', 'database', 'express', 'django', 'flask', 'sql', 'rest', 'graphql', 'authentication', 'middleware'],
        requiredCapabilities: ['code-generation', 'architecture', 'performance-optimization', 'security'],
        preferredAgents: ['gpt-4-turbo', 'claude-3-opus', 'copilot-gpt4-turbo'],
        agentWeights: {
          'gpt-4-turbo': 0.4,       // Excellent for backend architecture
          'claude-3-opus': 0.35,     // Best for complex logic
          'copilot-gpt4-turbo': 0.25 // Good for code generation
        },
        routingStrategy: 'best-match',
        description: 'Optimized for backend and server-side development'
      },

      dataScience: {
        name: 'Data Science & ML',
        keywords: ['machine learning', 'ml', 'data science', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'statistics', 'analysis', 'visualization', 'model'],
        requiredCapabilities: ['code-generation', 'analysis', 'performance-optimization'],
        preferredAgents: ['gpt-4-turbo', 'claude-3-opus', 'gemini-pro'],
        agentWeights: {
          'gpt-4-turbo': 0.35,      // Excellent for complex algorithms
          'claude-3-opus': 0.35,    // Great for explanations
          'gemini-pro': 0.3         // Good for data analysis
        },
        routingStrategy: 'parallel',
        description: 'Optimized for data science and machine learning tasks'
      },

      devops: {
        name: 'DevOps & Infrastructure',
        keywords: ['docker', 'kubernetes', 'ci/cd', 'terraform', 'aws', 'gcp', 'azure', 'monitoring', 'logging', 'deployment', 'infrastructure'],
        requiredCapabilities: ['code-generation', 'architecture', 'security'],
        preferredAgents: ['gpt-4-turbo', 'claude-3-opus', 'copilot-gpt4-turbo'],
        agentWeights: {
          'gpt-4-turbo': 0.4,       // Good for infrastructure
          'claude-3-opus': 0.35,    // Excellent for security
          'copilot-gpt4-turbo': 0.25 // Good for automation
        },
        routingStrategy: 'best-match',
        description: 'Optimized for DevOps and infrastructure tasks'
      },

      mobile: {
        name: 'Mobile Development',
        keywords: ['react-native', 'flutter', 'swift', 'kotlin', 'mobile', 'ios', 'android', 'app'],
        requiredCapabilities: ['code-generation', 'performance-optimization'],
        preferredAgents: ['gpt-4o', 'claude-3-sonnet', 'copilot-gpt4'],
        agentWeights: {
          'gpt-4o': 0.4,            // Good for cross-platform
          'claude-3-sonnet': 0.35,  // Good for patterns
          'copilot-gpt4': 0.25      // Good for code generation
        },
        routingStrategy: 'best-match',
        description: 'Optimized for mobile application development'
      },

      testing: {
        name: 'Testing & QA',
        keywords: ['test', 'jest', 'pytest', 'mocha', 'testing', 'unit test', 'integration test', 'e2e', 'qa', 'coverage'],
        requiredCapabilities: ['code-generation', 'analysis'],
        preferredAgents: ['gpt-4-turbo', 'claude-3-sonnet', 'copilot-code-search'],
        agentWeights: {
          'gpt-4-turbo': 0.4,       // Good for complex test scenarios
          'claude-3-sonnet': 0.35,  // Good for test patterns
          'copilot-code-search': 0.25 // Good for finding similar tests
        },
        routingStrategy: 'best-match',
        description: 'Optimized for testing and quality assurance'
      }
    };
  }

  /**
   * Detect domain from task description
   */
  detectDomain(taskDescription) {
    const lowerTask = taskDescription.toLowerCase();
    const scores = {};

    for (const [domainKey, profile] of Object.entries(this.domainProfiles)) {
      let score = 0;
      
      // Score based on keyword matches
      for (const keyword of profile.keywords) {
        if (lowerTask.includes(keyword)) {
          score += 10;
        }
      }

      scores[domainKey] = score;
    }

    // Find domain with highest score
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) {
      return null; // No domain detected
    }

    const detectedDomain = Object.entries(scores).find(([_, score]) => score === maxScore)[0];
    return detectedDomain;
  }

  /**
   * Get domain profile
   */
  getDomainProfile(domain) {
    return this.domainProfiles[domain] || null;
  }

  /**
   * Route task based on detected domain
   */
  async routeByDomain(taskDescription, baseOptions = {}) {
    const detectedDomain = this.detectDomain(taskDescription);
    
    if (!detectedDomain) {
      // Fall back to intelligent router if no domain detected
      return {
        domain: null,
        agents: this.router.selectAgents(taskDescription, baseOptions),
        strategy: baseOptions.strategy || 'hybrid'
      };
    }

    const profile = this.getDomainProfile(detectedDomain);
    
    return {
      domain: detectedDomain,
      domainName: profile.name,
      agents: this.selectAgentsForDomain(detectedDomain, baseOptions),
      strategy: profile.routingStrategy,
      weights: profile.agentWeights,
      confidence: this.getDetectionConfidence(taskDescription, detectedDomain)
    };
  }

  /**
   * Select agents based on domain profile
   */
  selectAgentsForDomain(domain, baseOptions = {}) {
    const profile = this.getDomainProfile(domain);
    if (!profile) {
      return [];
    }

    // If user specified preferred agents, respect that
    if (baseOptions.preferredAgents) {
      return baseOptions.preferredAgents;
    }

    // Use domain's preferred agents
    const allAgents = this.registry.getAllAgents();
    
    return profile.preferredAgents
      .map(agentId => {
        // Find agent by ID or name
        return allAgents.find(a => 
          a.id === agentId || 
          a.name === agentId ||
          a.id.includes(agentId.replace('-', ''))
        );
      })
      .filter(agent => agent !== undefined);
  }

  /**
   * Get detection confidence score (0-1)
   */
  getDetectionConfidence(taskDescription, domain) {
    const profile = this.getDomainProfile(domain);
    const lowerTask = taskDescription.toLowerCase();
    
    let matchCount = 0;
    for (const keyword of profile.keywords) {
      if (lowerTask.includes(keyword)) {
        matchCount++;
      }
    }

    // Confidence based on number of keyword matches
    const maxKeywords = profile.keywords.length;
    return Math.min(matchCount / 3, 1.0); // Scale: 3 matches = 100% confidence
  }

  /**
   * Get all available domains
   */
  getAvailableDomains() {
    return Object.entries(this.domainProfiles).map(([key, profile]) => ({
      id: key,
      name: profile.name,
      description: profile.description,
      keywords: profile.keywords.slice(0, 5).join(', ') + '...'
    }));
  }

  /**
   * List domain profiles
   */
  listDomains() {
    console.log('\n📚 Available Domain-Specific Routing Profiles\n');
    console.log('═'.repeat(80));

    for (const [domainKey, profile] of Object.entries(this.domainProfiles)) {
      console.log(`\n🎯 ${profile.name.toUpperCase()}`);
      console.log(`   ID: ${domainKey}`);
      console.log(`   Description: ${profile.description}`);
      console.log(`   Preferred Agents: ${profile.preferredAgents.join(', ')}`);
      console.log(`   Strategy: ${profile.routingStrategy}`);
      console.log(`   Keywords: ${profile.keywords.slice(0, 8).join(', ')}`);
    }

    console.log('\n' + '═'.repeat(80));
  }

  /**
   * Analyze task and provide routing recommendation
   */
  analyzeTask(taskDescription) {
    const domain = this.detectDomain(taskDescription);
    const confidence = domain ? this.getDetectionConfidence(taskDescription, domain) : 0;
    
    const analysis = {
      taskDescription: taskDescription.substring(0, 100) + '...',
      detectedDomain: domain,
      confidence: Math.round(confidence * 100) + '%',
      recommendation: null,
      alternativeDomains: null
    };

    if (!domain) {
      analysis.recommendation = 'No specific domain detected. Using hybrid routing strategy.';
    } else {
      const profile = this.getDomainProfile(domain);
      analysis.recommendation = `${profile.name} detected. Using ${profile.routingStrategy} strategy with agents: ${profile.preferredAgents.join(', ')}`;
      
      // Find alternative domains
      const lowerTask = taskDescription.toLowerCase();
      const scores = {};
      
      for (const [domainKey, prof] of Object.entries(this.domainProfiles)) {
        if (domainKey === domain) continue;
        
        let score = 0;
        for (const keyword of prof.keywords) {
          if (lowerTask.includes(keyword)) score += 5;
        }
        scores[domainKey] = score;
      }
      
      const sortedAlternatives = Object.entries(scores)
        .filter(([_, score]) => score > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2);
      
      if (sortedAlternatives.length > 0) {
        analysis.alternativeDomains = sortedAlternatives.map(([id, score]) => ({
          domain: id,
          name: this.domainProfiles[id].name,
          relevance: Math.round((score / 10) * 100) + '%'
        }));
      }
    }

    return analysis;
  }

  /**
   * Display task analysis
   */
  displayAnalysis(taskDescription) {
    const analysis = this.analyzeTask(taskDescription);
    
    console.log('\n📊 Task Analysis\n');
    console.log('═'.repeat(80));
    console.log(`Task: ${analysis.taskDescription}`);
    console.log(`Detected Domain: ${analysis.detectedDomain ? analysis.detectedDomain.toUpperCase() : 'NONE'}`);
    console.log(`Confidence: ${analysis.confidence}`);
    console.log(`\nRecommendation:\n   ${analysis.recommendation}`);
    
    if (analysis.alternativeDomains && analysis.alternativeDomains.length > 0) {
      console.log('\nAlternative Domains:');
      analysis.alternativeDomains.forEach(alt => {
        console.log(`   • ${alt.name} (${alt.relevance} match)`);
      });
    }
    
    console.log('\n' + '═'.repeat(80));
  }
}

module.exports = DomainSpecificRouter;

// CLI usage
if (require.main === module) {
  const MultiAgentRegistry = require('./multi-agent-registry');
  const IntelligentRouter = require('./intelligent-router');
  
  const registry = new MultiAgentRegistry();
  const intelligentRouter = new IntelligentRouter(registry);
  const domainRouter = new DomainSpecificRouter(registry, intelligentRouter);

  console.log('\n🚀 Domain-Specific Routing System\n');

  // List available domains
  domainRouter.listDomains();

  // Example task analyses
  const exampleTasks = [
    'Build a React component with hooks for state management',
    'Create a REST API with Node.js and MongoDB',
    'Implement a machine learning model with TensorFlow',
    'Set up Docker containers for microservices deployment',
    'Write unit tests for a JavaScript function'
  ];

  console.log('\n📋 Example Task Analyses\n');
  console.log('═'.repeat(80));
  
  exampleTasks.forEach((task, index) => {
    console.log(`\n[Example ${index + 1}]`);
    domainRouter.displayAnalysis(task);
  });
}

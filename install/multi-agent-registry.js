#!/usr/bin/env node

/**
 * Multi-Agent Registry
 * 
 * Manages all available AI agents from different platforms
 * Defines capabilities, strengths, and configuration for each agent
 */

class MultiAgentRegistry {
  constructor() {
    this.agents = {};
    this.platforms = {};
    this.initializeAgents();
  }

  /**
   * Initialize all available agents
   */
  initializeAgents() {
    // Anthropic Claude
    this.registerAgent({
      id: 'claude-3-opus',
      platform: 'anthropic',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      capabilities: [
        'complex-reasoning',
        'code-review',
        'system-design',
        'architecture',
        'documentation',
        'analysis',
        'planning'
      ],
      strengths: [
        'Deep reasoning',
        'Complex problem solving',
        'Code quality analysis',
        'System architecture',
        'Long-form content'
      ],
      maxTokens: 200000,
      costPerMTok: 0.015,
      speedRating: 'medium',
      reliabilityRating: 'very-high',
      description: 'Most capable Claude model for complex reasoning and analysis'
    });

    this.registerAgent({
      id: 'claude-3-sonnet',
      platform: 'anthropic',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      capabilities: [
        'code-generation',
        'code-review',
        'refactoring',
        'documentation',
        'analysis',
        'general-tasks'
      ],
      strengths: [
        'Fast responses',
        'Good code quality',
        'Balanced performance',
        'Cost-effective'
      ],
      maxTokens: 200000,
      costPerMTok: 0.003,
      speedRating: 'fast',
      reliabilityRating: 'high',
      description: 'Balanced Claude model for general tasks'
    });

    // OpenAI GPT
    this.registerAgent({
      id: 'gpt-4-turbo',
      platform: 'openai',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      capabilities: [
        'code-generation',
        'code-review',
        'complex-reasoning',
        'analysis',
        'documentation',
        'creative-tasks',
        'general-tasks'
      ],
      strengths: [
        'Versatile',
        'Good code generation',
        'Creative problem solving',
        'Large context window'
      ],
      maxTokens: 128000,
      costPerMTok: 0.01,
      speedRating: 'medium',
      reliabilityRating: 'high',
      description: 'Powerful GPT-4 model with extended context'
    });

    this.registerAgent({
      id: 'gpt-4o',
      platform: 'openai',
      name: 'GPT-4o',
      provider: 'OpenAI',
      capabilities: [
        'code-generation',
        'multimodal',
        'analysis',
        'general-tasks',
        'image-understanding'
      ],
      strengths: [
        'Multimodal capabilities',
        'Fast processing',
        'Good for diverse tasks'
      ],
      maxTokens: 128000,
      costPerMTok: 0.005,
      speedRating: 'fast',
      reliabilityRating: 'high',
      description: 'Optimized GPT-4 model with multimodal support'
    });

    // Google Gemini
    this.registerAgent({
      id: 'gemini-pro',
      platform: 'google',
      name: 'Gemini Pro',
      provider: 'Google',
      capabilities: [
        'code-generation',
        'analysis',
        'research',
        'data-analysis',
        'general-tasks'
      ],
      strengths: [
        'Good code generation',
        'Research capabilities',
        'Data analysis',
        'Cost-effective'
      ],
      maxTokens: 32000,
      costPerMTok: 0.0005,
      speedRating: 'fast',
      reliabilityRating: 'medium-high',
      description: 'Google\'s Gemini model for general tasks'
    });

    this.registerAgent({
      id: 'gemini-pro-vision',
      platform: 'google',
      name: 'Gemini Pro Vision',
      provider: 'Google',
      capabilities: [
        'multimodal',
        'image-understanding',
        'analysis',
        'research'
      ],
      strengths: [
        'Image understanding',
        'Multimodal analysis',
        'Visual problem solving'
      ],
      maxTokens: 32000,
      costPerMTok: 0.0005,
      speedRating: 'fast',
      reliabilityRating: 'medium-high',
      description: 'Google\'s Gemini with vision capabilities'
    });

    // GitHub Copilot - GPT-4
    this.registerAgent({
      id: 'copilot-gpt4',
      platform: 'github-copilot',
      name: 'GitHub Copilot (GPT-4)',
      provider: 'GitHub/OpenAI',
      capabilities: [
        'code-generation',
        'code-completion',
        'refactoring',
        'testing',
        'documentation'
      ],
      strengths: [
        'Code generation',
        'Context-aware completions',
        'IDE integration',
        'Fast responses'
      ],
      maxTokens: 8000,
      costPerMTok: 0,
      speedRating: 'very-fast',
      reliabilityRating: 'high',
      description: 'GitHub Copilot powered by GPT-4'
    });

    // GitHub Copilot - GPT-4 Turbo
    this.registerAgent({
      id: 'copilot-gpt4-turbo',
      platform: 'github-copilot',
      name: 'GitHub Copilot (GPT-4 Turbo)',
      provider: 'GitHub/OpenAI',
      capabilities: [
        'code-generation',
        'code-completion',
        'refactoring',
        'testing',
        'documentation',
        'complex-reasoning'
      ],
      strengths: [
        'Enhanced code generation',
        'Larger context window',
        'Better reasoning',
        'Complex code patterns',
        'IDE integration'
      ],
      maxTokens: 16000,
      costPerMTok: 0,
      speedRating: 'fast',
      reliabilityRating: 'very-high',
      description: 'GitHub Copilot powered by GPT-4 Turbo with extended context'
    });

    // GitHub Copilot - GPT-3.5 Turbo
    this.registerAgent({
      id: 'copilot-gpt35-turbo',
      platform: 'github-copilot',
      name: 'GitHub Copilot (GPT-3.5 Turbo)',
      provider: 'GitHub/OpenAI',
      capabilities: [
        'code-generation',
        'code-completion',
        'refactoring',
        'testing'
      ],
      strengths: [
        'Lightweight',
        'Very fast responses',
        'Good for simple tasks',
        'Low latency'
      ],
      maxTokens: 4000,
      costPerMTok: 0,
      speedRating: 'very-fast',
      reliabilityRating: 'high',
      description: 'GitHub Copilot powered by GPT-3.5 Turbo - lightweight and fast'
    });

    // GitHub Copilot - Claude
    this.registerAgent({
      id: 'copilot-claude',
      platform: 'github-copilot',
name: 'GitHub Copilot (Claude)',
      provider: 'GitHub/Anthropic',
      capabilities: [
        'code-generation',
        'code-review',
        'refactoring',
        'documentation',
        'complex-reasoning',
        'analysis'
      ],
      strengths: [
        'Better reasoning',
        'Code review quality',
        'Documentation',
        'Complex problem solving',
        'Code analysis'
      ],
      maxTokens: 8000,
      costPerMTok: 0,
      speedRating: 'fast',
      reliabilityRating: 'very-high',
      description: 'GitHub Copilot powered by Claude - better reasoning and code review'
    });

    // GitHub Copilot - Code Search
    this.registerAgent({
      id: 'copilot-code-search',
      platform: 'github-copilot',
      name: 'GitHub Copilot (Code Search)',
      provider: 'GitHub',
      capabilities: [
        'code-search',
        'analysis',
        'research',
        'code-understanding'
      ],
      strengths: [
        'Code search',
        'Repository understanding',
        'Pattern matching',
        'Code discovery'
      ],
      maxTokens: 4000,
      costPerMTok: 0,
      speedRating: 'very-fast',
      reliabilityRating: 'high',
      description: 'GitHub Copilot specialized for code search and repository understanding'
    });

    // GitHub Copilot - Chat
    this.registerAgent({
      id: 'copilot-chat',
      platform: 'github-copilot',
      name: 'GitHub Copilot (Chat)',
      provider: 'GitHub/OpenAI',
      capabilities: [
        'code-generation',
        'code-review',
        'documentation',
        'general-tasks',
        'explanation'
      ],
      strengths: [
        'Conversational interface',
        'Code explanations',
        'Interactive assistance',
        'Chat-based help'
      ],
      maxTokens: 8000,
      costPerMTok: 0,
      speedRating: 'fast',
      reliabilityRating: 'high',
      description: 'GitHub Copilot Chat - conversational code assistance'
    });

    // GitHub Copilot - Enterprise
    this.registerAgent({
      id: 'copilot-enterprise',
      platform: 'github-copilot',
      name: 'GitHub Copilot (Enterprise)',
      provider: 'GitHub/OpenAI',
      capabilities: [
        'code-generation',
        'code-review',
        'refactoring',
        'testing',
        'documentation',
        'security-analysis',
        'complex-reasoning'
      ],
      strengths: [
        'Advanced code generation',
        'Security scanning',
        'Enterprise features',
        'Extended context',
        'Organization-wide insights'
      ],
      maxTokens: 16000,
      costPerMTok: 0,
      speedRating: 'fast',
      reliabilityRating: 'very-high',
      description: 'GitHub Copilot Enterprise - advanced features with security scanning'
    });

    // OpenCodeZen
    this.registerAgent({
      id: 'opencodezen-pro',
      platform: 'opencodezen',
      name: 'OpenCodeZen Pro',
      provider: 'OpenCodeZen',
      capabilities: [
        'code-generation',
        'code-review',
        'optimization',
        'refactoring',
        'testing',
        'documentation'
      ],
      strengths: [
        'Code optimization',
        'Performance analysis',
        'Code quality',
        'Best practices'
      ],
      maxTokens: 16000,
      costPerMTok: 0.001,
      speedRating: 'fast',
      reliabilityRating: 'high',
      description: 'Specialized code generation and optimization'
    });

    // Ollama Local Models
    this.registerAgent({
      id: 'ollama-llama2',
      platform: 'ollama',
      name: 'Llama 2 (Local)',
      provider: 'Ollama/Meta',
      capabilities: [
        'code-generation',
        'general-tasks',
        'analysis'
      ],
      strengths: [
        'Local execution',
        'No API costs',
        'Privacy-focused',
        'Fast for local'
      ],
      maxTokens: 4096,
      costPerMTok: 0,
      speedRating: 'medium',
      reliabilityRating: 'medium',
      isLocal: true,
      description: 'Open-source Llama 2 model running locally'
    });

    this.registerAgent({
      id: 'ollama-mistral',
      platform: 'ollama',
      name: 'Mistral (Local)',
      provider: 'Ollama/Mistral',
      capabilities: [
        'code-generation',
        'general-tasks',
        'analysis',
        'reasoning'
      ],
      strengths: [
        'Local execution',
        'Good reasoning',
        'No API costs',
        'Efficient'
      ],
      maxTokens: 8192,
      costPerMTok: 0,
      speedRating: 'medium',
      reliabilityRating: 'medium-high',
      isLocal: true,
      description: 'Mistral model running locally via Ollama'
    });

    this.registerAgent({
      id: 'ollama-neural-chat',
      platform: 'ollama',
      name: 'Neural Chat (Local)',
      provider: 'Ollama/Intel',
      capabilities: [
        'code-generation',
        'general-tasks',
        'conversation'
      ],
      strengths: [
        'Local execution',
        'Conversational',
        'No API costs'
      ],
      maxTokens: 4096,
      costPerMTok: 0,
      speedRating: 'fast',
      reliabilityRating: 'medium',
      isLocal: true,
      description: 'Intel Neural Chat model running locally'
    });
  }

  /**
   * Register a new agent
   */
  registerAgent(agentConfig) {
    this.agents[agentConfig.id] = agentConfig;
    
    if (!this.platforms[agentConfig.platform]) {
      this.platforms[agentConfig.platform] = [];
    }
    this.platforms[agentConfig.platform].push(agentConfig.id);
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId) {
    return this.agents[agentId] || null;
  }

  /**
   * Get all agents
   */
  getAllAgents() {
    return Object.values(this.agents);
  }

  /**
   * Get agents by platform
   */
  getAgentsByPlatform(platform) {
    const agentIds = this.platforms[platform] || [];
    return agentIds.map(id => this.agents[id]);
  }

  /**
   * Get agents by capability
   */
  getAgentsByCapability(capability) {
    return Object.values(this.agents).filter(agent =>
      agent.capabilities.includes(capability)
    );
  }

  /**
   * Get best agents for a task
   */
  getBestAgentsForTask(taskType, count = 3) {
    const candidates = Object.values(this.agents).filter(agent =>
      agent.capabilities.includes(taskType)
    );

    // Sort by reliability and speed
    candidates.sort((a, b) => {
      const reliabilityScore = this.getReliabilityScore(b.reliabilityRating) - 
                               this.getReliabilityScore(a.reliabilityRating);
      if (reliabilityScore !== 0) return reliabilityScore;
      
      return this.getSpeedScore(b.speedRating) - this.getSpeedScore(a.speedRating);
    });

    return candidates.slice(0, count);
  }

  /**
   * Get reliability score
   */
  getReliabilityScore(rating) {
    const scores = {
      'very-high': 5,
      'high': 4,
      'medium-high': 3,
      'medium': 2,
      'low': 1
    };
    return scores[rating] || 0;
  }

  /**
   * Get speed score
   */
  getSpeedScore(rating) {
    const scores = {
      'very-fast': 5,
      'fast': 4,
      'medium': 3,
      'slow': 2,
      'very-slow': 1
    };
    return scores[rating] || 0;
  }

  /**
   * Get agents by multiple capabilities
   */
  getAgentsByCapabilities(capabilities) {
    return Object.values(this.agents).filter(agent =>
      capabilities.some(cap => agent.capabilities.includes(cap))
    );
  }

  /**
   * Get local agents only
   */
  getLocalAgents() {
    return Object.values(this.agents).filter(agent => agent.isLocal);
  }

  /**
   * Get cloud agents only
   */
  getCloudAgents() {
    return Object.values(this.agents).filter(agent => !agent.isLocal);
  }

  /**
   * Get agent statistics
   */
  getStatistics() {
    const agents = Object.values(this.agents);
    return {
      totalAgents: agents.length,
      byPlatform: Object.keys(this.platforms).reduce((acc, platform) => {
        acc[platform] = this.platforms[platform].length;
        return acc;
      }, {}),
      localAgents: agents.filter(a => a.isLocal).length,
      cloudAgents: agents.filter(a => !a.isLocal).length,
      capabilities: [...new Set(agents.flatMap(a => a.capabilities))]
    };
  }

  /**
   * List all agents in a formatted way
   */
  listAgents() {
    const agents = Object.values(this.agents);
    console.log('\n🤖 Available AI Agents\n');
    console.log('═'.repeat(80));

    agents.forEach(agent => {
      console.log(`\n📌 ${agent.name} (${agent.id})`);
      console.log(`   Provider: ${agent.provider}`);
      console.log(`   Platform: ${agent.platform}${agent.isLocal ? ' (Local)' : ' (Cloud)'}`);
      console.log(`   Speed: ${agent.speedRating} | Reliability: ${agent.reliabilityRating}`);
      console.log(`   Max Tokens: ${agent.maxTokens}`);
      if (!agent.isLocal) {
        console.log(`   Cost: $${agent.costPerMTok}/1M tokens`);
      }
      console.log(`   Capabilities: ${agent.capabilities.join(', ')}`);
      console.log(`   Description: ${agent.description}`);
    });

    console.log('\n' + '═'.repeat(80));
  }
}

module.exports = MultiAgentRegistry;

// CLI usage
if (require.main === module) {
  const registry = new MultiAgentRegistry();
  registry.listAgents();
  
  console.log('\n📊 Statistics:');
  console.log(JSON.stringify(registry.getStatistics(), null, 2));
}

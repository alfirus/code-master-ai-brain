#!/usr/bin/env node

/**
 * Expanded Multi-Agent Registry
 * 
 * Extended version with additional models from all platforms:
 * - Anthropic: More Claude variants
 * - OpenAI: GPT-4 Vision, additional models
 * - Google: Gemini variants
 * - GitHub Copilot: Extended models
 * - And more...
 */

class ExpandedMultiAgentRegistry {
  constructor() {
    this.agents = [];
    this.initializeAgents();
  }

  /**
   * Initialize all available agents
   */
  initializeAgents() {
    // ANTHROPIC - Claude Models
    this.registerAgent({
      id: 'claude-3-opus',
      platform: 'anthropic',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      capabilities: ['code-generation', 'analysis', 'reasoning', 'architecture'],
      strengths: ['complex reasoning', 'code quality', 'detailed explanations'],
      maxTokens: 200000,
      costPerMTok: 0.015,
      speedRating: 'medium',
      reliabilityRating: 'very-high',
      description: 'Most capable Claude model for complex tasks'
    });

    this.registerAgent({
      id: 'claude-3-sonnet',
      platform: 'anthropic',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      capabilities: ['code-generation', 'analysis', 'refactoring'],
      strengths: ['balanced performance', 'code generation', 'quick responses'],
      maxTokens: 200000,
      costPerMTok: 0.003,
      speedRating: 'fast',
      reliabilityRating: 'high',
      description: 'Balanced Claude model for most tasks'
    });

    this.registerAgent({
      id: 'claude-3-haiku',
      platform: 'anthropic',
      name: 'Claude 3 Haiku',
      provider: 'Anthropic',
      capabilities: ['code-generation', 'quick-analysis'],
      strengths: ['fast responses', 'lightweight', 'cost-effective'],
      maxTokens: 200000,
      costPerMTok: 0.0008,
      speedRating: 'very-fast',
      reliabilityRating: 'medium',
      description: 'Fastest and cheapest Claude model'
    });

    // OPENAI - GPT Models
    this.registerAgent({
      id: 'gpt-4-turbo',
      platform: 'openai',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      capabilities: ['code-generation', 'analysis', 'reasoning', 'architecture'],
      strengths: ['advanced reasoning', 'code generation', 'complex tasks'],
      maxTokens: 128000,
      costPerMTok: 0.01,
      speedRating: 'fast',
      reliabilityRating: 'very-high',
      description: 'Advanced GPT-4 model with extended context'
    });

    this.registerAgent({
      id: 'gpt-4-vision',
      platform: 'openai',
      name: 'GPT-4 Vision',
      provider: 'OpenAI',
      capabilities: ['code-generation', 'image-analysis', 'visual-understanding'],
      strengths: ['image understanding', 'visual code analysis', 'UI/UX review'],
      maxTokens: 128000,
      costPerMTok: 0.01,
      speedRating: 'medium',
      reliabilityRating: 'high',
      description: 'GPT-4 with vision capabilities for image analysis'
    });

    this.registerAgent({
      id: 'gpt-4o',
      platform: 'openai',
      name: 'GPT-4o',
      provider: 'OpenAI',
      capabilities: ['code-generation', 'analysis', 'multimodal'],
      strengths: ['optimized performance', 'balanced cost', 'multimodal'],
      maxTokens: 128000,
      costPerMTok: 0.005,
      speedRating: 'very-fast',
      reliabilityRating: 'high',
      description: 'Optimized GPT-4 model for best performance/cost ratio'
    });

    this.registerAgent({
      id: 'gpt-3.5-turbo',
      platform: 'openai',
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      capabilities: ['code-generation', 'quick-analysis'],
      strengths: ['fast responses', 'cost-effective', 'simple tasks'],
      maxTokens: 16000,
      costPerMTok: 0.0005,
      speedRating: 'very-fast',
      reliabilityRating: 'medium',
      description: 'Fast and cost-effective model for simple tasks'
    });

    // GOOGLE - Gemini Models
    this.registerAgent({
      id: 'gemini-pro',
      platform: 'google',
      name: 'Gemini Pro',
      provider: 'Google',
      capabilities: ['code-generation', 'analysis', 'reasoning'],
      strengths: ['balanced performance', 'good reasoning', 'multimodal'],
      maxTokens: 32000,
      costPerMTok: 0.0005,
      speedRating: 'fast',
      reliabilityRating: 'high',
      description: 'Google\'s advanced reasoning model'
    });

    this.registerAgent({
      id: 'gemini-pro-vision',
      platform: 'google',
      name: 'Gemini Pro Vision',
      provider: 'Google',
      capabilities: ['code-generation', 'image-analysis', 'visual-understanding'],
      strengths: ['image understanding', 'visual analysis', 'multimodal'],
      maxTokens: 32000,
      costPerMTok: 0.0005,
      speedRating: 'fast',
      reliabilityRating: 'high',
      description: 'Gemini with vision capabilities'
    });

    this.registerAgent({
      id: 'gemini-ultra',
      platform: 'google',
      name: 'Gemini Ultra',
      provider: 'Google',
      capabilities: ['code-generation', 'analysis', 'reasoning', 'architecture'],
      strengths: ['advanced reasoning', 'complex tasks', 'multimodal'],
      maxTokens: 32000,
      costPerMTok: 0.001,
      speedRating: 'medium',
      reliabilityRating: 'very-high',
      description: 'Google\'s most advanced model'
    });

    // GITHUB COPILOT - Extended Models
    this.registerAgent({
      id: 'copilot-gpt4',
      platform: 'github-copilot',
      name: 'Copilot GPT-4',
      provider: 'GitHub',
      capabilities: ['code-generation', 'code-completion'],
      strengths: ['code generation', 'IDE integration', 'fast'],
      maxTokens: 8000,
      costPerMTok: 0.01,
      speedRating: 'very-fast',
      reliabilityRating: 'high',
      description: 'GitHub Copilot with GPT-4'
    });

    this.registerAgent({
      id: 'copilot-gpt4-turbo',
      platform: 'github-copilot',
      name: 'Copilot GPT-4 Turbo',
      provider: 'GitHub',
      capabilities: ['code-generation', 'code-completion', 'refactoring'],
      strengths: ['advanced code generation', 'refactoring', 'architecture'],
      maxTokens: 16000,
      costPerMTok: 0.01,
      speedRating: 'fast',
      reliabilityRating: 'very-high',
      description: 'GitHub Copilot with GPT-4 Turbo'
    });

    this.registerAgent({
      id: 'copilot-gpt35-turbo',
      platform: 'github-copilot',
      name: 'Copilot GPT-3.5 Turbo',
      provider: 'GitHub',
      capabilities: ['code-generation', 'code-completion'],
      strengths: ['fast code generation', 'lightweight', 'cost-effective'],
      maxTokens: 4000,
      costPerMTok: 0.0005,
      speedRating: 'very-fast',
      reliabilityRating: 'medium',
      description: 'GitHub Copilot with GPT-3.5 Turbo'
    });

    this.registerAgent({
      id: 'copilot-claude',
      platform: 'github-copilot',
      name: 'Copilot Claude',
      provider: 'GitHub',
      capabilities: ['code-generation', 'code-completion', 'analysis'],
      strengths: ['code quality', 'analysis', 'explanations'],
      maxTokens: 8000,
      costPerMTok: 0.003,
      speedRating: 'fast',
      reliabilityRating: 'very-high',
      description: 'GitHub Copilot with Claude'
    });

    this.registerAgent({
      id: 'copilot-code-search',
      platform: 'github-copilot',
      name: 'Copilot Code Search',
      provider: 'GitHub',
      capabilities: ['code-search', 'code-analysis'],
      strengths: ['finding similar code', 'code patterns', 'refactoring'],
      maxTokens: 4000,
      costPerMTok: 0.0005,
      speedRating: 'very-fast',
      reliabilityRating: 'high',
      description: 'GitHub Copilot specialized for code search'
    });

    this.registerAgent({
      id: 'copilot-chat',
      platform: 'github-copilot',
      name: 'Copilot Chat',
      provider: 'GitHub',
      capabilities: ['code-generation', 'explanation', 'debugging'],
      strengths: ['conversational', 'debugging', 'explanations'],
      maxTokens: 8000,
      costPerMTok: 0.003,
      speedRating: 'fast',
      reliabilityRating: 'high',
      description: 'GitHub Copilot Chat for conversational coding'
    });

    this.registerAgent({
      id: 'copilot-enterprise',
      platform: 'github-copilot',
      name: 'Copilot Enterprise',
      provider: 'GitHub',
      capabilities: ['code-generation', 'code-completion', 'refactoring', 'architecture'],
      strengths: ['enterprise features', 'advanced analysis', 'security'],
      maxTokens: 16000,
      costPerMTok: 0.015,
      speedRating: 'fast',
      reliabilityRating: 'very-high',
      description: 'GitHub Copilot Enterprise with advanced features'
    });

    // OPENCODEZEN
    this.registerAgent({
      id: 'opencodezen-pro',
      platform: 'opencodezen',
      name: 'OpenCodeZen Pro',
      provider: 'OpenCodeZen',
      capabilities: ['code-generation', 'code-review', 'optimization'],
      strengths: ['code review', 'optimization', 'best practices'],
      maxTokens: 8000,
      costPerMTok: 0.001,
      speedRating: 'fast',
      reliabilityRating: 'high',
      description: 'OpenCodeZen Pro for code quality'
    });

    // OLLAMA - Local Models
    this.registerAgent({
      id: 'ollama-llama2',
      platform: 'ollama',
      name: 'Llama 2',
      provider: 'Meta (Local)',
      capabilities: ['code-generation', 'analysis'],
      strengths: ['local execution', 'privacy', 'no cost'],
      maxTokens: 4096,
      costPerMTok: 0,
      speedRating: 'medium',
      reliabilityRating: 'medium',
      isLocal: true,
      description: 'Meta\'s Llama 2 model running locally'
    });

    this.registerAgent({
      id: 'ollama-mistral',
      platform: 'ollama',
      name: 'Mistral',
      provider: 'Mistral (Local)',
      capabilities: ['code-generation', 'analysis'],
      strengths: ['local execution', 'fast', 'no cost'],
      maxTokens: 8000,
      costPerMTok: 0,
      speedRating: 'fast',
      reliabilityRating: 'medium',
      isLocal: true,
      description: 'Mistral model running locally'
    });

    this.registerAgent({
      id: 'ollama-neural-chat',
      platform: 'ollama',
      name: 'Neural Chat',
      provider: 'Intel (Local)',
      capabilities: ['code-generation', 'conversation'],
      strengths: ['local execution', 'conversational', 'no cost'],
      maxTokens: 4096,
      costPerMTok: 0,
      speedRating: 'medium',
      reliabilityRating: 'medium',
      isLocal: true,
      description: 'Intel\'s Neural Chat model running locally'
    });
  }

  /**
   * Register an agent
   */
  registerAgent(agentConfig) {
    this.agents.push(agentConfig);
  }

  /**
   * Get all agents
   */
  getAllAgents() {
    return this.agents;
  }

  /**
   * Get agents by platform
   */
  getAgentsByPlatform(platform) {
    return this.agents.filter(a => a.platform === platform);
  }

  /**
   * Get agents by capability
   */
  getAgentsByCapability(capability) {
    return this.agents.filter(a => a.capabilities.includes(capability));
  }

  /**
   * Get agent by ID
   */
  getAgentById(id) {
    return this.agents.find(a => a.id === id);
  }

  /**
   * List all agents
   */
  listAgents() {
    console.log('\n🤖 Expanded Multi-Agent Registry\n');
    console.log('═'.repeat(100));

    const platformGroups = {};
    for (const agent of this.agents) {
      if (!platformGroups[agent.platform]) {
        platformGroups[agent.platform] = [];
      }
      platformGroups[agent.platform].push(agent);
    }

    for (const [platform, agents] of Object.entries(platformGroups)) {
      console.log(`\n📦 ${platform.toUpperCase()} (${agents.length} models)`);
      console.log('─'.repeat(100));

      agents.forEach(agent => {
        console.log(`  ✅ ${agent.name}`);
        console.log(`     ID: ${agent.id}`);
        console.log(`     Capabilities: ${agent.capabilities.join(', ')}`);
        console.log(`     Max Tokens: ${agent.maxTokens}`);
        console.log(`     Cost: $${agent.costPerMTok}/1K tokens`);
        console.log(`     Speed: ${agent.speedRating} | Reliability: ${agent.reliabilityRating}`);
        if (agent.isLocal) {
          console.log(`     🏠 Local Model (No API key required)`);
        }
        console.log('');
      });
    }

    console.log('═'.repeat(100));
    console.log(`\n📊 Total Agents: ${this.agents.length}`);
    console.log(`📊 Total Platforms: ${Object.keys(platformGroups).length}`);
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const stats = {
      totalAgents: this.agents.length,
      byPlatform: {},
      byCapability: {},
      avgMaxTokens: 0,
      avgCost: 0,
      localModels: 0
    };

    let totalTokens = 0;
    let totalCost = 0;

    for (const agent of this.agents) {
      // By platform
      if (!stats.byPlatform[agent.platform]) {
        stats.byPlatform[agent.platform] = 0;
      }
      stats.byPlatform[agent.platform]++;

      // By capability
      for (const cap of agent.capabilities) {
        if (!stats.byCapability[cap]) {
          stats.byCapability[cap] = 0;
        }
        stats.byCapability[cap]++;
      }

      // Totals
      totalTokens += agent.maxTokens;
      totalCost += agent.costPerMTok;

      if (agent.isLocal) {
        stats.localModels++;
      }
    }

    stats.avgMaxTokens = Math.round(totalTokens / this.agents.length);
    stats.avgCost = (totalCost / this.agents.length).toFixed(6);

    return stats;
  }

  /**
   * Display statistics
   */
  displayStatistics() {
    const stats = this.getStatistics();

    console.log('\n📊 Registry Statistics\n');
    console.log('═'.repeat(80));

    console.log(`Total Agents: ${stats.totalAgents}`);
    console.log(`Local Models: ${stats.localModels}`);
    console.log(`Avg Max Tokens: ${stats.avgMaxTokens}`);
    console.log(`Avg Cost: $${stats.avgCost}/1K tokens`);

    console.log(`\nAgents by Platform:`);
    for (const [platform, count] of Object.entries(stats.byPlatform)) {
      console.log(`  ${platform}: ${count}`);
    }

    console.log(`\nCapabilities Coverage:`);
    for (const [capability, count] of Object.entries(stats.byCapability)) {
      console.log(`  ${capability}: ${count} agents`);
    }

    console.log('\n' + '═'.repeat(80));
  }
}

module.exports = ExpandedMultiAgentRegistry;

// CLI usage
if (require.main === module) {
  const registry = new ExpandedMultiAgentRegistry();
  registry.listAgents();
  registry.displayStatistics();
}

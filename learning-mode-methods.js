  // Learning mode delegation
  async delegateWithLearningMode(problem) {
    // 90% chance to delegate in learning mode
    const shouldDelegate = Math.random() < 0.9;
    
    if (shouldDelegate) {
      const agent = determineOptimalAgent(problem);
      console.log(`🔄 Learning Mode: Delegating to ${agent}: "${problem}"`);
      
      // Simulate delegation and learning
      const solution = await this.simulateAgentDelegation(problem, agent);
      
      // Learn from the solution
      await this.learnFromAgentSolution(problem, solution, agent);
      
      return {
        method: 'learning-mode-delegation',
        agent,
        solution,
        confidence: 0.85 + (Math.random() * 0.1),
        sources: [`Learning mode delegation to ${agent}`]
      };
    }
    
    // 10% chance to handle with brain (to maintain skills)
    console.log('🧠 Learning Mode: Using brain enhancement');
    return await this.handleWithBrain(problem);
  }

  async simulateAgentDelegation(problem, agent) {
    // Simulate different agent responses
    const responses = {
      '@claude-ai': {
        solution: `Claude AI detailed solution for: ${problem}`,
        reasoning: 'Complex analysis with step-by-step approach',
        confidence: 0.9
      },
      '@github-copilot-coder': {
        solution: `GitHub Copilot implementation for: ${problem}`,
        reasoning: 'Code generation with best practices',
        confidence: 0.85
      },
      '@gemini-analyzer': {
        solution: `Gemini analysis for: ${problem}`,
        reasoning: 'Data-driven analytical approach',
        confidence: 0.88
      }
    };
    
    return responses[agent] || responses['@claude-ai'];
  }

  async learnFromAgentSolution(problem, solution, agent) {
    const skillName = `learned-${agent}-${problem.substring(0, 20).replace(/\s+/g, '-')}-${Date.now()}`;
    const skillContent = `# Learned Skill from ${agent}

## Problem
${problem}

## Agent Solution
${solution.solution}

## Agent Reasoning
${solution.reasoning}

## Learning Context
- Agent: ${agent}
- Mode: Learning Mode (90% delegation)
- Confidence: ${solution.confidence}
- Generated: ${new Date().toISOString()}

---

*This skill was automatically learned during learning phase*`;

    try {
      await this.brain.addSkill(skillName, skillContent);
      console.log(`🧠 Learned new skill: ${skillName}`);
    } catch (error) {
      console.error('❌ Failed to learn from agent solution:', error.message);
    }
  }
/**
 * Code Master AI Brain Integration
 */

const { AIBrainAgent } = require("./install/agent-integration");

function determineOptimalAgent(task) {
  const taskLower = task.toLowerCase();
  
  if (taskLower.includes("complex") || taskLower.includes("architecture") || taskLower.includes("detailed") || taskLower.includes("strategic")) {
    return "@claude-ai";
  }
  
  if (taskLower.includes("write") || taskLower.includes("implement") || taskLower.includes("boilerplate")) {
    return "@github-copilot-coder";
  }
  
  if (taskLower.includes("analyze") || taskLower.includes("optimize") || taskLower.includes("performance")) {
    return "@gemini-analyzer";
  }
  
  return "Code Master Core";
}

class CodeMasterBrain {
  constructor() {
    this.brain = null;
    this.initialized = false;
    this.learningMode = false;
  }

  async initialize() {
    if (!this.initialized) {
      console.log("🧠 Initializing Code Master with AI Brain...");
      this.brain = new AIBrainAgent({
        brainPath: process.env.AI_BRAIN_PATH || null,
        autoLoad: true,
        contextAware: true
      });
      this.initialized = await this.brain.initialize();
      
      if (this.initialized) {
        console.log("✅ Code Master AI Brain integration ready");
        if (typeof global !== "undefined") {
          global.codeMasterBrain = this;
          global.brain = this.brain;
        }
      }
    }
    return this.initialized;
  }

  async solve(problem, context = {}) {
    await this.initialize();
    console.log(`🎯 Code Master solving: "${problem}"`);
    
    if (this.learningMode) {
      return await this.delegateWithLearningMode(problem);
    }
    
    const enhancedContext = this.enhanceContext(problem, context);
    const suggestions = await this.brain.suggestSkills(enhancedContext);
    
    if (suggestions.length > 0) {
      console.log(`💡 Brain suggests: ${suggestions[0].name}`);
      const solution = await this.applyBrainSolution(problem, suggestions[0]);
      return solution;
    }
    
    return this.defaultSolve(problem, enhancedContext);
  }

  async delegateWithLearningMode(problem) {
    const shouldDelegate = Math.random() < 0.9;
    
    if (shouldDelegate) {
      const agent = determineOptimalAgent(problem);
      console.log(`🔄 Learning Mode: Delegating to ${agent}: "${problem}"`);
      
      const solution = await this.simulateAgentDelegation(problem, agent);
      await this.learnFromAgentSolution(problem, solution, agent);
      
      return {
        method: "learning-mode-delegation",
        agent,
        solution,
        confidence: 0.85 + Math.random() * 0.1
      };
    }
    
    console.log("🧠 Learning Mode: Using brain enhancement");
    return await this.handleWithBrain(problem);
  }

  async simulateAgentDelegation(problem, agent) {
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    const responses = {
      "@claude-ai": {
        solution: `Claude AI detailed solution for: ${problem}`,
        reasoning: "Complex analysis with step-by-step breakdown",
        confidence: 0.9
      },
      "@github-copilot-coder": {
        solution: `GitHub Copilot implementation for: ${problem}`,
        reasoning: "Code generation with best practices",
        confidence: 0.85
      },
      "@gemini-analyzer": {
        solution: `Gemini analysis for: ${problem}`,
        reasoning: "Data-driven analysis and optimization",
        confidence: 0.88
      }
    };
    
    return responses[agent] || responses["@claude-ai"];
  }

  async learnFromAgentSolution(problem, solution, agent) {
    const skillName = `learned-${agent}-${Date.now()}`;
    const skillContent = `# Learned Skill from ${agent}

## Problem
${problem}

## Agent Solution
${solution.solution}

## Agent Reasoning
${solution.reasoning}

---

*Auto-generated during learning phase*
`;

    try {
      await this.brain.addSkill(skillName, skillContent);
      console.log(`🧠 Learned new skill: ${skillName}`);
    } catch (error) {
      console.error("❌ Failed to learn from agent solution:", error.message);
    }
  }

  toggleLearningMode(enable) {
    this.learningMode = enable;
    const mode = enable ? "ON" : "OFF";
    console.log(`🧠 Learning Mode ${mode}`);
    
    if (enable) {
      console.log("🚀 Ready to delegate 90% to specialized agents");
      console.log("🧠 Focus: Learning and brain enhancement");
    } else {
      console.log("🧠 Returning to normal operation");
    }
    
    return { learningMode: this.learningMode };
  }

  async handleWithBrain(problem) {
    const context = this.enhanceContext(problem, {});
    const suggestions = await this.brain.suggestSkills(context);
    
    if (suggestions.length > 0) {
      const skill = await this.brain.getSkill(suggestions[0].name);
      const appliedSkill = await this.brain.applySkill(suggestions[0].name, context);
      
      return {
        method: "brain-enhanced",
        skill: suggestions[0].name,
        solution: appliedSkill.processedContent,
        confidence: 0.8 + suggestions[0].relevance * 0.05
      };
    }
    
    return {
      method: "code-master-default",
      task: problem,
      confidence: 0.6
    };
  }

  enhanceContext(problem, userContext) {
    const context = { ...userContext };
    return context;
  }

  defaultSolve(problem, context) {
    return {
      method: "code-master-default",
      solution: {
        approach: "traditional-problem-solving"
      },
      confidence: 0.6,
      sources: ["Code Master core knowledge"]
    };
  }

  applyBrainSolution(problem, suggestion) {
    const context = this.enhanceContext(problem, {});
    return this.brain.applySkill(suggestion.name, context);
  }

  async getStatus() {
    if (!this.initialized) {
      return { status: "not_initialized" };
    }

    const context = await this.brain.getContext();
    
    return {
      status: "active",
      skillsAvailable: context.availableSkills.length,
      brainSize: context.skillsCount,
      lastUpdated: context.lastUpdated,
      learningMode: this.learningMode,
      integration: "code-master-enhanced"
    };
  }
}

const codeMasterBrain = new CodeMasterBrain();

codeMasterBrain.initialize().catch(console.error);

process.on("message", (msg) => {
  if (msg === "learn-mode-on") {
    codeMasterBrain.toggleLearningMode(true);
  } else if (msg === "learn-mode-off") {
    codeMasterBrain.toggleLearningMode(false);
  }
});

module.exports = { CodeMasterBrain, codeMasterBrain };

if (typeof global !== "undefined") {
  global.CodeMasterBrain = CodeMasterBrain;
  global.codeMasterBrain = codeMasterBrain;
}
